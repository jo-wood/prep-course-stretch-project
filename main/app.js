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
let chartHeight = $('body').innerHeight();
let chartWidth = $('body').innerWidth();


/***************** create chart from data **********************/


function setup({data, element}) {

  let correctDataOrder = data.slice(); //store data without mutating
  let buildChart = document.createElement('div');
    $(buildChart).attr('id', 'chart');
  let revData = [...data].reverse(); // bc flipped in css for styling

  barFraction = (100 - data.length) / data.length;

  /** add bars **/
  for (let num of revData) {
    let dataLabel = "<p>" + num + "</p>";
    var newdiv = document.createElement( "div" );
    let $newdiv = $(newdiv);
      $newdiv.append(dataLabel);
      $newdiv.addClass("bar-num");
      $newdiv.attr('id', num);

    let dataIndex = correctDataOrder.indexOf(num);
    Object.keys(xlabels[num] = "Index:" + dataIndex);

    /** set bar widths **/
      barWidth = Math.floor(barFraction) + "%";
      $newdiv.css("width", barWidth); // bar width same for all

    /** create each bars height based on entry value **/
      //subtract px of bar label font size from css
      let newheight = (num*yAxisSteps) - (24/chartHeight) + "%";
      $newdiv.css("height" , newheight);

    $(buildChart).append(newdiv);

  } //end for loop of data entries

rootDims(element, chartHeight, chartWidth);
$(element).append(buildChart);

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


function axesSetup({data, options, element}){

  let $element = $(element);

/**x axis labels **/

    let xAxisLabels = document.createElement('div');
    let $xAxisLabels = $(xAxisLabels);
    $xAxisLabels.attr("id", "axesXLabels");

    for(let z = 0; z < data.length ; z++){
      let storeValue = data[z];
      let xlabelId = 'dataValue-' + storeValue;
      $xAxisLabels.append("<p class='xlabel' id='" + xlabelId + "'>" + xlabels[storeValue] + "</p>");
    }//data for loop

    $element.append(xAxisLabels);
    $('.xlabel').innerWidth(Math.ceil(barFraction) + "%");
    $xAxisLabels.css("padding", $('#chart').css("padding")); //center xlabel div along with any chart's padding
    $xAxisLabels.css("width", chartWidth);


/** y axis labels **/

    $element.before("<h2 class='with-y' id='yaxis'>y Axis (%)</h2>"); // to set left of chart
    $('#yaxis').css('float', "left");

    let yAxisTicks = document.createElement('div');
    let $yAxisTicks = $(yAxisTicks);
    $yAxisTicks.attr("id", "axesYTicks");
    let yscale = document.createElement("ul");

        //find highest num in array for number of yticks:
        //use es6 spread-syntax to sort without mutating original data:

    let sortedData = [...data];
    sortedData.sort((a, b) => {return a - b;});
    let adjustTicks = chartHeight/yAxisSteps;
    let highestValue = sortedData[sortedData.length - 1];

    for (let i = 0; i < highestValue; i++){
        let ticks = "<p class='yticks' style='margin-bottom: " + adjustTicks + "'></p>";
        $yAxisTicks.append(ticks);
        $(yscale).append( "<li>" + (highestValue - i)*yAxisSteps + "</li>" );
    }

    $element.prepend(yAxisTicks);
    $('.wrap-chart').wrapAll("<div class='chart-wrapper with-y' />");  // keep y axis relative to root
    $('.chart-wrapper').prepend(yscale); // add scale to y axis

        // keep scales relative to ticks and root of chart
    $('li').css('line-height', (adjustTicks + "px"));

        //adjust margin by have the line-height for first tick
    $('ul').css('margin-top', (Math.floor(adjustTicks/2) + "px"));

        //add same spacing to the starting point of the y axis yAxisTicks
        //subtract by approximate 1/2 px of the yaxis numbers from css
    $yAxisTicks.css('padding-bottom', ((adjustTicks/2) - (7) + "px"));


/** add axes to element **/

      //add x axis title after yaxis and chart have been wrapped
    $element.append("<h2 id='xaxis'>x Axis</h2>");
    $('.with-y').wrapAll("<div class='chartWithY'></div>");

    let yaxisCentered = ($('#yaxis')[0].offsetHeight) / 2;
    $('#yaxis').css('margin-top', yaxisCentered);


return;
} //fn axesSetup




/*************** customize the chart with options **************/


function customize({options, element}) {

  if (options !== null){

  /*** CHART specifc customizations ***/

    let chart = options.chart;
      if (chart.height) {chartHeight = chart.height;}
      if (chart.width) {chartWidth = chart.width;}

    rootDims(element, chartWidth, chartHeight);

      if (chart.axesX){$('.xlabel').css("color", chart.axesX);}
      if (chart.axesY){$('ul').css("color", chart.axesY);}


  /*** TITLE specifc customizations ***/

    let title = options.title;

      $('#title').html(title.titleName);
      $('#title').css('color', title.titleColor);
      $('#title').css('font-family', title.titleFont);


  /*** BAR specifc customizations ***/

    let bars = options.bars;

      let labels = $('div.bar-num').map(function() {

    //bar color:
        $(this).css('background-color', bars.barColor);

    //bar space:
        let newMargin = bars.barSpace + "%";
        barWidth = barFraction - bars.barSpace + "%";
        $(this).css('width', barWidth);
        $(this).css('margin-left', newMargin);

    //label colour:
        $(this.children[0]).css('color', bars.labelColour);

    //label position:
        function adjustBarLabels(barDiv){
          barDiv.map(function() {

            let moveBarLabel = bars.labelLocation;
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

/* event listener for multiple title changes */

  let btn = document.getElementById("changeTitle");
  let render = "display";
  let on = "inline";
  let hide = "none";
  let editBtn = '#changeTitle';
  let titleInput = 'input';
  let setBtn = '#set';

  btn.addEventListener("click", function() {
    $(titleInput).css(render, on);
    $(editBtn).css(render, hide);
    $(setBtn).css(render, on);
      $(setBtn).on( "click", function() {
        newTitle = $(titleInput)[0].value;
        $('#title')[0].textContent = newTitle;
        $(titleInput).css(render, hide);
        $(setBtn).css(render, hide);
        $(editBtn).css(render, on);
      });
  });

function drawBarChart(data, options, element){

/* create chart from data at element location */

  if (!element){ element = $('#root');}
  $(element).addClass('wrap-chart');

  setup({data, element});

/* allow chart customization before axesSetup */

  customize({options, element});

  axesSetup({data, options, element});


return;
} //fn drawBarChart



/****************** run drawBarChart with inputs *******************/

let customSpecs = {
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

drawBarChart([1, 4, 2, 10, 6, 5], customSpecs, document.getElementById("root"));
