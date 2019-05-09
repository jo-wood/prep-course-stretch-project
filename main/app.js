/*jshint esversion:6*/


function drawBarChart(data, options, element){


let revData = data.reverse(); // bc flipped in css for styling
let barMargins = 100 - data.length;


/** create chart **/


/** add bars **/
for (let num of revData) {
  var newdiv = document.createElement( "div" );
    $(newdiv).append(num);
    $(newdiv).addClass("bar-num");
    $('.bar-num:last').attr('id', num);

/** set bar widths **/
  let barWidth = Math.floor(barMargins/data.length) + "%";
    $(newdiv).css("width", barWidth); // bar width same for all

/** create each bars height based on entry value **/
  let newheight = num*10 + "%";
  $(newdiv).css("height" , newheight);



console.log($( "#chart" ).append(newdiv));


}







} //drawBarChart

drawBarChart([1, 4, 2, 10, 6, 5]);

// ie data = [1, 2, 3, 4, 5]
// ie options should be object for options of chart (width, height of chart)
// ie element should be DOM element or Jquery element that the chart will get rendered into
