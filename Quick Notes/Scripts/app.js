var currentUserName;
var t = true;
var f = false;
var regExLink = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;
var taskListName = 'Tasks'
var ppUserIds = [];
var ppDivs = ["nameOfPicker"];
var uId = ppUserIds[0];
var loadMethod = false;
var noteIdForPeoplePicker;
var noteIdForDatePicker;

$(document).ready(function () { 
    console.log("Document Ready: The magic can start!")

    getCurrentUser();
    grid = document.querySelector('.grid');

    msnry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer',
        percentPosition: true,
        transitionDuration: '0.1s'
    });

    readNotes();

    clickGeneralButtons();

    startColorpickers();

    FastClick.attach(document.body);

    InitializePeoplePickers();

    $('#date').datepicker({
        dateFormat: "mm/dd/yy"
    });
});

function startColorpickers() {
    $("#colorpickerUpdateNote").imagepicker({
        show_label: false,
    });
}

function clickGeneralButtons() {
    $("#fixedbutton").unbind("click");
    $('#fixedbutton').bind('click', function () {
        createNote();
    });

    $("#btnUpdateNote").unbind("click");
    $("#btnUpdateNote").bind('click', function () {
        $('#updateNoteModal').modal('hide');
        $("#btnUpdateNote").prop("disabled", true);
        var idNoteToHandle = $(this).attr("data-id");
        updateNoteColor(idNoteToHandle);
    });

    $(".filterAll").unbind("click");
    $('.filterAll').bind('click', function () {
        readNotes();
    });

    $(".filterMy").unbind("click");
    $('.filterMy').bind('click', function () {
        readMyNotes();
    });
}


function clickNoteButtons() {
    $(".actionRemove").unbind("click");
    $(".actionRemove").bind('click', function () {
        var idNoteToHandle = $(this).attr("data-id");
        $("div.grid-item[data-id='" + idNoteToHandle + "']").remove();
        msnry.layout();
        deleteNote(idNoteToHandle);
    });

    $(".actionColor").unbind("click");
    $(".actionColor").bind('click', function () {
        var idNoteToHandle = $(this).attr("data-id");
        readNoteToUpdate(idNoteToHandle);
    });

    $(".actionPeoplePicker").unbind("click");
    $(".actionPeoplePicker").bind('click', function () {
        var idNoteToHandle = $(this).attr("data-id");
        $('#btnUpdatePeoplePickerNote').attr("data-id", idNoteToHandle);
        $('#peoplePickerNoteModal').modal('show');
    });

    $(".actionDatePicker").unbind("click");
    $(".actionDatePicker").bind('click', function () {
        var idNoteToHandle = $(this).attr("data-id");
        $('#btnUpdateDatePickerNote').attr("data-id", idNoteToHandle);
        $('#datePickerNoteModal').modal('show');
    });

    $(".noteText").unbind("click");
    $(".noteText").bind('click', function (e) {
        if ($(e.target).is('a')) return;

        var idNoteToHandle = $(this).attr("data-id");
        closeEditModus();
        $("p.noteText[data-id='" + idNoteToHandle + "']").hide();
        $("h4[data-id='" + idNoteToHandle + "']").hide();
        $(".boxeToolbar[data-id='" + idNoteToHandle + "']").hide();
        $("div.editItem[data-id='" + idNoteToHandle + "']").show();
        autosize.update($('textarea'));
        msnry.layout();
    });

    $("#btnUpdatePeoplePickerNote").unbind("click");
    $("#btnUpdatePeoplePickerNote").bind('click', function () {
        noteIdForPeoplePicker = $(this).attr("data-id");
        getUserInfo(callbackGetUserInfo);
        $('#peoplePickerNoteModal').modal('hide');
    });

    $("#btnUpdateDatePickerNote").unbind("click");
    $("#btnUpdateDatePickerNote").bind('click', function () {
        noteIdForDatePicker = $(this).attr("data-id");
        updateNoteDate();
        $('#datePickerNoteModal').modal('hide');
    });
    
    $(".actionDeleteAssigneTo").unbind("click");
    $(".actionDeleteAssigneTo").bind('click', function () {
        var idNoteToHandle = $(this).attr("data-id");
        removeUserToNote(idNoteToHandle);
        $(".assignedTo[data-id='" + idNoteToHandle + "']").remove();
    });

    $(".editNoteSave").unbind("click");
    $(".editNoteSave").bind('click', function () {
        var idNoteToHandle = $(this).attr("data-id");
        updateNoteTextStart(idNoteToHandle);
    });

    $("textarea").unbind("keydown");
    $('textarea').bind('keydown', function (e) {
        if (e.which == 13 && (event.ctrlKey || event.metaKey)) {
            var idNoteToHandle = $(this).attr("data-id");
            updateNoteTextStart(idNoteToHandle);
        } else if (e.which == 27) {
            closeEditModus();
        };
    });

    /*
    $("textarea").unbind("keyup");
    $('textarea').bind('keyup', function (e) {
        if (e.which == 13) {
            msnry.layout();
        } else if (e.which == 8) {
            msnry.layout();
        };
    });
    */

    $("textarea").unbind("autosize:resized");
    $("textarea").bind('autosize:resized', function () {
        msnry.layout();
    });

    $(".editNoteQuit").unbind("click");
    $(".editNoteQuit").bind('click', function () {
        closeEditModus()
    });
}

