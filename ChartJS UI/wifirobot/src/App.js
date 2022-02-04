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

let data = {
	labels: ['One', 'Two', 'Three'],
	datasets: [
		{
			data: [1, 2, 3],
			borderColor: 'rgb(75, 192, 192)',
		},
	],
};

const App = () => {
	const [ap, setAP] = useState([]);
	const [apList, setAPList] = useState([]);

	const getAP = () => {
		DataService.getAP()
			.then((response) => {
				const parsedAP = DataService.parseAPList(response.data);
				setAP(parsedAP);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const getAPListByName = () => {
		DataService.getAPsByName('fauwpa2')
			.then((response) => {
				const parsedAP = DataService.parseAPList(response.data);
				setAPList(parsedAP);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	useEffect(() => {
		getAP();
		getAPListByName();
	}, []);

	useEffect(() => {
		data = {
			labels: apList.map((element) => {
				return moment(element.date).format('h:mm:ss a');
			}),
			// labels: ['One', 'Two', 'Three'],
			datasets: [
				{
					data: apList.map((element) => {
						return element.quality;
					}),
					// data: [1, 2, 3],
				},
			],
		};
		console.log(data);
	}, [apList]);

	return (
		<div>
			<h1>AP List</h1>
			{/* {JSON.stringify(ap[0])} */}
			{ap?.map((ap_point) => {
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
			})}
			{apList?.map((ap_point) => {
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

			{apList && <Line options={options} data={data} />}
		</div>
	);
};

export default App;
