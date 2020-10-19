import React, { useState, useContext, createContext, useEffect } from "react";
import socketIOClient from "socket.io-client";

// import Loading from "../loading/loading.component";

import fetchUtils from "../../api/APIUtils";
import inMemoryJWT from "../../authentication/in-memory-jwt";

import { useAuth } from "../auth/auth.component";

const BACKEND_HOST =
	(process.env.REACT_APP_BACKEND_PROTOCOL || "http") +
	"://" +
	(process.env.REACT_APP_BACKEND_HOST || window.document.location.hostname) +
	(process.env.REACT_APP_BACKEND_PORT
		? `:${process.env.REACT_APP_BACKEND_PORT}`
		: "");
const BACKEND_WS_HOST =
	(process.env.REACT_APP_BACKEND_WS_PROTOCOL || "ws") +
	"://" +
	(process.env.REACT_APP_BACKEND_WS_HOST || window.document.location.hostname) +
	(process.env.REACT_APP_BACKEND_WS_PORT
		? `:${process.env.REACT_APP_BACKEND_WS_PORT}`
		: "") +
	"/websocket/location";

const urlMark = `${BACKEND_HOST}/api/mark/`;
let socket;

const shareLocContext = createContext();

export const ProvideShareLoc = ({ children }) => {
	const shareLoc = useShareLocProvider();
	return (
		<shareLocContext.Provider value={shareLoc}>
			{children}
		</shareLocContext.Provider>
	);
};

export const useShareLoc = () => {
	return useContext(shareLocContext);
};

const useShareLocProvider = () => {
	const auth = useAuth();
	const [positionData, setPositionData] = useState({
		lat: 0,
		lng: 0,
	});
	const [shareLocData, setShareLocData] = useState({
		userId: 0,
		lastMarkUpdate: 0,
	});

	const isSocketConnected = () => {
		return socket && socket.connected;
	};
	const getLastMarkUpdate = () => {
		return { userId: shareLocData.userId, timestamp: shareLocData.lastMarkUpdate };
	};
	const shareLoc = async (latitude, longitude, timestamp) => {
		// console.log("positionData", positionData);
		if (!timestamp || !latitude || !longitude) {
			return;
		}
		// console.log(`${positionData.lat} === ${latitude} && ${positionData.lng} === ${longitude}`)
		if (positionData.lat === latitude && positionData.lng === longitude) {
			return;
		}

		const data = {
			userId: auth.user.key,
			position: {
				lat: latitude,
				lng: longitude,
			},
		};

		// if(isSocketConnected()){
		//     const values = {
		//         commandType: 'CreateMark',
		//         commandBody: { ...data }
		//     }
		//     socket.send(`NEW position ${latitude},
		//     ${longitude},
		//     ${timestamp}`);
		// }else{
		// }
		await fetchUtils
			.fetchJson(urlMark, {
				method: "POST",
				user: {
					authenticated: true,
				},
				body: JSON.stringify({ ...data }),
			})
			setPositionData({ ...data.position });
	};

	// const getLoc = async () => {
	// 	const res = await fetchUtils.fetchJson(`${urlMark}/${data.userId}`, {
	// 		method: "GET",
	// 		user: {
	// 			authenticated: true,
	// 		}
	// 	})
	// }

	useEffect(() => {
		socket = socketIOClient(BACKEND_WS_HOST, {
			transports: ["websocket"],
		});

		socket.on("connect", (data) => {
			// JSON.stringify({ token: inMemoryJWT.getToken() })
			socket
				.emit("authenticate", { token: `Bearer ${inMemoryJWT.getToken()}` })
				.on("authenticated", () => {
					//TODO make join groups
					//do other things
					console.log("authenticated");
				})
				.on("unauthorized", (msg) => {
					socket.close();
					console.log(`unauthorized: ${msg}`);
					return;
					// throw new Error(msg.data.type);
				});
		});

		socket.on("update-marks", (data) => {
			console.log("update-marks", data);
			setShareLocData({ userId: data.userId, lastMarkUpdate: Date.now() });
		});

		socket.on("connect_timeout", (timeout) => {
			console.error(`connect_timeout timeout = ${timeout}`);
		});
		socket.on("error", (error) => {
			console.error(`error `, error);
		});
		socket.on("disconnect", (reason) => {
			console.error(`disconnect reason = `, reason);
			// if (reason === 'io server disconnect') {
			//   // the disconnection was initiated by the server, you need to reconnect manually
			//   socket.connect();
			// }
			// else the socket will automatically try to reconnect
		});
		// socket = new WebSocket(BACKEND_WS_HOST);
		// // setSocket(socket);
		// socket.on = (event) => {
		// 	if(event?.data){
		// 		const socketData = JSON.parse(event.data);
		// 		console.log(socketData);
		// 		// setData(data);
		// 	}
		// };

		return () => {
			socket.close();
		};
	}, []);

	return {
		isSocketConnected,
		getLastMarkUpdate,
		shareLoc,
	};
};
// const ws01 = new WebSocket(BACKEND_WS_HOST); q

// var ws = new WebSocket('ws://' + window.document.location.host);
//       ws.onmessage = function(message) {
//         var msgDiv = document.createElement('div');
//         msgDiv.innerHTML = message.data;
//         document.getElementById('messages').appendChild(msgDiv);
//       };

//       function sendMessage() {
//         var message = document.getElementById('msgBox').value;
//         ws.send(message);
// 	  }

// const shareLocWs = () => {
// }

// export default ShareLoc;