function closeEditModus() {
    $("div.editItem").hide();
    $("h4").show();
    $("p").show();
    $(".boxeToolbar").show();
    msnry.layout();
}

function updateNoteTextStart(id) {

    var textclean = $("textarea[data-id='" + id + "']").val();
    if (textclean == "") {
        textclean = "empty note :("
    }

    var text = textclean;
    if (text.match("/\r?\n/g") != null) {
        text = text.replace(/\r?\n/g, '<br />');
    }

    text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    if (text.match(regExLink) != null) {
        text = text.replace(regExLink, "<a href='$1' target='_blank'>$1</a>");
    }

    $("p.noteText[data-id='" + id + "']").html(text);
    closeEditModus();
    updateNoteText(id, textclean);
}

function getCurrentUser() {
    $.ajax({

        url: _spPageContextInfo.webServerRelativeUrl +
             "/_api/Web/CurrentUser/?$select=Title",
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },

        success: function (data) {
            currentUserName = data.d.Title;
        },
        error: function (err) {
            console.log(JSON.stringify(err));
        }
    });
}

function createNote() {

    $.ajax({
        url: _spPageContextInfo.webServerRelativeUrl +
                 "/_api/web/lists/getByTitle('" + taskListName + "')/items",
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(
            {
                '__metadata': {
                    'type': 'SP.Data.TasksListItem'
                },
                'Body': "new note :)",
                'NoteBackgroundColor': "#FFE228",
            }),
        headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {

            appendItem(data.d.Id, data.d.Body, data.d.NoteBackgroundColor, data.d.Modified, currentUserName , null, null);

            msnry.reloadItems();
            msnry.layout();
            autosize($('textarea'));
            clickNoteButtons();
        },
        error: function (err) {
            console.log(JSON.stringify(err));
        }
    });
}

function readNotes() {
    $.ajax({
        url: _spPageContextInfo.webServerRelativeUrl +
             "/_api/web/lists/getbytitle('" + taskListName + "')/items?$select=Id,PercentComplete,Body,NoteBackgroundColor,Modified,DueDate,Author/Name,Author/Title,AssignedTo/Title&$filter=PercentComplete ne 100 &$orderby=Created asc&$expand=Author/Id,AssignedTo/Id&$top=5000",
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },

        success: function (data) {
            var results = data.d.results;
            $(".item").remove();

            for (var i = 0; i < results.length; i++) {
                var AssignedToUser = null
                if (results[i].AssignedTo.results != undefined) {
                    AssignedToUser = results[i].AssignedTo.results[0].Title;
                }
                var DateText = null
                if (results[i].DueDate != '') {
                    DateText = results[i].DueDate
                }

                appendItem(results[i].Id, results[i].Body, results[i].NoteBackgroundColor, results[i].Modified, results[i].Author.Title, AssignedToUser, DateText);
            }
            msnry.reloadItems();
            msnry.layout();
            autosize($('textarea'));
            clickNoteButtons();
        },
        error: function (err) {
            console.log(JSON.stringify(err));
        }
    });
}

