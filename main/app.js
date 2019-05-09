/*jshint esversion:6*/

/******************** create chart from data *************************/
//
//
//

function setup(data) {
  let chart = document.createElement('div');
  $(chart).attr('id', 'chart');

  let revData = data.reverse(); // bc flipped in css for styling
  let barMargins = 100 - data.length;

  /** add bars **/
  for (let num of data) {
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

$(chart).append(newdiv);

} //end for loop of data entries

return chart;
}

/******************** run final drawBarChart *************************/
//
//
//

function drawBarChart(input, options, element){

/********* create chart from data **********/
  let createChart = setup(input);

  let yaxis = document.getElementById("yaxis");


  console.log(yaxis.insertAdjacentElement("afterend", createChart));



} //fn drawBarChart

drawBarChart([1, 4, 2, 10, 6, 5]);






// ie data = [1, 2, 3, 4, 5]
// ie options should be object for options of chart (width, height of chart)
// ie element should be DOM element or Jquery element that the chart will get rendered into
