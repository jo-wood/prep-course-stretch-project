/*jshint esversion:6*/

/////////////////////////////////////////////////////////////////
/*********************** helper fns ****************************/
/////////////////////////////////////////////////////////////////

/*  global scopes:  */

let barFraction;
let barWidth;
let xlabels = {};
let yAxisSteps = 10;
let chartHeight;

/***************** create chart from data **********************/

function setup(data) {
  let correctDataOrder = data.slice(); //store data without mutating
  let buildChart = document.createElement('div');
  let revData = [...data].reverse(); // bc flipped in css for styling

  barFraction = (100 - data.length) / data.length;

  /** add bars **/
  for (let num of revData) {
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
      let newheight = num*yAxisSteps + "%";
      $(newdiv).css("height" , newheight);

    $(buildChart).append(newdiv);

  } //end for loop of data entries

return buildChart;
} //fn setup


/***************** create y and x axis **********************/

function axesSetup(datas, option, chartRoot){

/**x axis labels **/

    let xAxisLabels = document.createElement('div');
    $(xAxisLabels).attr("id", "axesXLabels");

    for(let z = 0; z < datas.length ; z++){
      let storeValue = datas[z];
      let xlabelId = 'dataValue-' + storeValue;
      $(xAxisLabels).append("<p class='xlabel' id='" + xlabelId + "'>" + xlabels[storeValue] + "</p>");
    }//datas for loop

    $("#root").append(xAxisLabels);
    $('.xlabel').innerWidth(Math.ceil(barFraction) + "%");

    //center xlabel div along with any chart's padding
    if (option !== null && option.chart.width !== null){
      $('.xlabel').css("color", option.chart.axesX);
      $(axesXLabels).css("width", option.chart.width);
      $(axesXLabels).css("padding", $('#chart').css("padding"));
    } else if (option === null) {
      $(axesXLabels).css("padding", $('#chart').css("padding"));
    }

/** y axis labels **/

    $(chartRoot).before("<h2 class='with-y' id='yaxis'>y Axis (%)</h2>"); // to set left of chart
    $('#yaxis').css('float', "left");

    let yAxisTicks = document.createElement('div');
    //$(yAxisTicks).addClass("wrap-chart");
    $(yAxisTicks).attr("id", "axesYTicks");

    let yscale = document.createElement("ul");

    //find highest num in array for number of yticks:
    //use es6 spread-syntax to sort without mutating original data:
    let sortedData = [...datas];
    sortedData.sort((a, b) => {return a - b;});

    let adjustTicks = chartHeight/yAxisSteps;
    let highestValue = sortedData[sortedData.length - 1];
    for (let i = 0; i < highestValue; i++){
        let ticks = "<p class='yticks' style='margin-bottom: " + adjustTicks + "'></p>";
        $(yAxisTicks).append(ticks);
        $(yscale).append( "<li>" + (highestValue - i)*yAxisSteps + "</li>" );
    }

  $('#root').prepend(yAxisTicks);

  // keep y axis relative to root
  $('.wrap-chart').wrapAll("<div class='chart-wrapper with-y' />");

  // add scale to y axis
  $('.chart-wrapper').prepend(yscale);

  // keep scales relative to ticks and root of chart
  $('li').css('line-height', (adjustTicks + "px"));
    //adjust margin by have the line-height for first tick
  $('ul').css('margin-top', (adjustTicks/2 + "px"));

/**x axis labels **/

    //add x axis title after yaxis and chart have been wrapped
    $('.chart-wrapper').append("<h2 id='xaxis'>x Axis</h2>");
    $('.with-y').wrapAll("<div class='chartWithY'></div>");

    let yaxisCentered = ($('#yaxis')[0].offsetHeight) / 2;
    $('#yaxis').css('margin-top', yaxisCentered);


return;
} //fn axesSetup


/*************** customize the chart with options **************/

function customize(changes) {

  function chartHeight(newHeight){
    $('#chart').css('height', newHeight);
    $('#root').css('height', newHeight);
  }

  if (changes !== null){
  /*** TITLE specifc customizations ***/
    $('#title').html(changes.title.titleName);
      //original h1 not getting removed?
    $('#title').css('color', changes.title.titleColor);
    $('#title').css('font-family', changes.title.titleFont);

    /*** CHART specifc customizations ***/
    $('#chart').css('width', changes.chart.width);
    $('#root').css('width',  changes.chart.width);


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
  } //end of if not null

return;
} //fn customize



/////////////////////////////////////////////////////////////////
/*********************** main function *************************/
/////////////////////////////////////////////////////////////////

function drawBarChart(dataSet, options, element){

  /* create chart from data at element location */
  $(element).addClass('wrap-chart');

  let chart = setup(dataSet);
  $(chart).attr('id', 'chart');
  $(element).append(chart);


  /* allow chart customization */
  customize(options);

  /* add x and y axes relative to added chart */
  chartHeight = $('#chart').css('height');
  chartHeight = parseInt(chartHeight.replace(/[^0-9.,]+/, ''));

  axesSetup(dataSet, options, element);

return;
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
      axesX: "BlueViolet",
      axesY: 20
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