function readMyNotes() {
    $.ajax({
        url: _spPageContextInfo.webServerRelativeUrl +
             "/_api/web/lists/getbytitle('" + taskListName + "')/items?$select=Id,PercentComplete,Body,NoteBackgroundColor,Modified,DueDate,Author/Name,Author/Title,AssignedTo/Title,AssignedTo/Id&$filter=(PercentComplete ne 100) and (AssignedTo/Id eq " + _spPageContextInfo.userId + ") &$orderby=Created asc&$expand=Author/Id,AssignedTo/Id&$top=5000",
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },

        success: function (data) {
            var results = data.d.results;
            $(".item").remove();

            for (var i = 0; i < results.length; i++) {
                var AssignedToUser = null
                if (results[i].AssignedTo.results != undefined) {
                    AssignedToUser = results[i].AssignedTo.results[0].Title;
                }
                var DateText = null
                if (results[i].DueDate != '') {
                    DateText = results[i].DueDate
                }

                appendItem(results[i].Id, results[i].Body, results[i].NoteBackgroundColor, results[i].Modified, results[i].Author.Title, AssignedToUser, DateText);
            }
            msnry.reloadItems();
            msnry.layout();
            autosize($('textarea'));
            clickNoteButtons();
        },
        error: function (err) {
            console.log(JSON.stringify(err));
        }
    });
}

