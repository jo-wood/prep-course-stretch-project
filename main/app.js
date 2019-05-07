/*jshint esversion:6*/


function drawBarChart(data, options, element){

for (let num of data) {
  var newdiv = document.createElement( "div" ),
    existingdiv1 = document.getElementById( "root" );

    $(newdiv).append(num);

console.log($( "body" ).append([ newdiv, existingdiv1 ]));


}







} //drawBarChart

drawBarChart([1, 2, 3, 4, 5]);

// ie data = [1, 2, 3, 4, 5]
// ie options should be object for options of chart (width, height of chart)
// ie element should be DOM element or Jquery element that the chart will get rendered into
