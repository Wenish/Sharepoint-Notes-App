<!DOCTYPE html>
<%@ Page language="C#" %>
<%@ Register Tagprefix="SharePoint"
     Namespace="Microsoft.SharePoint.WebControls"
     Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<html>
<head>
    <title>Quick Notes</title>

    <!-- Meta Tags -->
    <meta http-equiv="X-UA-Compatible" content="IE=10; IE=9; IE=8; IE=7;" />
    <meta charset="utf-8">
    <meta name="WebPartPageExpansion" content="full" />
    <meta name=apple-mobile-web-app-capable content=yes />
    <meta name=apple-mobile-web-app-status-bar-style content=black />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <link rel="apple-touch-icon" sizes="57x57" href="../Images/appIcons/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="../Images/appIcons/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="../Images/appIcons/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="../Images/appIcons/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="../Images/appIcons/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="../Images/appIcons/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="../Images/appIcons/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="../Images/appIcons/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="../Images/appIcons/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="../Images/appIcons/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../Images/appIcons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="../Images/appIcons/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../Images/appIcons/favicon-16x16.png">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">

    <!-- CSS -->
    <link href="../Content/css/jquery-bootstrap-datepicker.css" rel="stylesheet" />
    <link href="../Content/css/SPCoreStyles.css" rel="stylesheet" />
    <link href="../Content/css/bootstrap.css" rel="stylesheet" />
    <link href="../Content/css/bootstrap-responsive.css" rel="stylesheet" />
    <link href="../Content/css/style.css" rel="stylesheet" />
    <link href="../Content/css/image-picker.css" rel="stylesheet" />
</head>

<body>
    <!-- Sharepoint Auth From -->
    <form runat="server">
        <SharePoint:FormDigest ID="FormDigest1" runat="server"></SharePoint:FormDigest>
    </form>

    <div class="filterNav"><a href="#" class="filterAll">All</a> - <a href="#" class="filterMy">My</a></div>
    <!-- Grid -->
    <div class="grid">
        <div class="grid-sizer"></div>
        <div class="gutter-sizer"></div>
     </div>



	<!-- Footer -->
    <div class="footer">
        <div>
            <div class="row">
                <div class="span3"></div>
                <div class="span6">
                    Quick Notes is an open source project. Find it on 
                    <a target="_blank" class="scriptogram-link" href="https://github.com/Wenish/Sharepoint-Notes-App">GitHub</a>
                </div>
                <div class="span3"></div>
            </div>
        </div>
    </div>


    <!-- Modal Update Note -->
    <div class="modal fade" id="updateNoteModal" tabindex="-1" role="dialog" aria-labelledby="updateNoteModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="updateNoteModalLabel">Color Note</h4>
                </div>
                <div class="modal-body">
                    <select class="image-picker show-html" id="colorpickerUpdateNote">
                        <!-- https://color.adobe.com/de/Smooth-Summer-color-theme-7332083/ -->
                        <option data-img-src="../Images/transparent-background.png" value="#E8790C" class="badgeselection">RGB 232 121 12</option>
                        <option data-img-src="../Images/transparent-background.png" value="#FFB813" class="badgeselection">RGB 255 184 19</option>
                        <option data-img-src="../Images/transparent-background.png" value="#FFE228" class="badgeselection">RGB 255 226 40</option>
                        <option data-img-src="../Images/transparent-background.png" value="#2FE8A9" class="badgeselection">RGB 47 232 169</option>
                        <option data-img-src="../Images/transparent-background.png" value="#008689" class="badgeselection">RGB 0 134 137</option>
                    </select>
                    <div id="modifiedUpdateNote"><!-- <p style="text-align: right;font-size: small;margin-bottom: auto;">07.09.2015 - 00:32</p> --></div>
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <input data-id="" id="btnUpdateNote" class="btn btn-primary" type="button" value="Save Changes">
                </div>
            </div>
        </div>
    </div>

    <!-- Modal People Picker -->
    <div class="modal fade" id="peoplePickerNoteModal" tabindex="-1" role="dialog" aria-labelledby="updateNoteModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="peoplePickerModalLabel">Assign Note</h4>
                </div>
                <div class="modal-body">
                    <div id="nameOfPicker"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <input data-id="" id="btnUpdatePeoplePickerNote" class="btn btn-primary" type="button" value="Save Changes">
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Date Picker -->
    <div class="modal fade" id="datePickerNoteModal" tabindex="-1" role="dialog" aria-labelledby="updateNoteModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="datePickerModalLabel">Due Note To</h4>
                </div>
                <div class="modal-body">
                    <input type="text" placeholder="MM/DD/YYYY" id="date" />
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <input data-id="" id="btnUpdateDatePickerNote" class="btn btn-primary" type="button" value="Save Changes">
                </div>
            </div>
        </div>
    </div>
    
    <div id="fixedbutton"><div id="fixedbuttonIcon">+</div></div>

    <!-- JavaScript -->
    <script type="text/javascript" src="/_layouts/15/core.js"></script>
    <script type="text/javascript" src="/_layouts/1033/init.js"></script>
    <script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.core.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <SharePoint:ScriptLink name="clienttemplates.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="clientforms.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="clientpeoplepicker.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="autofill.js" runat="server" LoadAfterUI="true" Localizable="false" />

    <script type="text/javascript" src="../Scripts/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="../Scripts/jquery.mobile.custom.min.js"></script>
    <script type="text/javascript" src="../Scripts/jquery-ui.js"></script>
    <script type="text/javascript" src="../Scripts/masonry.min.js"></script>
    <script type="text/javascript" src="../Scripts/app.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.js"></script>
    <script type="text/javascript" src="../Scripts/autosize.min.js"></script>
    <script type="text/javascript" src="../Scripts/image-picker.js"></script>
    <script type="text/javascript" src="../Scripts/moment-with-locales.min.js"></script>
    <script type="text/javascript" src="../Scripts/fastclick.js"></script>
</body>
</html>