function appendItem(boxeId, boxeText, boxeNoteBackgroundColor, boxeModified, boxeAuthorTitle, assignedToUser, dueDateTime) {
    var y = new Date(boxeModified);
    var modified_year = y.getFullYear();
    var modified_month = ("0" + (y.getMonth() + 1)).slice(-2);
    var modified_day = ("0" + y.getDate()).slice(-2);
    var modified_hours = ("0" + y.getHours()).slice(-2);
    var modified_minutes = ("0" + y.getMinutes()).slice(-2);
    var modified_date = modified_day + "." + modified_month + "." + modified_year + " - " + modified_hours + ":" + modified_minutes;

    var text;
    text = boxeText;
    if (text.match("/\r?\n/g") != null) {
        text = text.replace(/\r?\n/g, '<br />');
    }

    text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    if (text.match(regExLink) != null) {
        text = text.replace(regExLink, "<a href='$1' target='_blank'>$1</a>");
    }

    var assignedTo = ''
    if (assignedToUser != null) {
        assignedTo = '<p data-id="' + boxeId + '" class="assignedTo">Assigned To: ' + assignedToUser + ' - <a href="#" class="actionDeleteAssigneTo" data-id="' + boxeId + '">x</a></p>'
    }
    var dueDate = ''
    if (dueDateTime != null) {
        var dateValue = new Date(dueDateTime);
        var dateValue_year = dateValue.getFullYear();
        var dateValue_month = ("0" + (dateValue.getMonth() + 1)).slice(-2);
        var dateValue_day = ("0" + dateValue.getDate()).slice(-2);
        var dateDisplayValue = dateValue_day + "." + dateValue_month + "." + dateValue_year;

        dueDate = '<p data-id="' + boxeId + '" class="dateText">Due Date: ' + dateDisplayValue + '</p>'
    }

    var createdByLine = '<p class="itemCreatedBy">Created by: ' + boxeAuthorTitle + '</p>';
    var lastModifiedLine = "<p class='itemModified'>Modified: " + modified_date + "</p>";
    var noteTextArea = '<div data-id="' + boxeId + '" class="editItem"><textarea data-id="' + boxeId + '" class="form-control" rows="1">' + boxeText + '</textarea></div>'
    var itemButtons = '<div data-id="' + boxeId + '" class="itemBot boxeToolbar"><div data-id="' + boxeId + '" class="itemBotButton actionPeoplePicker"><span class="icon-note glyphicon glyphicon-user" style="font-size: xx-large;"></span></div><div  data-id="' + boxeId + '" class="itemBotButton actionDatePicker"><span class="icon-note glyphicon glyphicon-calendar" style="font-size: xx-large;"></span></div><div data-id="' + boxeId + '" class="itemBotButton actionColor"><span class="icon-note glyphicon glyphicon-tint" style="font-size: xx-large;"></span></div><div data-id="' + boxeId + '" class="itemBotButton actionRemove"><span class="icon-note glyphicon glyphicon-remove" style="font-size: xx-large;"></span></div></div>'
    var editButtonBar = '<div data-id="' + boxeId + '" class="itemBot editItem"><div data-id="' + boxeId + '" class="itemBotButton editNoteSave"><span class="icon-note glyphicon glyphicon-ok" style="font-size: xx-large;"></span></div><div data-id="' + boxeId + '" class="itemBotButton editNoteQuit"><span class="icon-note glyphicon glyphicon-remove" style="font-size: xx-large;"></span></div></div>'
    var boxe = $("<div data-id='" + boxeId + "' class='grid-item item' style='background-color: " + boxeNoteBackgroundColor + ";'><div data-id='" + boxeId + "' class='itemTop'><h4 data-id='" + boxeId + "' class='noteh4'></h4><p data-id='" + boxeId + "' class='noteText'>" + text + "</p>" + noteTextArea + createdByLine + lastModifiedLine + assignedTo + dueDate + "</div>" + itemButtons + editButtonBar + "</div>");

    // append items to grid
    $(".grid").prepend(boxe);
}

function readNoteToUpdate(id) {
    $.ajax({
        url: _spPageContextInfo.webServerRelativeUrl +
             "/_api/web/lists/getByTitle('" + taskListName + "')/getItemByStringId('" + id + "')?$select=Id,AuthorId,Body,NoteBackgroundColor,Modified",
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },

        success: function (data) {
            $("#colorpickerUpdateNote option[value='" + data.d.NoteBackgroundColor + "']").prop('selected', true);
            $("#colorpickerUpdateNote").data('picker').sync_picker_with_select();
            var y = new Date(data.d.Modified);
            var modified_year = y.getFullYear();
            var modified_month = ("0" + (y.getMonth() + 1)).slice(-2);
            var modified_day = ("0" + y.getDate()).slice(-2);
            var modified_hours = ("0" + y.getHours()).slice(-2);
            var modified_minutes = ("0" + y.getMinutes()).slice(-2);
            var modified_date = modified_day + "." + modified_month + "." + modified_year + " - " + modified_hours + ":" + modified_minutes;
            $('#modifiedUpdateNote').html("");
            $("<p style='text-align: right;font-size: small;margin-bottom: auto;'>Modified: " + modified_date + "</p>").appendTo("#modifiedUpdateNote")
            $("#btnUpdateNote").attr("data-id", data.d.Id);

            $('#updateNoteModal').modal('show');
        },
        error: function (err) {
            console.log(JSON.stringify(err));
        }
    });
}

function updateNoteText(id, text) {
    $.ajax({
        url: _spPageContextInfo.webServerRelativeUrl +
            "/_api/web/lists/getByTitle('" + taskListName + "')/getItemByStringId('" + id + "')",
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(
        {
            '__metadata': {
                'type': 'SP.Data.TasksListItem'
            },
            'Body': text,
        }),
        headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "IF-MATCH": "*",
            "X-Http-Method": "PATCH"
        },
        success: function (data) {
        },
        error: function (err) {
            console.log(JSON.stringify(err));
        }
    });
}

