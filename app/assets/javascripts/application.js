// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require Chart
//= require_tree .

$(document).ready(function(){
  console.log('loaded')
  function getStockPrices(){
    var stock = $('#stock').val()

    var stockPrice = [];
    var inflationArr = [];

    //ajax get to quandl api for stock data
    $.get('https://www.quandl.com/api/v3/datasets/WIKI/' + stock + '.json?api_key=4CUC7ab1CjmVy61uWCcA&collapse=weekly')
    .done(function(data){
      //clear the graph with every search, prevents chart js glitch
      var $graphDiv = $('.graph')
      var $graph = $('#graph')
      $('img').remove()

      $graph.remove()
      $graphDiv.append($('<canvas>').attr('id', 'graph'))

      data.dataset.data.forEach(function(dailyStock){
        var stockObject = {}

        stockObject["date"] = dailyStock[0]
        stockObject["price"] = dailyStock[4]

        stockPrice.push(stockObject)
      })

      calculateInflation(stockPrice)
    })
  };


  function calculateInflation(stockPrice){
    //get consumer price index data, starting at 1950
    //source: https://www.measuringworth.com/uscpi
    var CPI = {
      1950: 24.08,
      1951: 25.98,
      1952: 26.55,
      1953: 26.75,
      1954: 26.88,
      1955: 26.78,
      1956: 27.18,
      1957: 28.15,
      1958: 28.92,
      1959: 29.16,
      1960: 29.62,
      1961: 29.92,
      1962: 30.26,
      1963: 30.62,
      1964: 31.03,
      1965: 31.56,
      1966: 32.46,
      1967: 33.4,
      1968: 34.8,
      1969: 36.67,
      1970: 38.84,
      1971: 40.51,
      1972: 41.85,
      1973: 44.45,
      1974: 49.33,
      1975: 53.84,
      1976: 56.94,
      1977: 60.61,
      1978: 65.22,
      1979: 72.57,
      1980: 82.38,
      1981: 90.93,
      1982: 96.5,
      1983: 99.6,
      1984: 103.9,
      1985: 107.6,
      1986: 109.6,
      1987: 113.6,
      1988: 118.3,
      1989: 124,
      1990: 130.7,
      1991: 136.2,
      1992: 140.3,
      1993: 144.5,
      1994: 148.2,
      1995: 152.4,
      1996: 156.9,
      1997: 160.5,
      1998: 163,
      1999: 166.6,
      2000: 172.2,
      2001: 177.1,
      2002: 179.9,
      2003: 184,
      2004: 188.9,
      2005: 195.3,
      2006: 201.6,
      2007: 207.34,
      2008: 215.3,
      2009: 214.54,
      2010: 218.06,
      2011: 224.94,
      2012: 229.59,
      2013: 232.96,
      2014: 236.74,
      2015: 237.02,
      2016: 241.04
    }

    // create inflation adjusted array, push object into an array
    var inflationAdj = []

    stockPrice.forEach(function(data){
      var dataObj = {}

      var year = data.date.substring(0,4);
      var price = data.price;

      dataObj["date"] = data.date;
      dataObj["price"] = Number.parseFloat((price * (CPI[2016]/CPI[year])).toFixed(2));

      inflationAdj.push(dataObj)
    })

    renderGraph(stockPrice, inflationAdj)
  };


  function renderGraph(stockPrice, inflationAdj){
    $('#graph').remove()
    //create arrays to chart data
    var dates = [];
    var prices = [];
    var inflated = []

    stockPrice.forEach(function(pricePoint){
      dates.unshift(pricePoint.date)
      prices.unshift(pricePoint.price)
    })

    inflationAdj.forEach(function(pricePoint){
      inflated.unshift(pricePoint.price)
    })

    //render graph
    var $graph = $('<canvas>').attr('id', 'graph')
    $('.graph').append($graph)

    var stockGraph = new Chart($graph, {
        type: 'line',
        data: {
            labels: dates, //dates go here
            datasets: [
            {
                label: 'Price Per Share',
                data: prices, //stock prices go here
                borderColor: "rgba(0,0,0,1)",
                borderWidth: 1,
                pointRadius: 0,
                hitRadius: 5
            },
            {
                label: 'Inflation Adjusted Price Per Share',
                data: inflated,
                borderColor: "rgba(178,34,34,1)",
                borderWidth: 1,
                pointRadius: 0,
                hitRadius: 5
            }]
        },
    })

    if($('#stock').val() !== ''){
      //clear save buttons
      $('#saveButton').remove()

      //create save buttons
      var $saveStock = $('<button>').attr('id', 'saveButton').text('SAVE')
      $('#searchButton').after($saveStock)

      //create heart animation for save
      $saveStock.click(function(){
        var $heart = $('<img>').attr('src', 'http://en.xn--icne-wqa.com/images/icones/1/9/as-coeur-bal.png')
                               .attr('id', 'heart')
                               .css('position', 'absolute')

        $('.graph').prepend($heart)

        $heart.fadeOut('slow')

        saveStock(stockPrice, inflationAdj)
      })
    }
  };


  function saveStock(stockPrice, inflationAdj){
    if ($('#stock').val() !== ''){
      var stockName = $('#stock').val().toUpperCase()

      var data = {
        stock_name: stockName,
        stock_data: JSON.stringify(stockPrice),
        inflation_adj: JSON.stringify(inflationAdj)
      }

      $.post('/saved_stocks', data).done(function(response){
        renderDropdown(stockName)
        console.log('posted to database')
      })
    }
  };


  function renderDropdown(stockName){
    var currentStock = stockName;
    console.log(currentStock)
    var $dropdown = $('#dropdown')

    $dropdown.empty()
    $dropdown.append($('<option>')
             .text('Favorite Stocks')
             .attr('disabled', 'disabled')
             .attr('selected', 'selected'))

    //ajax call to db to populate dropdown names
    $.get('/saved_stocks').done(function(data){

      data.forEach(function(savedStock){
        // console.log(savedStock.id)
        var $option = $('<option>').text(savedStock.stock_name)
                                   .attr('id', savedStock.id)
        $('#dropdown').append($option)
      })
    })

    //clear and create dropdown menu
    $('#dropdown').remove()
    $('.saved').prepend($dropdown)

    $('#dropdown').change(function(){

      //add delete button for each stock
      $('#deleteButton').remove()
      var $deleteButton = $('<button>')
                            .text('DELETE')
                            .attr('id','deleteButton')

      $('.saved').append($deleteButton)

      //fire render stock function depending on selected stock
      var favStock = $('#dropdown').val()
      getSavedStock(favStock)

      //fire delete function
      $('#deleteButton').click(deleteStock)
    })
  };


  function deleteStock(){
    var stockID = $('#dropdown option:selected').attr('id')

    if($('#dropdown option:selected').attr('id')){
      $.ajax({
        url: '/saved_stocks/' + stockID,
        method: 'delete'
      }).done(function(response){
        $('#graph').fadeOut()
        renderDropdown()
      })
    }
  };


  function getSavedStock(favStock){
    $.get('/saved_stocks').done(function(data){
      savedStock = data.filter(function(stock){
        return stock.stock_name === favStock;
      })

      renderSavedStock(savedStock)
    })
  };


  function renderSavedStock(savedStock){
    var stockPrice    = JSON.parse(savedStock[0].stock_data)
    var inflationAdj = JSON.parse(savedStock[0].inflation_adj)
    renderGraph(stockPrice, inflationAdj)
  };


  $(function(){
    renderDropdown()

    $('#searchButton').click(function(){
      //remove graph and loading images
      $('.graph').empty()
      $('img').remove()

      //add loading images
      $('.main').prepend($('<img>').attr('src', 'https://camo.githubusercontent.com/ce652d1e71659b7b61187377a4c337558ed9296b/687474703a2f2f692e696d6775722e636f6d2f637873543772532e676966'))

      //fire data functions
      getStockPrices()
    })
  })
})






