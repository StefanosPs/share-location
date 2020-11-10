import React from "react"; 
import { FadeLoader } from "react-spinners";

const Loading = () => {
	return (
		<div style={{
			position: 'absolute',
			top: `calc(50% - 75 )`,
			left: `calc(50% - 75 )`
		}}><FadeLoader  color={"lightblue"} size={150} /></div>
		);
	// return (
	// 	<Container fluid>
	// 	<div>Loading...</div>
	// 	</Container>
	// );
};

export default Loading;
