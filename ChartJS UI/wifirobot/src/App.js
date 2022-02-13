import DataService from './services/ap_entries';
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Collapse } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import * as moment from 'moment';
import './App.css';
import { Link } from 'react-router-dom';

Chart.register(...registerables);

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top',
		},
		title: {
			display: true,
			text: 'AP Over Time',
		},
	},
	maintainAspectRatio: false,
};

const App = () => {
	const [aps, setAPs] = useState([]);
	const [namedAPList, setNamedAPList] = useState([]);
	const [data, setData] = useState({ labels: [], datasets: [] });
	const [addresses, setAddresses] = useState(['Select a MAC Address']);
	const [MACAddress, setMACAddress] = useState('');
	const [render, setRender] = useState(Math.random());
	const [apListByMAC, setAPListByMAC] = useState([]);
	const [apListOpenToggle, setAPListOpenToggle] = useState(true);
	const [apNames, setAPNames] = useState([]);
	const [selectedAPName, setSelectedAPName] = useState('');

	const chartRef = useRef(null);
	const executeScroll = () => chartRef.current.scrollIntoView();

	const getAllAPs = () => {
		DataService.getAPs()
			.then((response) => {
				const parsedAP = DataService.parseAPList(response.data);
				setAPs(parsedAP);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const getAPListByAddress = (address) => {
		DataService.getAPsByAddress(address)
			.then((response) => {
				const parsedAP = DataService.parseAPList(response.data);
				setAPListByMAC(parsedAP);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const getAPListByName = (APName) => {
		DataService.getAPsByName(APName)
			.then((response) => {
				const parsedAP = DataService.parseAPList(response.data.entries);
				setNamedAPList(parsedAP);
				const addrs = response.data.addresses.map((addrss) => {
					return addrss._id;
				});
				setAddresses(['Select a MAC Address'].concat(addrs));
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const onChangMACAddress = (e) => {
		const MACAddr = e.target.value;
		if (MACAddr === 'Select a MAC Address') {
			setMACAddress('');
			return;
		}
		setMACAddress(MACAddr);
		setRender(Math.random());
	};

	const onChangeAP = (e) => {
		const ap_name = e.target.value;
		if (ap_name === 'Select an Access point') {
			setSelectedAPName('');
			return;
		}
		setSelectedAPName(ap_name);
		setRender(Math.random());
	};

	useEffect(() => {
		getAllAPs();
		setData({
			labels: ['One', 'Two', 'Three'],
			datasets: [
				{
					data: [1, 2, 3],
					borderColor: '#4488bb',
					backgroundColor: '#4488bb',
				},
			],
		});
	}, []);

	useEffect(() => {
		getAPListByName(selectedAPName);
	}, [selectedAPName]);

	useEffect(() => {
		setData({
			labels: apListByMAC.map((element) => {
				return moment(element.date).format('MM-DD, h:mm:ss a');
			}),
			datasets: [
				{
					label: `${MACAddress}`,
					data: apListByMAC.map((element) => {
						return element.quality;
					}),
					borderColor: '#4488bb',
					backgroundColor: '#4488bb',
				},
			],
		});
	}, [MACAddress, apListByMAC]);

	useEffect(() => {
		getAPListByAddress(MACAddress);
	}, [MACAddress]);

	useEffect(() => {
		let ap_names = aps.map((ap) => {
			return ap.name;
		});

		ap_names = [...new Set(ap_names)];
		setAPNames(['Select an Access point'].concat(ap_names));
	}, [aps]);

	return (
		<div className='m-5'>
			<div className='mb-4'>
				<h1 className='text-center text-primary'>Accesss Point Dashboard</h1>
			</div>

			<h4 className='text-center text-primary'>Select an Access Point</h4>
			<div className='row pb-1 mb-3'>
				<div className='input-group col-lg-4 m-2 mt-4 justify-content-center '>
					<select onChange={onChangeAP} className='form-select'>
						{apNames.map((apName) => (
							<option value={apName} className='text-primary h4' key={apName}>
								{`${apName}`}
							</option>
						))}
					</select>
				</div>
			</div>

			<h4 className='text-center text-primary'>Select a MAC Address</h4>
			<div className='row pb-1 mb-3'>
				<div className='input-group col-lg-4 m-2 mt-4 justify-content-center '>
					<select onChange={onChangMACAddress} className='form-select'>
						{addresses.map((address) => (
							<option value={address} className='text-primary h4' key={address}>
								{`${address}`}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className='text-center mb-3'>
				{namedAPList.length > 0 && (
					<Button
						onClick={() => setAPListOpenToggle(!apListOpenToggle)}
						aria-controls='ap_list'
						aria-expanded={apListOpenToggle}>
						Toggle Access Point List
					</Button>
				)}
			</div>

			<Collapse in={apListOpenToggle}>
				<div className='row' id='ap_list'>
					{namedAPList.map((ap_point) => (
						<div className='col-lg-4 pb-1' key={ap_point.number}>
							<div className='card'>
								<div className='card-body'>
									<Link to={''} className='h5 text-decoration-none'>
										<h5 className='card-title text-primary text-center'>
											{ap_point.name}
										</h5>
									</Link>
									<p className='card-text'>
										<strong>Address: </strong>
										{ap_point.address}
										<br />
										<strong>Signal Level: </strong>
										{ap_point.quality}
										<br />
									</p>
									<div className='row justify-content-center mx-3'>
										{/* eslint-disable-next-line no-underscore-dangle */}
										<Button
											to={''}
											className='btn btn-primary mb-3'
											onClick={() => {
												setMACAddress(ap_point.address);
												executeScroll();
											}}>
											View Performance
										</Button>

										{/* <Link to={''} className='btn btn-outline-primary mb-3'>
											Views Appointments
										</Link> */}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</Collapse>
			<div ref={chartRef}></div>
			<div style={{ width: '100%', height: '80vh' }}>
				{namedAPList.length > 0 && <Line options={options} data={data} />}
			</div>
		</div>
	);
};

export default App;
