
import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export const ChartComponent = props => {
	const {
		data,
		colors: {
			backgroundColor = '#1f2a40',
			lineColor = '#2962FF',
			downColor = "#FF0000",
			textColor = 'white',
			areaTopColor = '#2962FF',
			areaBottomColor = 'rgba(41, 98, 255, 0.28)',
		} = {},
	} = props;
    console.log(data)
	const chartContainerRef = useRef();

	useEffect(
		() => {
			const handleResize = () => {
				chart.applyOptions({ width: 
					chartContainerRef.current.clientWidth });
			};

			const chart = createChart(chartContainerRef.current, {
				layout: {
					background: { type: ColorType.Solid, color: backgroundColor },
					textColor,
				},
				width: chartContainerRef.current.clientWidth,
				height: 300,
			});
			chart.timeScale().fitContent();
			if (!data.closes ){
			const newSeries = chart.addLineSeries({lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
			newSeries.setData(data);
		}
			else {
				const newSeries = chart.addLineSeries({ title:"Close", lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
				newSeries.setData(data.closes);
				const predSeries = chart.addLineSeries({ downColor, downColor, bottomColor: downColor });
				predSeries.setData(data.pred);
				const upSeries = chart.addLineSeries({ lineColor, areaTopColor, bottomColor: areaBottomColor });
				// upSeries.setColor("#FF0000");
				upSeries.setData(data.up);
				const downSeries = chart.addLineSeries({ lineColor, areaTopColor, bottomColor: areaBottomColor });
				downSeries.setData(data.down);
				if(data.target) {
				const avgPriceLine = {
					price: 810,
					color: 'black',
					lineWidth: 4,
					lineStyle: 3, // LineStyle.Dotted
					axisLabelVisible: true,
					title: 'Target price',
				};
				const maxPriceLine = {
					price: 795,
					color: '#26a69a',
					lineWidth: 4,
					lineStyle: 3, // LineStyle.Dashed
					axisLabelVisible: true,
					title: 'Loss price',
				};
				


				newSeries.createPriceLine(avgPriceLine);
				newSeries.createPriceLine(maxPriceLine);}}

			window.addEventListener('resize', handleResize);


			return () => {
				window.removeEventListener('resize', handleResize);

				chart.remove();
			};
		},
		[data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
	);

	return (
		<div
			ref={chartContainerRef}
		/>
	);
};

export const initialData = [
	{ time: '2018-12-22', value: 832.51 },
	{ time: '2018-12-23', value: 831.11 },
	{ time: '2018-12-24', value: 827.02 },
	{ time: '2018-12-25', value: 827.32 },
	{ time: '2018-12-26', value: 825.17 },
	{ time: '2018-12-27', value: 828.89 },
	{ time: '2018-12-28', value: 825.46 },
	{ time: '2018-12-29', value: 823.92 },
	{ time: '2018-12-30', value: 822.68 },
	{ time: '2018-12-31', value: 822.67 },
];

