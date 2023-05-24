import React, { useState, useEffect } from "react";
import axios from "axios";

import putWithToken from "../../utilities/putWithToken";
import {useStateContext} from '../../utilities/StateContext'

 
//CONNECT YOU PERSONAL SPOTIFY
const ConnectDevices = ({ closeTip }) => {
	const [devices, setDevices] = useState([]);

	const { token } = useStateContext();

	const source = axios.CancelToken.source();

	useEffect(() => {
		axios
		  .get('https://api.spotify.com/v1/me/player/devices', {
			headers: {
				"Content-Type": "application/json",
				'Authorization': 'Bearer ' + token
			},
		  })
		  .then((response) => {
			const _devices = response.data.devices;
			setDevices(_devices);
		  })
		  .catch((error) => {
			console.log(error);
		  });
		
	  }, []);

	const switchDevice = (e) => {
		const id = e.currentTarget.dataset.id;
		const data = { device_ids: [id] };
		const reqTransfer = putWithToken(
			"https://api.spotify.com/v1/me/player",
			token,
			source,
			data
		);
		reqTransfer()
			.then((response) => {
				if (response.status === 204) {
					closeTip();
				}
			})
			.catch((error) => console.log(error));
	};

  

	return (
		<div className="connect-devices" data-source="inside">
			<div className="connect-devices-content" data-source="inside">
				<div className="connect-devices-title" data-source="inside">
					<h1 data-source="inside">Connect to a device</h1>
					<p data-source="inside">
						Below are the connected devices that you have on your network, use
						Spotify Clone Player to listen here (try closing and opening this
						popup if you don't see it)
					</p>
					<br data-source="inside"></br>
					<p data-source="inside">
						This app also works as a remote controller - log in to an official
						Spotify app on the same network to checkout this feature
					</p>
				</div>
				<div className="cd-img" data-source="inside">
					<img
						loading="lazy"
						data-source="inside"
						src="https://open.scdn.co/cdn/images/connect_header@1x.ecc6912d.png"
						alt=""
						draggable="false"
					/>
				</div>
				
				{devices.length === 0 ? (
				<ul className='connect-devices-list'>
					<button className="connect-devices-items disable ellipsis-one-line no-outline" disabled>
					<div className='cd-info'>
						<h1>No devices available</h1>
					</div>
					</button>
				</ul>
				) : (
				<ul className='connect-devices-list'>
					{devices.map((device, index) => {
					return (
						<button
						className={`connect-devices-items ${device.is_active ? 'active' : ''} ellipsis-one-line no-outline`}
						key={index}
						data-id={device.id}
						onClick={device.is_active ? null : switchDevice}
						>
						<div className='cd-info'>
							<h1>{device.name}</h1>
						</div>
						</button>
					);
					})}
				</ul>
				)}
			</div>
		</div>
	);
};

export default ConnectDevices;
