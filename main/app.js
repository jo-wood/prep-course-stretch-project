/*jshint esversion:6*/

/////////////////////////////////////////////////////////////////
/*********************** helper fns ****************************/
/////////////////////////////////////////////////////////////////


//////////   global scopes ///////////

let newTitle = "Bar Chart",
    barFraction,
    barWidth,
    xlabels = {},
    yAxisSteps = 10,
    chartHeight = $('body').innerHeight(),
    chartWidth = $('body').innerWidth();


//////////  constructors   ///////////

let div = 'div',
    p = 'p',
    ul = 'ul',
    li = 'li',
    h2 = 'h2';

function newElement(el){

      return document.createElement(el);

    //else {
  //
  //     document.createElement(el);
  //       $el = $(el);
  //       $el.attr("id", id);
  //       $el.addClass(group);
  //       $el.html(html);
  //     return el;
  // }


}






/***************** create chart from data **********************/


function setup({data, element}) {

  let dataOrder = data.slice(); //store data without mutating

  let buildChart = newElement(div);
  let $buildChart = $(buildChart);
  $buildChart.attr('id', 'chart');

  let revData = [...data].reverse(); // bc flipped in css for styling

  barFraction = (100 - data.length) / data.length;

/** add bars **/
  for (let num of revData) {
    let dataLabel = "<p>" + num + "</p>";
    var newdiv = newElement(div, num, "bar-num");
    let $newdiv = $(newdiv);
      $newdiv.append(dataLabel);
      $newdiv.addClass("bar-num");
      $newdiv.attr('id', num);

    let dataIndex = dataOrder.indexOf(num);
    Object.keys(xlabels[num] = "Index:" + dataIndex);

/** set bar widths **/
      barWidth = Math.floor(barFraction) + "%";
      $newdiv.css("width", barWidth); // bar width same for all

/** create each bars height based on entry value **/
    //subtract px of bar label font size from css
    let newheight = (num*yAxisSteps) - (24/chartHeight) + "%";
    $newdiv.css("height" , newheight);

    $buildChart.append(newdiv);

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

    let xAxisLabels = newElement(div),
        $xAxisLabels = $(xAxisLabels);

    $xAxisLabels.attr("id", "axesXLabels");

    for (let z = 0; z < data.length ; z++){
      let storeValue = data[z],
          xlabelId = 'dataValue-' + storeValue,
          xlabel = newElement(p),
          $xlabel = $(xlabel);

      $xlabel.addClass("xlabel");
      $xlabel.attr('id', xlabelId);
      $xlabel.html(xlabels[storeValue]);
      $xlabel.innerWidth(Math.ceil(barFraction) + "%");

      $xAxisLabels.append(xlabel);

    }//data for loop

  $element.append(xAxisLabels);

  $xAxisLabels.css("padding", $('#chart').css("padding")); //center xlabel div along with any chart's padding
  $xAxisLabels.css("width", chartWidth);


/** y axis  **/

    let yaxis = newElement(h2),
        $yaxis = $(yaxis);

    $yaxis.addClass("with-y");
    $yaxis.attr("id", "yaxis");
    $yaxis.html("y Axis (%)");
    $yaxis.css('float', "left");

    $element.before(yaxis); // to set left of chart

/** y axis labels **/

    let yAxisTicks = newElement(div),
        $yAxisTicks = $(yAxisTicks),
        yscale = newElement(ul),
        $yscale = $(yscale);

    $yAxisTicks.attr("id", "axesYTicks");

      //find highest num in array for number of yticks:
      //use es6 spread-syntax to sort without mutating original data:

    let sortedData = [...data];
    sortedData.sort((a, b) => {return a - b;});

    let adjustTicks = chartHeight/yAxisSteps,
        highestValue = sortedData[sortedData.length - 1];

      for (let i = 0; i < highestValue; i++){
          let ticks = newElement(p),
              $ticks = $(ticks);

              $ticks.addClass('yticks');
              $ticks.css("margin-bottom", adjustTicks);

          $yAxisTicks.append(ticks);

          let scaleCount = (highestValue - i)*yAxisSteps;
          let eachTick = newElement(li),
              $eachTick = $(eachTick);

              $eachTick.addClass(eachTick);
              $eachTick.html( scaleCount );
                // keep scales relative to ticks and root of chart
              $eachTick.css('line-height', (adjustTicks + "px"));

          $yscale.append(eachTick);
      }

    $element.prepend(yAxisTicks);

    let chartWrap = newElement(div),
        $chartWrap = $(chartWrap);

        $chartWrap.addClass("chart-wrapper with-y");

    $('.wrap-chart').wrapAll(chartWrap);  // keep y axis relative to root
    $('.chart-wrapper').prepend(yscale); // add scale to y axis

        //adjust margin by have the line-height for first tick
    $yscale.css('margin-top', (Math.floor(adjustTicks/2) + "px"));

        //add same spacing to the starting point of the y axis yAxisTicks
        //subtract by approximate 1/2 px of the yaxis numbers from css
    $yAxisTicks.css('padding-bottom', ((adjustTicks/2) - (7) + "px"));



/** x axis  **/
    //add x axis title after yaxis and chart have been wrapped

    let xaxis = newElement(h2),
        $xaxis = $(xaxis);

        $xaxis.attr("id", "xaxis");
        $xaxis.html("x Axis");

/** add axes to element **/

  $element.append(xaxis);

  $('.with-y').wrapAll("<div class='chartWithY'></div>");

  let yaxisCentered = ($yaxis[0].offsetHeight) / 2;

      $yaxis.css('margin-top', yaxisCentered);

// adjust axes label colors here as this function runs after customize
let chart = options.chart;
    if (chart.axesX){$('.xlabel').css("color", chart.axesX);}
    if (chart.axesY){$('ul').css("color", chart.axesY);}

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
