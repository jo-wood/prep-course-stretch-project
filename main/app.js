/*jshint esversion:6*/


function drawBarChart(data, options, element){


let revData = data.reverse(); // bc flipped in css for styling

/** separate each data entry into own bar:**/
for (let num of revData) {
  var newdiv = document.createElement( "div" );
    $(newdiv).append(num);
    $(newdiv).addClass("bar-num");
    //$(newdiv).attr(".bar-num", num);

/** create each bars size based on entry value **/
  let newheight = num*10 + "%";
  $(newdiv).css("height" , newheight);



console.log($( "#chart" ).append(newdiv));


}







} //drawBarChart

drawBarChart([1, 4, 2, 4, 6]);

// ie data = [1, 2, 3, 4, 5]
// ie options should be object for options of chart (width, height of chart)
// ie element should be DOM element or Jquery element that the chart will get rendered into