function updateNoteColor(id) {
    var pickedColor = $('#colorpickerUpdateNote').val()
    $.ajax({
        url: _spPageContextInfo.webServerRelativeUrl +
            "/_api/web/lists/getByTitle('" + taskListName + "')/getItemByStringId('" + id + "')",
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(
        {
            '__metadata': {
                'type': 'SP.Data.TasksListItem'
            },
            'NoteBackgroundColor': pickedColor,
        }),
        headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "IF-MATCH": "*",
            "X-Http-Method": "PATCH"
        },
        success: function (data) {
            $("div.item[data-id='" + id + "']").css("background-color", pickedColor);
            $("#btnUpdateNote").removeAttr('disabled');
        },
        error: function (err) {
            console.log(JSON.stringify(err));
        }
    });
}

function updateNoteDate() {
    if ($('#date').val() == '') {
        $(".dateText[data-id='" + noteIdForDatePicker + "']").remove();
        $.ajax({
            url: _spPageContextInfo.webServerRelativeUrl +
                "/_api/web/lists/getByTitle('" + taskListName + "')/getItemByStringId('" + noteIdForDatePicker + "')",
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(
            {
                '__metadata': {
                    'type': 'SP.Data.TasksListItem'
                },
                'DueDate': null,
            }),
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "IF-MATCH": "*",
                "X-Http-Method": "PATCH"
            },
            success: function (data) {

            },
            error: function (err) {
                console.log(JSON.stringify(err));
            }
        });
    } else {
        var dateValue = new Date($('#date').val());
        $(".dateText[data-id='" + noteIdForDatePicker + "']").remove();
        var dateValue_year = dateValue.getFullYear();
        var dateValue_month = ("0" + (dateValue.getMonth() + 1)).slice(-2);
        var dateValue_day = ("0" + dateValue.getDate()).slice(-2);
        var dateDisplayValue = dateValue_day + "." + dateValue_month + "." + dateValue_year;

        $(".itemTop[data-id='" + noteIdForDatePicker + "']").append('<p data-id="' + noteIdForDatePicker + '" class="dateText">Due Date: ' + dateDisplayValue + '</p>')
        msnry.layout();
        $.ajax({
            url: _spPageContextInfo.webServerRelativeUrl +
                "/_api/web/lists/getByTitle('" + taskListName + "')/getItemByStringId('" + noteIdForDatePicker + "')",
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(
            {
                '__metadata': {
                    'type': 'SP.Data.TasksListItem'
                },
                'DueDate': new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate()),
            }),
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "IF-MATCH": "*",
                "X-Http-Method": "PATCH"
            },
            success: function (data) {

            },
            error: function (err) {
                console.log(JSON.stringify(err));
            }
        });
    }

}

function deleteNote(id) {
    $.ajax({
        url: _spPageContextInfo.webServerRelativeUrl +
            "/_api/web/lists/getByTitle('" + taskListName + "')/getItemByStringId('" + id + "')",
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(
        {
            '__metadata': {
                'type': 'SP.Data.TasksListItem'
            },
            'PercentComplete': 100
        }),
        headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "IF-MATCH": "*",
            "X-Http-Method": "PATCH"
        },
        success: function (data) {
        },
        error: function (err) {
            console.log(JSON.stringify(err));
        }
    });
}

function InitializePeoplePickers() {
    for (var i = 0; i < ppDivs.length; i++) {
        var ppDivActualElement = ppDivs[i];
        // Create a schema to store picker properties, and set the properties.
        var schema = {};
        schema['PrincipalAccountType'] = 'User,SecGroup';
        schema['SearchPrincipalSource'] = 15;
        schema['ResolvePrincipalSource'] = 15;
        schema['AllowMultipleValues'] = false;
        schema['MaximumEntitySuggestions'] = 10;
        schema['Width'] = '100%';
        // Render and initialize the picker.
        // Pass the ID of the DOM element that contains the picker, an array of initial
        // PickerEntity objects to set the picker value, and a schema that defines
        // picker properties.
        SPClientPeoplePicker_InitStandaloneControlWrapper(ppDivActualElement, null, schema);
    }
}


