var currentUserName;
var t = true;
var f = false;
var regExLink = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;
var taskListName = 'Tasks'

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

    $(".noteText").unbind("click");
    $(".noteText").bind('click', function (e) {
        if ($(e.target).is('a')) return;

        var idNoteToHandle = $(this).attr("data-id");
        closeEditModus();
        $("p[data-id='" + idNoteToHandle + "']").hide();
        $("h4[data-id='" + idNoteToHandle + "']").hide();
        $(".boxeToolbar[data-id='" + idNoteToHandle + "']").hide();
        $("div.editItem[data-id='" + idNoteToHandle + "']").show();
        autosize.update($('textarea'));
        msnry.layout();
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
        console.log("Quit");
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

    $("p[data-id='" + id + "']").html(text);
    closeEditModus();
    updateNoteText(id, textclean);
    console.log("Save");
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
                'Archiviert': f,
            }),
        headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            console.log(data);

            appendItem(data.d.Id, data.d.Body, data.d.NoteBackgroundColor, data.d.Modified, currentUserName);

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
             "/_api/web/lists/getbytitle('" + taskListName + "')/items?$select=Id,Body,NoteBackgroundColor,Modified,Author/Name,Author/Title&$filter=Archiviert eq 0 &$orderby=Created asc&$expand=Author/Id&$top=5000",
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },

        success: function (data) {
            var results = data.d.results;
            $(".item").remove();

            for (var i = 0; i < results.length; i++) {
                appendItem(results[i].Id, results[i].Body, results[i].NoteBackgroundColor, results[i].Modified, results[i].Author.Title);
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
function appendItem(boxeId, boxeText, boxeNoteBackgroundColor, boxeModified, boxeAuthorTitle) {
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

    var createdByLine = '<p style="text-align: right;font-size: small;white-space: pre;overflow: hidden;display: -webkit-box;margin-bottom: auto;-webkit-line-clamp: 1; -webkit-box-orient: vertical;">Created by: ' + boxeAuthorTitle + '</p>';
    var lastModifiedLine = "<p style='text-align: right;font-size: small;margin-bottom: auto;'>Modified: " + modified_date + "</p>";
    var noteTextArea = '<div data-id="' + boxeId + '" class="editItem"><textarea data-id="' + boxeId + '" class="form-control" rows="1">' + boxeText + '</textarea></div>'
    var itemButtons = '<div data-id="' + boxeId + '" class="itemBot boxeToolbar"><div data-id="' + boxeId + '" class="itemBotButton"><span class="icon-note glyphicon glyphicon-user" style="font-size: xx-large;"></span></div><div  data-id="' + boxeId + '" class="itemBotButton"><span class="icon-note glyphicon glyphicon-calendar" style="font-size: xx-large;"></span></div><div data-id="' + boxeId + '" class="itemBotButton actionColor"><span class="icon-note glyphicon glyphicon-tint" style="font-size: xx-large;"></span></div><div data-id="' + boxeId + '" class="itemBotButton actionRemove"><span class="icon-note glyphicon glyphicon-remove" style="font-size: xx-large;"></span></div></div>'
    var editButtonBar = '<div data-id="' + boxeId + '" class="itemBot editItem"><div data-id="' + boxeId + '" class="itemBotButton editNoteSave"><span class="icon-note glyphicon glyphicon-ok" style="font-size: xx-large;"></span></div><div data-id="' + boxeId + '" class="itemBotButton editNoteQuit"><span class="icon-note glyphicon glyphicon-remove" style="font-size: xx-large;"></span></div></div>'
    var boxe = $("<div data-id='" + boxeId + "' class='grid-item item' style='background-color: " + boxeNoteBackgroundColor + ";'><div class='itemTop'><h4 data-id='" + boxeId + "' class='noteh4'></h4><p data-id='" + boxeId + "' class='noteText'>" + text + "</p>" + noteTextArea + createdByLine + lastModifiedLine + "</div>" + itemButtons + editButtonBar + "</div>");

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
            console.log("updateNoteText DONE")
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
            'Archiviert': t,
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

function CheckTextAreaHeight(tarea) {
    var nCounter = 1;
    var sNeedle = "\n";

    for (var i = 0; i < tarea.value.length; i++) {
        if (sNeedle == tarea.value.substr(i, sNeedle.length)) {
            nCounter++;
        }
    }
    tarea.rows = nCounter;
}