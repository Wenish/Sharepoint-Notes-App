makeboxes = function() {
    
   var boxes = new Array;   
   //var randImg = ['img/200_red.jpg', 'img/300_red.jpg', 'img/400_red.jpg', 'img/500_red.jpg','img/200_yellow.jpg', 'img/300_yellow.jpg', 'img/400_yellow.jpg', 'img/500_yellow.jpg'];
   
   var randTxt = [
   'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
   'Dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad ', 
   'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
   'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad.',
   'Duis aunt occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
   'Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 
   'Adipisicing elit, sed do eiusmod.', 
   'Fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
   ];
   var amount = Math.floor(Math.random()*10); if (amount == 0) amount = 1;
   for(i=0;i<amount;i++){
      num = Math.floor(Math.random()*randTxt.length)
      div = $('<div style="background-color: gold;"></div>').addClass('item');
      
      p = "<p>"+randTxt[num]+"</p><p style='text-align: right;font-size: small;margin-bottom: auto;'>06.09.2015 - 16:02</p>";
 
      div.append(p);
      boxes.push(div);
    }
    
    var boxes = $("<div data-id='4563456' class='item' style='background-color: gold;'><h4><span data-id='4563456' class='icon-note glyphicon glyphicon-remove'></span><span data-id='4563456' class='icon-note glyphicon glyphicon-pencil'></span></h4><p>This is a testnote.</p><p style='text-align: right;font-size: small;margin-bottom: auto;'>06.09.2015 - 16:02</p></div>");
    
    return boxes;
}