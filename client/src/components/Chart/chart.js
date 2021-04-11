import React, {useEffect} from "react";
import {CanvasJSChart} from 'canvasjs-react-charts'
// V7ROCT9EHZBVTPD3

 
var dataPoints =[];
var dotaPoints = [];
export default class Chart extends React.Component {
 
	render() {	
		const options = {
			theme: "light2",
			title: {
				text: "Stock Price of Reliance"
			},
			axisY: {
				viewportMinimum: 1800,
				viewportMaximum: 2500,
				title: "Price in INR",
				prefix: "RS"
			},
			data: [{
				type: "line",
				xValueFormatString: "DD MMM YYYY",
				dataPoints: dataPoints
			}]
		}
		return (
		<div>
			<CanvasJSChart options = {options} 
				 onRef={ref => this.chart = ref}
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
	
	componentDidMount(){
		var chart = this.chart;
		fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=RELIANCE.BSE&outputsize=compact&apikey=V7ROCT9EHZBVTPD3')
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			var count = 0;
			for (var key in data["Time Series (Daily)"]) {
				count++;
				if(count < 600 ) {
					dataPoints.push({
						x: new Date(key),
						y: parseFloat(data["Time Series (Daily)"][key]["4. close"])
					});
				}
			}
			console.log(dataPoints)
			chart.render();
		});

		// fetch('https://canvasjs.com/data/gallery/react/nifty-stock-price.json')
		// .then(function(response) {
		// 	return response.json();
		// })
		// .then(function(data) {
		// 	for (var i = 0; i < data.length; i++) {
		// 		dotaPoints.push({
		// 			x: new Date(data[i].x),
		// 			y: data[i].y
		// 		});
		// 	}
		// 	console.log(dotaPoints)
		// });
	}
	// componentDidMount(){
	// 	var chart = this.chart;
	
	// }
}