function callbackGetUserInfo() {
};

function getUserInfo(method) {

    var peoplepickerArray = []
    //Push your peoplepicker div in an array
    peoplepickerArray.push(this.SPClientPeoplePicker.SPClientPeoplePickerDict.nameOfPicker_TopSpan);


    for (var i = 0; i < peoplepickerArray.length; i++) {
        var keys = peoplepickerArray[i].GetAllUserKeys();
        ensureUser(keys, i);
        var userIdInterval = setInterval(function () { trySaveUserId() }, 100);
        function trySaveUserId() {
            if (ppUserIds.length == $('classOfPicker').length) {
                clearInterval(userIdInterval);
                if (!loadMethod) {
                    loadMethod = true;
                    method();
                }
                else {
                    return;
                }

            }
        }
    }
}

function ensureUser(logonName, index) {
    if (logonName == "") {
        return;
    } else {
        var encKey = logonName.replace("\\", "\\\\");
        $.ajax({
            url: _spPageContextInfo.webServerRelativeUrl + "/_api/web/ensureuser",
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: "{ 'logonName': '" + encKey + "' }",
            headers: {
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "accept": "application/json;odata=verbose"
            },
            success: function () {
                getUserIds(logonName, index);
            },
            error: function (err) {
                console.log(JSON.stringify(err));
            }
        });
    }
}

function getUserIds(keys, index) {
    var loginNameResolve = encodeURIComponent(keys);
    $.ajax({
        url: _spPageContextInfo.webServerRelativeUrl +
            "/_api/web/siteusers?$filter=LoginName eq '" + loginNameResolve + "'",
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
            var results = data.d.results;
            if (results.length != 0) {
                saveUserToNote(results[0].Id, results[0].Title)
            }
            
        },
        error: function (err) {
            console.log(JSON.stringify(err));
        }
    });
}

function saveUserToNote(idUser, titleUser) {
    $(".assignedTo[data-id='" + noteIdForPeoplePicker + "']").remove();
    $(".itemTop[data-id='" + noteIdForPeoplePicker + "']").append('<p data-id="' + noteIdForPeoplePicker + '" class="assignedTo">Assigned To: ' + titleUser + ' - <a href="#" class="actionDeleteAssigneTo" data-id="' + noteIdForPeoplePicker + '">x</a></p>')
    clickNoteButtons();
    msnry.layout();
    $.ajax({
        url: _spPageContextInfo.webServerRelativeUrl +
            "/_api/web/lists/getByTitle('" + taskListName + "')/getItemByStringId('" + noteIdForPeoplePicker + "')",
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(
        {
            '__metadata': {
                'type': 'SP.Data.TasksListItem'
            },
            'AssignedToId': {
                'results': [idUser]
            },
        }),
        headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "IF-MATCH": "*",
            "X-Http-Method": "PATCH"
        },
        success: function (data) {

        },
        error: function (err) {
            console.log(JSON.stringify(err));
        }
    });
}

function removeUserToNote(idNote) {
    $.ajax({
        url: _spPageContextInfo.webServerRelativeUrl +
            "/_api/web/lists/getByTitle('" + taskListName + "')/getItemByStringId('" + idNote + "')",
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(
        {
            '__metadata': {
                'type': 'SP.Data.TasksListItem'
            },
            'AssignedToId': {
                'results': []
            },
        }),
        headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "IF-MATCH": "*",
            "X-Http-Method": "PATCH"
        },
        success: function (data) {
            
        },
        error: function (err) {
            console.log(JSON.stringify(err));
        }
    });
}