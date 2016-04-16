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
    <meta charset="utf-8">
    <meta name="WebPartPageExpansion" content="full" />
    <meta name=apple-mobile-web-app-capable content=yes />
    <meta name=apple-mobile-web-app-status-bar-style content=black />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <link rel="shortcut icon" href="../Images/AppIcon.png" type="image/x-icon" />

    <!-- CSS -->
    <link href="../Content/css/bootstrap.css" rel="stylesheet" />
    <link href="../Content/css/bootstrap-responsive.css" rel="stylesheet" />
    <link href="../Content/css/style.css" rel="stylesheet" />
    <link href="../Content/css/image-picker.css" rel="stylesheet" />



</head>

<body>
    <form runat="server">
        <SharePoint:FormDigest ID="FormDigest1" runat="server"></SharePoint:FormDigest>
    </form>

    <!-- Navbar -->
    <nav class="navbar navbar-inverse">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="#!">
                    <img alt="Brand" width="20" height="20" src="../Images/AppIcon.png">
                </a>
                <a class="navbar-brand" style="color: #ffffff;text-decoration: initial;" href="#!">
                    Quick Notes
                </a>
            </div>
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            </div>
        </div>
    </nav>

    <div class="grid">
        <div class="grid-sizer"></div>
        <div class="gutter-sizer"></div>
     </div>



	<!-- Footer -->
    <div class="footer">
        <div class="container">
            <div class="row">
                <div class="span3"></div>
                <div class="span6">
                    Quick Notes © built by
                    <a class="scriptogram-link" href="https://collaboration.swisscom.com/swisscomperson.aspx?accountname=CORPROOT\TGDVOJO7">Jonas Voland</a>
                    <p>Enjoy it. :)</p>
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
                    <h4 class="modal-title" id="updateNoteModalLabel">Change Note</h4>
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
    
    <div id="fixedbutton"><div id="fixedbuttonIcon">+</div></div>

        <!-- JavaScript -->
    <script type="text/javascript" src="/_layouts/1033/init.js"></script>
    <script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.core.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="../Scripts/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="../Scripts/jquery.mobile.custom.min.js"></script>
    <script type="text/javascript" src="../Scripts/masonry.min.js"></script>
    <script type="text/javascript" src="../Scripts/whereTheMagicHappens.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.js"></script>
    <script type="text/javascript" src="../Scripts/autosize.min.js"></script>
    <script type="text/javascript" src="../Scripts/image-picker.js"></script>
</body>
</html>
