import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import 'react-json-pretty/themes/monikai.css';
import Dashboard from './Dashboard';
import Config from './Config';
import Map from './Map';
import logo from './images/wifi_icon.png';

const App = () => {
	return (
		<div>
			<div>
				<nav className='navbar navbar-expand navbar-dark bg-dark mb-3'>
					<li className='nav-item'>
						<img src={logo} height='50' alt='AP logo' className='mx-2' />
					</li>
					<Link to='/' className='navbar-brand'>
						AP DashBoard
					</Link>
					<div className='navbar-nav mr-auto'>
						<li className='nav-item'>
							<Link to='/' className='nav-link'>
								Home
							</Link>
						</li>
						<li className='nav-item'>
							<Link to='/config' className='nav-link'>
								Config
							</Link>
						</li>
						<li className='nav-item'>
							<Link to='/map' className='nav-link'>
								Map
							</Link>
						</li>
					</div>
				</nav>
			</div>
			<div className='mb-4'>
				<h1 className='text-center text-primary'>Accesss Point Dashboard</h1>
			</div>
			<div className='container-fluid'>
				<Routes>
					<Route exact path='/' element={<Dashboard />} />
					<Route exact path='/config' element={<Config />} />
					<Route exact path='/map' element={<Map />} />
				</Routes>
			</div>
		</div>
	);
};

export default App;
