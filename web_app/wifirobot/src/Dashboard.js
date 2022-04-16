import EntryDataService from './services/ap_entries';
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Collapse } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import * as moment from 'moment';
import './App.css';
import { Link } from 'react-router-dom';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

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

const Dashboard = () => {
	const infoOptions = [
		'Address',
		'BitRates',
		'Channel',
		'Date Captured',
		'Encryption',
		'Frequency',
		'Quality',
		'Signal Level',
	];

	const [aps, setAPs] = useState([]);
	const [namedAPList, setNamedAPList] = useState([]);
	const [data, setData] = useState({ labels: [], datasets: [] });
	const [addresses, setAddresses] = useState(['Select a MAC Address']);
	const [MACAddress, setMACAddress] = useState('');
	const [render, setRender] = useState(Math.random());
	const [apListByMAC, setAPListByMAC] = useState([]);
	const [apListOpenToggle, setAPListOpenToggle] = useState(true);
	const [rawRespToggle, setRawRespToggle] = useState(true);
	const [apNames, setAPNames] = useState([]);
	const [selectedAPName, setSelectedAPName] = useState('');
	const [checkedState, setCheckedState] = useState(
		new Array(infoOptions.length).fill(false)
	);

	const chartRef = useRef();
	const JP_Ref = useRef();
	const executeChartScroll = () => chartRef?.current.scrollIntoView();
	const executeJPScroll = () => JP_Ref?.current.scrollIntoView();

	const getAllAPs = () => {
		EntryDataService.getAPs()
			.then((response) => {
				const parsedAP = EntryDataService.parseAPList(response.data);
				setAPs(parsedAP);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const getAPListByAddress = (address) => {
		address &&
			EntryDataService.getAPsByAddress(address)
				.then((response) => {
					const parsedAP = EntryDataService.parseAPList(response.data);
					setAPListByMAC(parsedAP);
					console.log(parsedAP);
				})
				.catch((e) => {
					console.log(e);
				});
	};

	const getAPListByName = (APName) => {
		APName &&
			EntryDataService.getAPsByName(APName)
				.then((response) => {
					const parsedAP = EntryDataService.parseAPList(response.data.entries);
					console.log(parsedAP[0]);
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
			setNamedAPList([]);
			return;
		}
		setSelectedAPName(ap_name);
		setRender(Math.random());
	};

	const updateChecked = (pos) => {
		const updatedCheckedState = checkedState.map((item, index) =>
			index === pos ? !item : item
		);
		setCheckedState(updatedCheckedState);
	};

	useEffect(() => {
		getAllAPs();

		let initChecked = checkedState;
		initChecked[0] = true;
		setCheckedState(initChecked);

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
		<div className='container-fluid '>
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
				<hr className='justify-content-center mt-3' />
			</div>

			{namedAPList.length > 0 && (
				<div className='text-center mb-3'>
					<Button
						onClick={() => setAPListOpenToggle(!apListOpenToggle)}
						aria-controls='ap_list'
						className={apListOpenToggle ? 'btn-danger m-2' : 'btn-success m-2'}
						aria-expanded={apListOpenToggle}>
						Toggle Access Point List
					</Button>

					{rawRespToggle && (
						<Button
							onClick={() => {
								executeJPScroll();
							}}>
							View Raw Response
						</Button>
					)}
				</div>
			)}

			{apListOpenToggle && (
				<div className='d-flex justify-content-center mb-3'>
					{namedAPList.length > 0 &&
						infoOptions.map((option, index) => (
							<div className='form-check mx-2' key={`${option}${index}`}>
								<input
									className='form-check-input'
									type='checkbox'
									value={option}
									checked={checkedState[index]}
									id={`${option}checkBox`}
									onChange={() => {
										updateChecked(index);
									}}
								/>
								<label
									className='form-check-label'
									htmlFor={`${option}checkBox`}>
									{option}
								</label>
							</div>
						))}
				</div>
			)}

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
										{checkedState[0] && (
											<>
												<strong>Address: </strong>
												{ap_point.address}
												<br />
											</>
										)}

										{checkedState[1] && (
											<>
												<strong>Bit Rates: </strong>
												{ap_point.bitRates}
												<br />
											</>
										)}

										{checkedState[2] && (
											<>
												<strong>Channel: </strong>
												{ap_point.channel}
												<br />
											</>
										)}

										{checkedState[3] && (
											<>
												<strong>Date: </strong>
												{moment(ap_point.date).format('MM-DD, h:mm:ss a')}
												<br />
											</>
										)}

										{checkedState[4] && (
											<>
												<strong>Encryption: </strong>
												{ap_point.encryption}
												<br />
											</>
										)}
										{checkedState[5] && (
											<>
												<strong>Frequency: </strong>
												{ap_point.frequency} GHz
												<br />
											</>
										)}
										{checkedState[6] && (
											<>
												<strong>Quality: </strong>
												{ap_point.quality}
												<br />
											</>
										)}
										{checkedState[7] && (
											<>
												<strong>Signal Level: </strong>
												{ap_point.signalLevel}
												<br />
											</>
										)}
									</p>
									<div className='row justify-content-center mx-3'>
										{/* eslint-disable-next-line no-underscore-dangle */}
										<Button
											to={''}
											className='btn btn-primary mb-3'
											onClick={() => {
												setMACAddress(ap_point.address);
												executeChartScroll();
											}}>
											View Address Performance
										</Button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</Collapse>

			{namedAPList.length > 10 && apListOpenToggle && (
				<div className='text-center mb-3'>
					<Button
						onClick={() => setAPListOpenToggle(!apListOpenToggle)}
						aria-controls='ap_list'
						className={apListOpenToggle ? 'btn-danger m-2' : 'btn-success m-2'}
						aria-expanded={apListOpenToggle}>
						Toggle Access Point List
					</Button>
				</div>
			)}

			{selectedAPName && (
				<>
					<hr className='justify-content-center mt-3' />
					<h4 className='text-center text-primary'>Select a MAC Address</h4>
					<div className='row pb-1 mb-3'>
						<div className='input-group col-lg-4 m-2 mt-4 justify-content-center '>
							<select onChange={onChangMACAddress} className='form-select'>
								{addresses.map((address) => (
									<option
										value={address}
										className='text-primary h4'
										key={address}>
										{`${address}`}
									</option>
								))}
							</select>
						</div>
					</div>
				</>
			)}

			<div ref={chartRef}></div>
			{namedAPList && (
				<div style={{ width: '100%', height: '80vh' }}>
					{MACAddress && <Line options={options} data={data} />}
				</div>
			)}

			{namedAPList.length > 0 && (
				<>
					<h4 className='text-center text-primary mt-3'>Raw Response Data</h4>
					<h5 className='text-center text-primary mb-3'>
						<strong>Viewing: </strong>
						{apListByMAC.length > 0
							? 'MAC Address Information'
							: 'Access Point Information'}
					</h5>
					<div className='text-center'>
						<Button
							onClick={() => setRawRespToggle(!rawRespToggle)}
							aria-controls='JP-div'
							className={rawRespToggle ? 'btn-danger m-2' : 'btn-success m-2'}
							aria-expanded={rawRespToggle}>
							Toggle Raw Response
						</Button>
					</div>

					<Collapse in={rawRespToggle}>
						<div id='JP-div' ref={JP_Ref}>
							<JSONPretty
								id='json-pretty'
								data={
									apListByMAC.length > 0 ? apListByMAC : namedAPList
								}></JSONPretty>
						</div>
					</Collapse>
				</>
			)}
		</div>
	);
};

export default Dashboard;
