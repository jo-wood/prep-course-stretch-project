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
    let dataLabel = "<p>" + num + "</p>";
    var newdiv = document.createElement( "div" );
      $(newdiv).append(dataLabel);
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
    $(this.children[0]).css('color', changes.bars.labelColour);

    //label position:
    $(this.children[0]).map(function() {
      let top = this.offsetHeight;
      let center = this.offsetParent.offsetHeight/2 - top;
      let bottom = this.offsetParent.offsetHeight - top;
      if (changes.bars.labelLocation === "center") {
        $(this).css('margin-top', center);
      } else if (changes.bars.labelLocation === "bottom"){
        $(this).css('margin-top', bottom);
        }
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
  console.log(element.append(chart));

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
      labelColour: "Aquamarine",
      barSpace: null,
      labelLocation: "center"
}};


drawBarChart([1, 4, 2, 10, 6, 5], custom, document.getElementById("root"));
