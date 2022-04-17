import './App.css';
import React, { useState, useEffect } from 'react';
import EntryDataService from './services/ap_entries';
import ConfigDataService from './services/config_service';
import Moment from 'react-moment';
import Chart from 'react-apexcharts';

const generateData = (count, yrange) => {
	var i = 0;
	var series = [];
	while (i < count) {
		var x = (i + 1).toString();
		var y =
			Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

		series.push({
			x: x,
			y: y,
		});
		i++;
	}
	console.log(series);
	return series;
};

const Map = () => {
	const [aps, setAPs] = useState([]);
	const [gridAPs, setGridAPs] = useState([]);
	const [gridSizes, setGridSizes] = useState([]);
	const [sessionObj, setSessionObj] = useState({});
	const [grid, setGrid] = useState([]);
	const [distinctAPs, setDistinctAPs] = useState([]);
	const [selectedAPName, setSelectedAPName] = useState('');
	const [mappedAPs, setMappedAPs] = useState([]);
	const [render, setRender] = useState(Math.random());

	const [series, setSeries] = useState([
		{
			name: 'Test AP',
			data: [
				{ x: 2, y: 3, z: 2 },
				{ x: 5, y: 70, z: 3 },
			],
		},
	]);

	const [options, setOptions] = useState({
		chart: {
			height: 350,
			type: 'bubble',
		},
		dataLabels: {
			enabled: false,
		},
		fill: {
			opacity: 0.8,
		},
		title: {
			text: 'Access Point Mapping',
			align: 'center',
		},
		xaxis: {
			tickAmount: 12,
			type: 'category',
		},
		yaxis: {
			x: 70,
		},
		tooltip: {
			enabled: true,
			y: {
				title: {
					formatter: function (seriesName) {
						return `y: `;
					},
				},
				formatter: function (
					value,
					{ series, seriesIndex, dataPointIndex, w }
				) {
					return `${value}`;
				},
			},
			x: {
				formatter: function (
					value,
					{ series, seriesIndex, dataPointIndex, w }
				) {
					return `x: ${value}`;
				},
			},
			z: {
				title: 'Quality: ',
			},
		},
	});

	const getSessionTime = () => {
		ConfigDataService.getSessionTime()
			.then((response) => {
				if (response.data.length > 0) {
					const parsedSession = EntryDataService.parseAPList(response.data);
					setSessionObj(parsedSession[0]);
				} else {
					console.log(response.date);
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const getAllAPs = () => {
		EntryDataService.getPOSAPs()
			.then((response) => {
				const parsedAP = EntryDataService.parseAPList(response.data);
				setAPs(parsedAP);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const onChangeGridDims = (e) => {
		let dims = e.target.value.split(' ');

		const x = parseInt(dims[0]);
		const y = parseInt(dims[1]);
		console.log(x + ' ' + y);
		setGrid([x, y]);
		getGridAPs(x, y);
	};

	const onChangeAPName = (e) => {
		let name = e.target.value;

		console.log(name);
		setSelectedAPName(name);
	};

	const getGridAPs = (x, y) => {
		let gridaps = aps?.filter((ap) => {
			return parseInt(ap.gridX) === x && parseInt(ap.gridY) === y;
		});

		setGridAPs(gridaps);
	};
	useEffect(() => {
		getAllAPs();
		getSessionTime();
	}, []);

	useEffect(() => {
		let gridapnames = gridAPs.map((ap) => {
			return ap.name;
		});

		gridapnames = [...new Set(gridapnames)];
		setDistinctAPs(gridapnames);
	}, [grid]);

	useEffect(() => {
		const randomColor = Math.floor(Math.random() * 16777215).toString(16);
		const colorString = '#' + randomColor;

		setOptions({
			...options,
			colors: [colorString],
		});
	}, [selectedAPName]);

	useEffect(() => {
		setOptions({
			...options,
			yaxis: {
				max: grid[1] + 10,
			},
		});
	}, [grid]);

	useEffect(() => {
		if (selectedAPName == 'all') {
			setMappedAPs(gridAPs);
		} else {
			let filteredAPs = gridAPs?.filter((ap) => {
				return ap.name === selectedAPName;
			});
			setMappedAPs(filteredAPs);
		}
	}, [selectedAPName]);

	useEffect(() => {
		let locData = mappedAPs.map((ap) => {
			let xVal = parseInt(ap.posX) + Math.floor(Math.random() * (-3 - 3) + 3);
			let yVal = parseInt(ap.posY) + Math.floor(Math.random() * (-3 - 3) + 3);

			xVal = xVal > grid[0] ? grid[0] : xVal < 0 ? 0 : xVal;
			yVal = yVal > grid[0] ? grid[0] : yVal < 0 ? 0 : yVal;

			return {
				x: xVal,
				y: yVal,
				z: parseInt(ap.quality),
			};
		});

		setSeries([
			{
				name: selectedAPName,
				data: locData,
			},
		]);
	}, [mappedAPs]);
	useEffect(() => {
		let grids = new Set();
		aps?.forEach((item) => {
			grids.add(item.gridX + ' ' + item.gridY);
		});

		let parsedGrids = [];
		grids.forEach((item) => {
			let dims = item.split(' ');
			parsedGrids.push([parseInt(dims[0]), parseInt(dims[1])]);
		});

		gridSizes.length === 0 && setGridSizes(gridSizes.concat(parsedGrids));
	}, [aps]);

	return (
		<div className=''>
			<div>
				<div>
					<div className='my-2'>
						<h4 className='text-center'>
							Time Since Mapping Session Started:{' '}
							<span className='bg-danger text-white'>
								<Moment interval={1000} fromNow>
									{sessionObj?.date}
								</Moment>
							</span>
						</h4>
					</div>
					<div className='d-flex justify-content-center '>
						<p className='text-center text-black-50'>
							[
							<Moment format='dddd, MMMM Do YYYY, h:mm:ss a'>
								{sessionObj?.date}
							</Moment>
							]
						</p>
					</div>
				</div>
				<hr className='justify-content-center mt-3' />

				<div>
					<h4 className='text-center text-primary'>Select a Grid Size</h4>
					<div className='input-group col-lg-4 m-2 mt-4 justify-content-center '>
						<select onChange={onChangeGridDims} className='form-select'>
							<option value='' disabled selected>
								Select a Grid Size [L x W]
							</option>
							{gridSizes.map((size) => (
								<option
									value={`${size[0]} ${size[1]}`}
									className='text-primary h4'
									key={`${size[0]} ${size[1]}`}>
									{`${size[0]} x ${size[1]}`}
								</option>
							))}
						</select>
					</div>
				</div>
				{grid?.length > 0 && (
					<div>
						<hr className='justify-content-center mt-5' />
						<h4 className='text-center text-primary'>Select an Access Point</h4>
						<div className='input-group col-lg-4 m-2 mt-4 justify-content-center '>
							<select onChange={onChangeAPName} className='form-select'>
								<option className='text-grey h4' value='' disabled selected>
									Select an Access Point
								</option>
								<option className='text-danger h4' value='all'>
									Select All
								</option>
								{distinctAPs.map((ap_name) => (
									<option
										value={`${ap_name}`}
										className='text-primary h4'
										key={`${ap_name}`}>
										{`${ap_name}`}
									</option>
								))}
							</select>
						</div>
					</div>
				)}

				{selectedAPName.length > 0 && (
					<div>
						<hr className='justify-content-center mt-5' />
						<h4 className='text-center text-primary'>View Mapping</h4>
						<Chart
							options={options}
							series={series}
							type='bubble'
							height={350}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default Map;
