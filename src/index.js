import { logDeliveryList } from "./lib/debug.js";
import { createSelectLayoutsOptions, OktoberfestLayoutData, addOnSelectedLabelChanged, selecteStartingOption } from "./lib/layouts.js";
import { solveOktober } from "./lib/oktoberfestSolver.js";
import { setDeliveriesToRender, setupCanvas, startRendering } from "./lib/rendering.js";

(() => {

/** @type {OktoberfestLayoutData} */
const data = {
	chopps: [],
	drones: [],
}

const runAlgorithm = () => {
	const deliveryListsByDrone = solveOktober(data.drones, data.chopps);
	if (!deliveryListsByDrone) throw new Error("delivery list false, empty, null or undefined!");

	logDeliveryList(deliveryListsByDrone);
	setDeliveriesToRender(data.chopps, data.drones, deliveryListsByDrone);
}

setupCanvas();

createSelectLayoutsOptions(data);
addOnSelectedLabelChanged(runAlgorithm);
selecteStartingOption();

startRendering();

// /** @type {HTMLInputElement} */
// const playButton = document.getElementById("play");
// const play = () => {
// 	console.log(`play`);
// }
// playButton.onclick = play;

})();