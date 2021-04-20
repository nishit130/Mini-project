$(document).ready(function () {

    var portfolio_stock_div = $('#portfolio_stock_div');
    portfolio_stock_div.hide();

    var table_portfolio_stock_detail = $('#table_portfolio_stock_detail').DataTable();
    var table_portfolio_stocks = $('#table_portfolio_stocks').DataTable();
    loadNetValue();
    loadPortfolioStocks();
    loadMenu();

    function loadNetValue() {
        var url = "/portfolio/getnetvalue";
        $.getJSON(url, function (json) {
            // console.log(json);
            json = json.data;
            $('#portfolio_value').text(json.net_value);
            $('#portfolio_profit').text("Net profit : " + json.profit);
            
        });
    }
    function loadPortfolioStocks() {
        var url = "/portfolio/getportstocks";
        var stockname;
        var quantity;
        var profit;
        var buyprice;
        $.getJSON(url, function (json) {
            json = json.data;
            var counter = 0;
            for (var i = 0; i < json.length; i++) {
                var url1 = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + json[i].stockid + ".BSE" + "&apikey=V7ROCT9EHZBVTPD3"
                
                console.log("current id: ", json[i].stockid)
                $.getJSON(url1, (jsono) => {
                    console.log("data from db: ", json);
                    var count = 0;
                     var data = jsono
                    for (var key in data["Time Series (Daily)"]) {
                        count++;
                        var open = parseFloat(data["Time Series (Daily)"][key]["1. open"]).toFixed(2)
                        var close = parseFloat(data["Time Series (Daily)"][key]["4. close"]).toFixed(2);
                        var diff = (close-open).toFixed(2);
                        var pecnt = ((diff/open)*100).toFixed(2);
                        console.log(counter,json, quantity,profit ,open,close, diff, pecnt);
                        for(var j = 0; j < json.length; j++)
                        {
                            if(json[j].stockid == parseInt(data["Meta Data"]["2. Symbol"].split(".")[0]))
                            {
                                stockname = json[j].stockname;
                                quantity = json[j].qty;
                                profit = json[j].profit;
                                buyprice = json[j].close;
                            }
                        
                        }
                        table_portfolio_stocks.row.add([
                            stockname,
                            close,
                            diff,
                            pecnt,
                            quantity,
                            (parseInt(quantity)*buyprice).toFixed(2),
                            (parseInt(quantity*(close-buyprice))).toFixed(2)
                        ]);
                        if(count >= 1)
                        {
                            break;
                        }
                    }
                }).done(() => {
                    console.log("integer: ",counter);
                })
                counter++;
            }
            table_portfolio_stocks.draw();
        });
    }
    function loadMenu() {
        //get all stocks
        var url1 = "/api/allstocks";
        $.getJSON(url1, function (json) {
            json = json.data;
            // console.log(json);

            var listItems = "";
            for (var i = 0; i < json.length; i++) {
                listItems += "<option >"+ json[i].stockname + "</option>";
            }
            $("#stocksel").html(listItems);
        });
    }

    table_portfolio_stocks.on('click', 'tr', function () {

        //populate table_stock_details
        var data = table_portfolio_stocks.row(this).data();
        var stock = data[0];
        console.log(stock);
        $('#stock_name').text(stock);
        var url1 = "/portfolio/gettranshist";
        // var url2 = "/api/stockhist/" + stock;
        // Send the data using post
        var posting = $.post(url1, { stockname: stock });

        // Put the results in a div
        posting.done(function (json) {
            console.log(json);
            if (json.status == "failure") {
                alert(json.message);
                window.location = '/login';
            }
            json = json.data;
            table_portfolio_stock_detail.clear();
            for (var i = 0; i < json.length; i++) {
                table_portfolio_stock_detail.row.add([
                    json[i].trans_date,
                    json[i].close,
                    json[i].trans_qty
                ]);
            }
            table_portfolio_stock_detail.draw();
        });
        portfolio_stock_div.show();
        $('html, body').animate({
            scrollTop: portfolio_stock_div.offset().top
        }, 1000);
    });

     $("#form_edit_portfolio").submit(function (event) {
        console.log("update button pressed");
        // Stop form from submitting normally
        event.preventDefault();
        // Get some values from elements on the page:
        var form = $(this),
            q = form.find("input[name= 'qty']").val(),
            d = form.find("input[name = 'date']").val(),
            stock = $('#stocksel  option:selected').text();
            console.log("Stock update:",stock)
            var retrivestockid = $.post('/portfolio/api/stockid', {stockname: String(stock)})
            var stockid;
            retrivestockid.done(function (data) {
                            stockid = data.data.stockid;
                            var url2 = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + stockid + ".BSE" + "&apikey=V7ROCT9EHZBVTPD3"
                            $.getJSON(url2, (json) => {
                                var data = json;
                                for (var key in data["Time Series (Daily)"]) {
                                        if (key == String(d))
                                        {
                                            data["Time Series (Daily)"][key]["1. open"],
                                            data["Time Series (Daily)"][key]["2. high"],
                                            data["Time Series (Daily)"][key]["3. low"],
                                            data["Time Series (Daily)"][key]["4. close"],
                                            data["Time Series (Daily)"][key]["5. volume"],
                                            data["Time Series (Daily)"][key]["4. close"],

                                            url = "/portfolio/updateportfolio";
                                            console.log(q,d,stock);
                                            var posting = $.post(
                                            url, 
                                            {
                                            stockid: stockid,
                                            stockname: stock, 
                                            date: String(d), 
                                            qty: q, 
                                            open: data["Time Series (Daily)"][key]["1. open"], 
                                            high: data["Time Series (Daily)"][key]["2. high"],
                                            low: data["Time Series (Daily)"][key]["3. low"],
                                            close: data["Time Series (Daily)"][key]["4. close"],
                                            volume: data["Time Series (Daily)"][key]["5. volume"],
                                            adj_close: data["Time Series (Daily)"][key]["4. close"]
                                            
                                            });
                                            posting.done(function (data) {
                                                console.log(data);
                                                alert(data.message);
                                            });

                                        }
                                    
                                    }
                            })
                        });
            // var stockid = 500002;
       

       
    });


});