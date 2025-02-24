import { coord2dToLin } from "./math.js";
import { DistanceTable } from "./oktoberfestSolver.js";


const asciiACode = 'A'.charCodeAt(0);
const asciiZCode = 'Z'.charCodeAt(0);

export const indexToAsciiFixed = i => {
	const clampedAscii = i % (asciiZCode - asciiACode + 1);
	return String.fromCharCode(asciiACode + clampedAscii);
}

// A,B,C,D,E labels to make it easier to identify random objects in the system
/** @type {Map.<Object, String>} */
export const labels = new Map();

/**
 * @param {Array.<{ xStart: Number, yStart: Number }>} drones
 * @param {Array.<Point2D>} chopps
 * @param {Array.<Point2D>} droneStates
 */
export const initDebugLabels = (drones, chopps, droneStates) => {
	labels.clear();

	for (let i = 0; i < drones.length; ++i) {
		const droneLabel = indexToAsciiFixed(i);

		const drone = drones[i];
		labels.set(drone, droneLabel);

		const droneState = droneStates[i];
		labels.set(droneState, droneLabel);
	}

	for (let i = 0; i < chopps.length; ++i) {
		const chopp = chopps[i];
		labels.set(chopp, `${i}`);
	}
}


/**
 * @param {DistanceTable} dTable
 * @param {Array.<Point2D>} dronesStates
 */
export const logDistanceTableObj = (dTable, dronesStates) => {
	const decimalChars = 2;
	let str = `distance table\n`;
	let padding = " ".repeat(decimalChars - 1);
	for (let i = 0; i < dronesStates.length; ++i) {
		str += "   "
		str += padding;
		str += indexToAsciiFixed(i);
	}
	str += "\n"
	for (let y = 0; y < dTable.choppIndices.length; ++y) {
		const choppIndex = dTable.choppIndices[y];
		str += `${choppIndex}`;
		str += "| "
		for (let x = 0; x < dronesStates.length; ++x) {
			str += dTable.table[coord2dToLin(x, y, dronesStates.length)].toFixed(decimalChars);
			str += " "
		}
		str += "|\n"
	}
	console.log(str);
}

/** @param {Array.<Point2D>} dronesStates */
export const logDroneStates = dronesStates => {
	let str = "drone states\n";
	for (let i = 0; i < dronesStates.length; ++i) {
		const droneState = dronesStates[i];
		str += `${labels.get(droneState)}: ${droneState.x.toFixed(2)}, ${droneState.y.toFixed(2)}\n`;
	}
	console.log(str);
}

export const logLM = localMinimaByChoppIndex => {
	let str = ``;
	for (const [k, v] of localMinimaByChoppIndex) {
		str += `${k} -> ${v.dist.toFixed(2)} (${v.droneI})\n`
	}
	console.log(str);
}

export const logLut = lut => {
	let str = ``;
	for (const [k, v] of lut) {
		str += `${k} -> ${v}\n`
	}
	console.log(str);
}

export const logDistanceTable = (table, width, height) => {
	let str = ` `;
	str += "\n"
	for (let y = 0; y < height; ++y) {
		// str += `${y}`;
		str += "| "
		for (let x = 0; x < width; ++x) {
			str += table[coord2dToLin(x, y, width)].toFixed(2);
			str += " "
		}
		str += "|\n"
	}
	console.log(str);
}

/** @param {DeliveriesByDrone} deliveryListsByDrone */
export const logDeliveryList = deliveryListsByDrone => {
	let str = ``;
	for (const [droneStart, deliveryList] of deliveryListsByDrone) {
		const droneLabel = labels.get(droneStart);
		str += `${droneLabel}: [ `;
		for (const delivery of deliveryList) {
			const deliveryLabel = labels.get(delivery);
			str += `${deliveryLabel}, `
		}
		if (deliveryList.length > 0)
			str = str.substring(0, str.length - 2);
		str += ` ]\n`
	}
	console.log(str);
	// console.log(`\n\n`);
}
