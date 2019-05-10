/*jshint esversion:6*/

/////////////////////////////////////////////////////////////////
/*********************** helper fns ****************************/
/////////////////////////////////////////////////////////////////

/***************** create chart from data **********************/

function setup(data) {
  let buildChart = document.createElement('div');
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

    $(buildChart).append(newdiv);

  } //end for loop of data entries

return buildChart;
} //fn setup




/*************** customize the chart with options **************/

function customize(changes) {

  /* bar specifc customizations */
  let labels = $('div.bar-num').map(function() {
    //label colour:
    $(this).css('color', changes.bars.labelColour);

    //label position:
    $(this).map(function() {
      console.log(this);
      let top = this.clientHeight;
      let center = top/2;
      let bottom = 0;
      if (changes.bars.labelLocation === "center") {
        $(this).clientHeight = center;
      } else if (changes.bars.labelLocation === "bottom"){
        $(this).clientHeight = bottom;
        }
console.log(changes.bars.labelLocation, this.clientHeight);
    });




    return;
  });





return;
} //fn customize



/////////////////////////////////////////////////////////////////
/*********************** main function *************************/
/////////////////////////////////////////////////////////////////

function drawBarChart(dataSet, options, element){

  /* create chart from data at element location */
  let chart = setup(dataSet);
  $(chart).attr('id', 'chart');
  console.log(element.insertAdjacentElement("afterend", chart));

  /* allow chart customization */
  customize(options);

} //fn drawBarChart



/****************** run drawBarChart with inputs *******************/

let custom = {
  title: {
      titleColor: null,
      titleFont: null,
      titleName: null
    },
  chart: {
      width: null,
      height: null,
      axesX: null,
      axesY: null
    },
  bars: {
      barColor: null,
      labelColour: "SlateBlue",
      barSpace: null,
      labelLocation: "bottom"
}};


drawBarChart([1, 4, 2, 10, 6, 5], custom, document.getElementById("yaxis"));
