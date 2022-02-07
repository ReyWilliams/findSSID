import DataService from './services/ap_entries';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import * as moment from 'moment';
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
};

// let data = {
// 	labels: ['One', 'Two', 'Three'],
// 	datasets: [
// 		{
// 			data: [1, 2, 3],
// 			borderColor: 'rgb(75, 192, 192)',
// 		},
// 	],
// };

const App = () => {
	const [ap, setAP] = useState([]);
	const [apList, setAPList] = useState([]);
	const [data, setData] = useState({ labels: [], datasets: [] });

	const getAllAPs = () => {
		DataService.getAPs()
			.then((response) => {
				const parsedAP = DataService.parseAPList(response.data);
				setAP(parsedAP);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const getAPListByName = () => {
		DataService.getAPsByName('fau')
			.then((response) => {
				const parsedAP = DataService.parseAPList(response.data.entries);
				setAPList(parsedAP);
				console.log(parsedAP);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	useEffect(() => {
		// getAllAPs();
		getAPListByName();
	}, []);

	useEffect(() => {
		setData({
			labels: apList.map((element) => {
				return moment(element.date).format('MM-DD, h:mm:ss a');
			}),
			datasets: [
				{
					data: apList.map((element) => {
						return element.quality;
					}),
					borderColor: 'rgb(75, 192, 192)',
				},
			],
		});
	}, [apList]);

	return (
		<div>
			<h1>AP List</h1>
			{/*ap?.map((ap_point) => {
				return (
					<Card style={{ width: '18rem' }}>
						<Card.Body>
							<Card.Title>{ap_point.name}</Card.Title>
							<Card.Text>
								This is access point {ap_point.name} with an address of{' '}
								{ap_point.address}
							</Card.Text>
						</Card.Body>
					</Card>
				);
			}) */}

			{apList?.slice(0, 5).map((ap_point) => {
				return (
					<Card style={{ width: '18rem' }}>
						<Card.Body>
							<Card.Title>{ap_point.name}</Card.Title>
							<Card.Text>
								This is access point {ap_point.name} with an address of{' '}
								{ap_point.address}
								<br />
								{moment(ap_point.date).format('h:mm:ss a')}
								<br />
								{ap_point.quality}
							</Card.Text>
						</Card.Body>
					</Card>
				);
			})}

			{apList && <Line redraw options={options} data={data} />}
		</div>
	);
};

export default App;
