// import React, { useState, useEffect } from "react";
import React from "react";

import { usePosition } from "use-position";
import { useShareLoc } from "../../share-loc/share-loc.component";

const ShareLocButton = (friendID) => {
	const shareLoc = useShareLoc();
	const watch = true;
	const { latitude, longitude, timestamp} = usePosition(
		watch
	);

	shareLoc.shareLoc(latitude, longitude, timestamp);
	return (
		<li style={{ color: shareLoc.isSocketConnected() ? "green" : "black" }} >{shareLoc.isSocketConnected()} Share Location</li>
	);
};

export default ShareLocButton;
