/*jshint esversion:6*/

/////////////////////////////////////////////////////////////////
/*********************** helper fns ****************************/
/////////////////////////////////////////////////////////////////

/*  global scopes:  */

let newTitle = "Bar Chart";
let barFraction;
let barWidth;
let xlabels = {};
let yAxisSteps = 10;
console.log($('body').innerHeight());
let chartHeight = $('body').innerHeight();
//chartHeight = parseInt(chartHeight.replace(/[^0-9.,]+/, ''));
let chartWidth = $('body').innerWidth();
//chartWidth = parseInt(chartWidth.replace(/[^0-9.,]+/, ''));

/***************** create chart from data **********************/

function setup(data, insertElement) {

  let correctDataOrder = data.slice(); //store data without mutating
  let buildChart = document.createElement('div');
    $(buildChart).attr('id', 'chart');
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
    //subtract px of bar label font size from css
      let newheight = (num*yAxisSteps) - (24/chartHeight) + "%";
      $(newdiv).css("height" , newheight);

    $(buildChart).append(newdiv);

  } //end for loop of data entries

rootDims(insertElement, chartHeight, chartWidth);
$(insertElement).append(buildChart);

return;
} //fn setup


/***************** chart+root w & h **********************/
function rootDims(el, w, h){
  $(el).css("width", (w + "px"));
  $(el).css("height", (h + "px"));

  $('#chart').css("width", (w + "px"));
  $('#chart').css("height", (h + "px"));

return;
} //fn rootDims



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

    $(chartRoot).append(xAxisLabels);
    $('.xlabel').innerWidth(Math.ceil(barFraction) + "%");

    $(axesXLabels).css("padding", $('#chart').css("padding"));
    //center xlabel div along with any chart's padding

    if (option.chart.width){
      $(axesXLabels).css("width", option.chart.width);
    }

    if (option.chart.axesX){
      $('.xlabel').css("color", option.chart.axesX);
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

    $(chartRoot).prepend(yAxisTicks);

    // keep y axis relative to root
    $('.wrap-chart').wrapAll("<div class='chart-wrapper with-y' />");

    // add scale to y axis
    $('.chart-wrapper').prepend(yscale);

    if (option.chart.axesY){
      $('ul').css("color", option.chart.axesY);
    }

    // keep scales relative to ticks and root of chart
    //
  $('li').css('line-height', (adjustTicks + "px"));
    //adjust margin by have the line-height for first tick
    //subtract by approximate 1/2 px of the yaxis numbers from css
  $('ul').css('margin-top', (Math.floor(adjustTicks/2) + "px"));
    //add same spacing to the starting point of the y axis yAxisTicks
  $('#axesYTicks').css('padding-bottom', ((adjustTicks/2) - (7) + "px"));

/**x axis labels **/

    //add x axis title after yaxis and chart have been wrapped
    $(chartRoot).append("<h2 id='xaxis'>x Axis</h2>");
    $('.with-y').wrapAll("<div class='chartWithY'></div>");

    let yaxisCentered = ($('#yaxis')[0].offsetHeight) / 2;
    $('#yaxis').css('margin-top', yaxisCentered);


return;
} //fn axesSetup


/*************** customize the chart with options **************/

function customize(changes, rootElement) {

  if (changes !== null){

  /*** CHART specifc customizations ***/

      if (changes.chart.height) {
        chartHeight = changes.chart.height;
      }
      if (changes.chart.width) {
        chartWidth = changes.chart.width;
      }
      rootDims(rootElement, chartWidth, chartHeight);


  /*** TITLE specifc customizations ***/
    $('#title').html(changes.title.titleName);
      //original h1 not getting removed?
    $('#title').css('color', changes.title.titleColor);
    $('#title').css('font-family', changes.title.titleFont);




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

          let moveBarLabel = changes.bars.labelLocation;
          let changeLabel;

          if (moveBarLabel === "center") {
            changeLabel = "center";
          } else if (moveBarLabel === "bottom"){
            changeLabel = "flex-end";
          } else if (moveBarLabel === "top"){
              changeLabel = "flex-start";
              }

          $(this).css('align-items', changeLabel);
        });
      return;
    }

  adjustBarLabels($(this.children[0]));

    });// fn labels
  } //end of if not null


return;
} //fn customize



/////////////////////////////////////////////////////////////////
/*********************** main function *************************/
/////////////////////////////////////////////////////////////////

let btn = document.getElementById("changeTitle");

btn.addEventListener("click", function() {
  $('input').css("display", "inline");
  $('#changeTitle').css("display", "none");
  $('#set').css("display", "inline");
    $('#set').on( "click", function() {
      newTitle = $('input')[0].value;
      $('#title')[0].textContent = newTitle;
      $('input').css("display", "none");
      $('#set').css("display", "none");
      $('#changeTitle').css("display", "inline");
    });

});


function drawBarChart(dataSet, options, element){



  /* create chart from data at element location */
  if (!element){ element = $('#root');}
  $(element).addClass('wrap-chart');

  setup(dataSet, element);

/* allow chart customization before axesSetup */
  customize(options, element);

  axesSetup(dataSet, options, element);


return;
} //fn drawBarChart



/****************** run drawBarChart with inputs *******************/

let custom = {
  title: {
      titleColor: "coral",
      titleFont: "courier",
      titleName: "My new custom title"
    },
  chart: {
      width: 200,
      height: 200,
      axesX: "BlueViolet",
      axesY: "salmon"
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
