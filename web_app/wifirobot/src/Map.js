import './App.css';
import React, { useState, useEffect } from 'react';
import EntryDataService from './services/ap_entries';
import ConfigDataService from './services/config_service';
import Moment from 'react-moment';

const Map = () => {
	const [aps, setAPs] = useState([]);
	const [gridAPs, setGridAPs] = useState([]);
	const [gridSizes, setGridSizes] = useState([]);
	const [sessionObj, setSessionObj] = useState({});
	const [grid, setGrid] = useState([]);
	const [render, setRender] = useState(Math.random());

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

	const getGridAPs = (x, y) => {
		let gridaps = aps?.filter((ap) => {
			return parseInt(ap.gridX) === x && parseInt(ap.gridY) === y;
		});

		// console.log(gridaps);
		setGridAPs(gridaps);
	};
	useEffect(() => {
		getAllAPs();
		getSessionTime();
	}, []);

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
				<hr className='justify-content-center mt-5' />
				<div>
					<h4 className='text-center text-primary'>View Grid</h4>
				</div>
			</div>
		</div>
	);
};

export default Map;
