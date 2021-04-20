$(document).ready(function () {
    var table_stocks = $('#table_stocks').DataTable();
    var table_gainers = $('#table_gainers').DataTable();
    var table_losers = $('#table_losers').DataTable();
    var table_stock_detail = $('#table_stock_detail').DataTable();
    var stock_div = $('#stock_div');
    stock_div.hide();
    $('#sensex_index').click(showSensexPage);
    loadStocks();
    loadTopGainers();
    loadTopLosers();
    showSensexDetails();
    // table_stocks.column(0).visible(false);
    table_stocks.on('click', 'tr', function () {
        //populate table_stock_details
        var data = table_stocks.row(this).data();
        var stock = data[0]+ ".BSE";

        console.log(stock);
        var url1 = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + stock + "&apikey=V7ROCT9EHZBVTPD3"
        var url2 = "/api/stockhist/" + stock;
        $.getJSON(url1, function (json) {
            json = json;
            console.log("url1:",json['Meta Data']['2. Symbol'].split('.')[0]);
            $('#stock_name').text(json['Meta Data']['2. Symbol']);
            // $('#stock_industry').text("Industry = " + json.industry);
            // $('#sensex_perc').text("perc = " + json.perc);
        });
        $.getJSON(url1, function (json) {
            chart.options.data[0].dataPoints = [];
            table_stock_detail.clear();
            var data = json;

            for (var key in data["Time Series (Daily)"]) {
                table_stock_detail.row.add([
                    key,
                    data["Time Series (Daily)"][key]["1. open"],
                    data["Time Series (Daily)"][key]["2. high"],
                    data["Time Series (Daily)"][key]["3. low"],
                    data["Time Series (Daily)"][key]["4. close"],
                    data["Time Series (Daily)"][key]["5. volume"],
                    data["Time Series (Daily)"][key]["4. close"],
                    chart.options.data[0].dataPoints.push({ x: new Date(key),y: parseInt( data["Time Series (Daily)"][key]["4. close"]) })
                ]);

                
            
            }
            stock_div.show();
            $('html, body').animate({
                scrollTop: stock_div.offset().top
            }, 800);
            table_stock_detail.draw();
            chart.options.data[0].dataPoints.reverse();
            chart.render();

        });
    });

    function showSensexDetails() {
        var url = "/api/getsensexprice";
        $.getJSON(url, function (json) {
            // console.log(json); 
            json = json.data;
            console.log(json);
            $('#sensex_index').text(json.close);
            $('#sensex_diff').text("Change = " + json.diff);
            $('#sensex_perc').text("Percentage Change = " + json.perc + " %");
        });
    }
    function showSensexPage() {
        window.location = "/sensexview";
    }


    function loadStocks() {
        var url = "/api/stocks";
        $.getJSON(url, function (json) {
            // console.log(json);
            var tr;
            json = json.data;
            for (var i = 0; i < json.length; i++) {
                // tr = $('<tr/>');
                // tr.append("<td>" + json[i].stockname + "</td>");
                // tr.append("<td>" + json[i].industry + "</td>");
                // $('#table_id').append(tr);
                table_stocks.row.add([
                    json[i].stockid,
                    json[i].stockname,
                    json[i].industry,
                ]);
            }
            table_stocks.draw();
        });
    }
    function loadTopGainers() {
        var url = "/api/topstocks";
        $.getJSON(url, function (json) {
            // console.log(json);
            var tr;
            json = json.data;
            for (var i = 0; i < json.length; i++) {
                // tr = $('<tr/>');
                // tr.append("<td>" + json[i].stockname + "</td>");
                // tr.append("<td>" + json[i].industry + "</td>");
                // $('#table_id').append(tr);
                table_gainers.row.add([
                    json[i].stockname,
                    json[i].curr_price,
                    json[i].diff,
                    json[i].perc
                ]);
            }
            table_gainers.draw();
        });
    }
    function loadTopLosers() {
        var url = "/api/lowstocks";
        $.getJSON(url, function (json) {
            // console.log(json);
            var tr;
            json = json.data;
            for (var i = 0; i < json.length; i++) {
                // tr = $('<tr/>');
                // tr.append("<td>" + json[i].stockname + "</td>");
                // tr.append("<td>" + json[i].industry + "</td>");
                // $('#table_id').append(tr);
                table_losers.row.add([
                    json[i].stockname,
                    json[i].curr_price,
                    json[i].diff,
                    json[i].perc
                ]);
            }
            table_losers.draw();
        });
    }
    $('#portfolio_button').click(function () {
        console.log("portfolio_button pressed");
        $.getJSON("/isloggedin", function (data) {
            console.log(data);
            if (data == true) {
                window.location = '/portfolio'
            }
            else {
                alert("No user logged in");
            }
        });
    });
    var chart = new CanvasJS.Chart("chartContainer",
        {
            title: {
                text: "Stock Value"
            },
            theme: "theme2",
            animationEnabled: true,
            axisX: {
                valueFormatString: "",
                includeZero: false
            },
            axisY: {
                valueFormatString: "#0",
                includeZero: false
            },
            data: [
                {
                    type: "line",
                    showInLegend: true,
                    legendText: "Stock Value",
                    dataPoints: []
                }
            ]
        });
});