/*jshint esversion:6*/

/////////////////////////////////////////////////////////////////
/*********************** helper fns ****************************/
/////////////////////////////////////////////////////////////////

/*  global scopes:  */

let barFraction;
let barWidth;
let xlabels = {};

/***************** create chart from data **********************/

function setup(data) {
  let correctDataOrder = data.slice(); //store data without mutating
  let buildChart = document.createElement('div');
  let revData = data.reverse(); // bc flipped in css for styling

  barFraction = (100 - data.length) / data.length;

  /** add bars **/
  for (let num of data) {
    let dataLabel = "<p>" + num + "</p>";
    var newdiv = document.createElement( "div" );
      $(newdiv).append(dataLabel);
      $(newdiv).addClass("bar-num");
      $(newdiv).attr('id', num);

    let dataIndex = correctDataOrder.indexOf(num);
    Object.keys(xlabels[num] = "Index:" + dataIndex);

    /** set bar widths **/
      barWidth = Math.floor(barFraction) + "%";
      $(newdiv).css("width", barWidth); // bar width same for all

    /** create each bars height based on entry value **/
      let newheight = num*10 + "%";
      $(newdiv).css("height" , newheight);

    $(buildChart).append(newdiv);

  } //end for loop of data entries

return buildChart;
} //fn setup


/***************** create y and x axis **********************/

function axesSetup(data, option, chartRoot){

  let rootHeight = $('#root')[0].offsetHeight; // account for ~10% as text height

/**x axis and xlabels **/
  $('body').append("<h2 id='xaxis'>x Axis</h2>");

  let xAxisLabels = document.createElement('div');
  $(xAxisLabels).attr("id", "axesLabels");

  for(let z = data.length - 1; z >= 0; z--){
    let storeValue = data[z];
    let xlabelId = 'dataValue-' + storeValue;
    $(xAxisLabels).append("<p class='xlabel' id='" + xlabelId + "'>" + xlabels[storeValue] + "</p>");
  }//data for loop

$("#root").append(xAxisLabels);
$('.xlabel').innerWidth(Math.ceil(barFraction) + "%");

//center xlabel div along with any chart's padding
if (option.chart.width !== null){
  $(axesLabels).css("width", option.chart.width);
  $(axesLabels).css("padding", $('#chart').css("padding"));
}

/** y axis  **/
  $(chartRoot).before("<h2 id='yaxis'>y Axis</h2>"); // to set left of chart
  $('#yaxis').addClass('wrap-chart');
  $('#yaxis').css('float', "left");

/** keep y axis relative to root **/
$('.wrap-chart').wrapAll("<div class='chart-wrapper' />");


return;
} //fn axesSetup

/*************** customize the chart with options **************/

function customize(changes) {

  /*** TITLE specifc customizations ***/
  $('#title').replaceWith("<h1 id='title'>" + changes.title.titleName + "<h1/>" );
    //original h1 not getting removed?
  $('#title').css('color', changes.title.titleColor);
  $('#title').css('font-family', changes.title.titleFont);

  /*** CHART specifc customizations ***/
  $('#chart').css('width', changes.chart.width);
  $('#root').css('width',  changes.chart.width);

  function chartHeight(newHeight){
    $('#chart').css('height', newHeight);
    $('#root').css('height', newHeight);
  }


  /*** BAR specifc customizations ***/
  let labels = $('div.bar-num').map(function() {

    //bar color:
    $(this).css('background-color', changes.bars.barColor);

    //bar space:
    let newMargin = changes.bars.barSpace + "%";
    barWidth = barFraction - changes.bars.barSpace + "%";
    $(this).css('width', barWidth);
    $(this).css('margin-left', newMargin);

    //label colour:
    $(this.children[0]).css('color', changes.bars.labelColour);

    //label position:
      function adjustBarLabels(barDiv){
        barDiv.map(function() {
          let top = this.offsetHeight;
          let center = this.offsetParent.offsetHeight/2 - top;
          let bottom = this.offsetParent.offsetHeight - top;

          if (changes.bars.labelLocation === "center") {
            $(this).css('margin-top', Math.abs(center));
          } else if (changes.bars.labelLocation === "bottom"){
            $(this).css('margin-top', Math.abs(bottom));
            }
        });
        return;
      }

    if(changes.chart.height === null){
      adjustBarLabels($(this.children[0]));
    } else {
      chartHeight(changes.chart.height);
      adjustBarLabels($(this.children[0]));
      }


});// fn labels


return;
} //fn customize


/////////////////////////////////////////////////////////////////
/*********************** main function *************************/
/////////////////////////////////////////////////////////////////

function drawBarChart(dataSet, options, element){

  /* create chart from data at element location */
  let chart = setup(dataSet);
  $(chart).attr('id', 'chart');
  $(element).append(chart);
  $(element).addClass('wrap-chart');

  /* allow chart customization */
  if(options !== null){
    customize(options);
  }


  /* add x and y axes relative to added chart */
  axesSetup(dataSet, options, element);




} //fn drawBarChart



/****************** run drawBarChart with inputs *******************/

let custom = {
  title: {
      titleColor: "coral",
      titleFont: "courier",
      titleName: "My Custom Bar Chart:"
    },
  chart: {
      width: 200,
      height: 200,
      axesX: null,
      axesY: null
    },
  bars: {
      barColor: "orange",
      labelColour: "tomato",
      barSpace: 3,
      labelLocation: "center"
}};


/*** UNIT TEST with no customizations passed ***/
//drawBarChart([1, 4, 2, 10, 6, 5], null, document.getElementById("root"));

/*** UNIT TEST with custom options ***/
drawBarChart([1, 4, 2, 10, 6, 5], custom, document.getElementById("root"));
