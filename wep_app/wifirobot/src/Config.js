import { Button, ListGroup } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import ConfigDataService from './services/config_service';
import * as moment from 'moment';
import EntryDataService from './services/ap_entries';
import Moment from 'react-moment';
import './App.css';

const Config = () => {
	const [commObj, setCommObj] = useState({});
	const [render, setRender] = useState(Math.random());

	const setComm = (comm) => {
		ConfigDataService.setCurrCommand(comm)
			.then((response) => {
				console.log(response);
				setRender(Math.random());
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const getComm = () => {
		ConfigDataService.getCurrCommand()
			.then((response) => {
				if (response.data.length > 0) {
					const parsedConfig = EntryDataService.parseAPList(response.data);
					console.log(parsedConfig);
					setCommObj(parsedConfig[0]);
				} else {
					console.log(response.date);
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	useEffect(() => {
		getComm();
	}, []);
	useEffect(() => {
		getComm();
	}, [render]);

	return (
		<div className='container-fluid'>
			<div>
				<div>
					<h2 className='m-3 text-center'>Instructions</h2>

					<div>
						<p className='text-center h5'>
							There is a distinct way to approach the robot configuration. The
							robot must be calibrated before it is able to fetch grid
							dimensions and position coordinates. The user must click the{' '}
							<span className='text-danger'>CAL</span> button to begin
							calibrating and after calibration the user may use the{' '}
							<span className='text-danger'>HOL</span> button to hold the robot
							in the current state while they set up fetching the grid with{' '}
							<span className='text-danger'>GRI</span> and subsequently the
							current position of the robot with{' '}
							<span className='text-danger'>POS</span>. Here are the four
							processes, the current process (if any) is highlighted.
						</p>
					</div>
					<div className='d-flex justify-content-center m-5'>
						<div className='mx-3'>
							<ListGroup>
								<ListGroup.Item className='text-center text-primary'>
									Current Command
								</ListGroup.Item>
								<ListGroup.Item active={commObj?.command === 'CAL'}>
									1. "CAL" - Calibration
								</ListGroup.Item>
								<ListGroup.Item active={commObj?.command === 'HOL'}>
									2. "HOL" - HOLD
								</ListGroup.Item>
								<ListGroup.Item active={commObj?.command === 'GRI'}>
									3. "GRI" - Fetch Grid Dimensions
								</ListGroup.Item>
								<ListGroup.Item active={commObj?.command === 'POS'}>
									4. "POS" - Fetch Poistion Coordinates
								</ListGroup.Item>
							</ListGroup>
						</div>
						<div className='m-5 text-center'>
							<Button
								variant={commObj?.command === 'CAL' ? 'secondary' : 'primary'}
								onClick={() => setComm('CAL')}
								size='lg'>
								CAL
							</Button>
						</div>
						<div className='m-5 text-center'>
							<Button
								variant={commObj?.command === 'HOL' ? 'secondary' : 'primary'}
								onClick={() => setComm('HOL')}
								size='lg'>
								HOL
							</Button>
						</div>
						<div className='m-5 text-center'>
							<Button
								variant={commObj?.command === 'GRI' ? 'secondary' : 'primary'}
								onClick={() => setComm('GRI')}
								size='lg'>
								GRI
							</Button>
						</div>
						<div className='m-5 text-center'>
							<Button
								variant={commObj?.command === 'POS' ? 'secondary' : 'primary'}
								onClick={() => setComm('POS')}
								size='lg'>
								POS
							</Button>
						</div>
					</div>
					<div>
						<h4 className='text-center'>
							Time Since Command Executed:{' '}
							<span className='bg-danger text-white'>
								<Moment interval={1000} fromNow>
									{commObj?.date}
								</Moment>
							</span>
						</h4>
						<p className='text-center text-black-50'>[
							<Moment format='dddd, MMMM Do YYYY, h:mm:ss a'>
								{commObj?.date}
							</Moment>]
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Config;
