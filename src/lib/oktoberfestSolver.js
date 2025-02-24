import { coord2dToLin, droneToChoppDistance } from "./math.js";
import { initDebugLabels, logDistanceTableObj, logDroneStates, logLM, logLut, logDistanceTable, logDeliveryList, } from "./debug.js";

/**
 * @typedef {Map.<Drone, Array.<Point2D>>} DeliveriesByDrone
 */

/**
 * @param {Array.<Drone>} drones
 * @param {Array.<Point2D>} chopps
 * @returns {DeliveriesByDrone}
 */
export const solveOktober = (drones, chopps) => {

	const dronesStates = initDroneStates(drones);

	initDebugLabels(drones, chopps, dronesStates);

	/** @type {DeliveriesByDrone} */
	const deliveryListByDrone = new Map();

	if (drones.length === 0) {
		console.error(`no drones, returning an empty list`);
		return deliveryListByDrone;
	}

	for (let i = 0; i < drones.length; ++i) {
		const drone = drones[i];
		deliveryListByDrone.set(drone, []);
	}


	const lutTakenChopps = [];
	for (let i = 0; i < chopps.length; ++i) lutTakenChopps[i] = false;


	let assignedChopps = 0;
	while (assignedChopps < chopps.length) {

		/** @type {Array.<ClosestChopp>} */
		const closestChopps = [];

		for (let iDroneState = 0; iDroneState < dronesStates.length; ++iDroneState) {

			const droneState = dronesStates[iDroneState];
			const closestUntakenChoppIndex = findClosestUntakenChoppIndexOrMinus1(droneState, chopps, lutTakenChopps);

			// if more drones than chopps, stops at the last chopp
			if (closestUntakenChoppIndex === -1) break;

			const closestUntakenChopp = chopps[closestUntakenChoppIndex];
			closestChopps.push(new ClosestChopp(closestUntakenChopp, closestUntakenChoppIndex));
		}

		const distanceTable = createDistanceTable(closestChopps, dronesStates);
		// TODO: if debug mode, print logs
		// logDistanceTableObj(distanceTable, dronesStates);
		// logDroneStates(dronesStates);

		const deliveries = assignNextDeliveriesByDistanceTable(distanceTable, dronesStates, closestChopps, deliveryListByDrone, drones, chopps);
		assignedChopps += deliveries;

		// logDroneStates(dronesStates);
	}

	console.assert(assignedChopps === chopps.length, "assigned chopps must be === chopps.length")
	return deliveryListByDrone;
}


export class Point2D {
	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

// drone can be just a Point2D
export class Drone {
	constructor(xStart, yStart) {
		this.xStart = xStart;
		this.yStart = yStart;
	}
}


export class DistanceTable {
	/**
	 * @param {Array.<Number>} table
	 * @param {Array.<Number>} choppIndices
	 */
	constructor(table, choppIndices) {
		this.table = table;
		this.choppIndices = choppIndices;
	}
}

/**
 * @param {Array.<ClosestChopp>} closestChopps
 * @param {Array.<Point2D>} dronesStates
 * @returns {DistanceTable}
 */
const createDistanceTable = (closestChopps, dronesStates) => {
	const table = [];
	const choppIs = [];

	for (let iClose = 0; iClose < closestChopps.length; ++iClose) {
		const closestChopp = closestChopps[iClose];
		const closestChoppIndex = closestChopp.choppIndex;
		choppIs.push(closestChoppIndex);
		for (let iDrone = 0; iDrone < dronesStates.length; ++iDrone) {
			const droneState = dronesStates[iDrone];
			const droneToChoppDist = droneToChoppDistance(closestChopp.pos.x, closestChopp.pos.y, droneState.x, droneState.y);
			table[coord2dToLin(iDrone, iClose, dronesStates.length)] = droneToChoppDist;
		}
	}

	return new DistanceTable(table, choppIs);
}


/** @param {Array.<{ xStart: Number, yStart: Number }>} drones */
const initDroneStates = drones => {
	/** @type {Array.<Point2D>} */
	const dronesStates = [];

	for (const drone of drones) {
		dronesStates.push(new Point2D(drone.xStart, drone.yStart));
	}

	return dronesStates;
}


/**
 * @param {DistanceTable} distanceTable
 * @param {Array.<Point2D>} dronesStates
 * @param {Array.<ClosestChopp>} closestChopps
 * @param {DeliveriesByDrone} deliveryListByDrone
 * @param {List.<Drone>} drones
 * @param {List.<Point2D>} chopps
 * @returns {Number}
 */
const assignNextDeliveriesByDistanceTable = (distanceTable, dronesStates, closestChopps, deliveryListByDrone, drones, chopps) => {

	let assignedChopps = 0;

	// length min(K, available)
	const lutDroneTable = new Map();
	for (let iDrone = 0; iDrone < dronesStates.length; ++iDrone) lutDroneTable.set(iDrone, false);

	const lutChoppTable = new Map();
	for (let iChopp = 0; iChopp < closestChopps.length; ++iChopp) lutChoppTable.set(closestChopps[iChopp].choppIndex, false);

	/** @type {Map.<Number, LocalMinima>} */
	const localMinimaByChoppIndex = new Map();

	// find farthest closest chopp
	for (let iFoundDelivery = 0; iFoundDelivery < closestChopps.length; ++iFoundDelivery) {
		localMinimaByChoppIndex.clear();

		// find all max of local minimas
		for (let iClosestChopp = 0; iClosestChopp < closestChopps.length; ++iClosestChopp) {
			const closestChopp = closestChopps[iClosestChopp];
			if (lutChoppTable.get(closestChopp.choppIndex) === true) {
				// console.log(`      chopp ${closestChopp.choppIndex} true, skipping`);
				continue;
			}

			// TODO: make a copy of the drones states and reduce it instead of using through a lut
			sortClosestDroneOfChopp(iClosestChopp, dronesStates, closestChopp, distanceTable, localMinimaByChoppIndex, lutDroneTable, lutChoppTable);
		}
		// console.log(`sorted out local minimas:`); logLM(localMinimaByChoppIndex);

		const maximaOfLocalMinima = findMaximaOfLocalMinima(localMinimaByChoppIndex);
		// console.log(`max is ${maximaOfLocalMinima.d.toFixed(2)}, table ${labels.get(dronesStates[maximaOfLocalMinima.droneI])}${maximaOfLocalMinima.choppI}`);

		lutChoppTable.set(maximaOfLocalMinima.choppI, true);
		lutDroneTable.set(maximaOfLocalMinima.droneI, true);

		// console.log(`lut tables, chopp, drone:`); logLut(lutChoppTable); logLut(lutDroneTable); console.log(`    `); console.log(`    `);
		const drone = drones[maximaOfLocalMinima.droneI];
		const chopp = chopps[maximaOfLocalMinima.choppI];
		deliveryListByDrone.get(drone).push(chopp);

		const droneState = dronesStates[maximaOfLocalMinima.droneI];
		droneState.x = chopp.x;
		droneState.y = chopp.y;

		assignedChopps += 1;
	}

	return assignedChopps;
}


class LocalMinima {
	/**
	 * @param {Number} dist
	 * @param {Number} droneI
	 */
	constructor(dist, droneI) {
		this.dist = dist;
		this.droneI = droneI;
	}
}


/**
 * @param {Map.<Number, LocalMinima>} localMinimaByChoppIndex
 * @returns {{ d: Number, choppI: Number, droneI: Number }}
 */
const findMaximaOfLocalMinima = (localMinimaByChoppIndex) => {
	if (localMinimaByChoppIndex.size === 0) throw new Error("supposed to have elements in local minimas");

	let maxLocalMinimaDist = -1;
	let maxLocalMinimaChoppIndex = -1;
	let maxLocalMinimaDroneIndex = -1;

	for (const [choppIndex, localMinimaObj] of localMinimaByChoppIndex) {
		// console.log(`chopp index ${choppIndex} local min`);
		// console.log(localMinimaObj);
		if (localMinimaObj.dist > maxLocalMinimaDist) {
			maxLocalMinimaDist = localMinimaObj.dist;
			maxLocalMinimaChoppIndex = choppIndex;
			maxLocalMinimaDroneIndex = localMinimaObj.droneI
		}
	}

	if (maxLocalMinimaDist === -1) throw new Error("wtf, were there negative distances?");
	if (maxLocalMinimaChoppIndex === -1) throw new Error("wtf");
	if (maxLocalMinimaDroneIndex === -1) throw new Error("wtf");

	return { d: maxLocalMinimaDist,  choppI: maxLocalMinimaChoppIndex, droneI: maxLocalMinimaDroneIndex };
}


class ClosestChopp {
	/**
	 * @param {Point2D} pos
	 * @param {Number} choppIndex
	 */
	constructor(pos, choppIndex) {
		this.pos = pos;
		this.choppIndex = choppIndex;
	}
}

/**
 * @param {Number} iClosestChopp
 * @param {Array.<Point2D>} dronesStates
 * @param {ClosestChopp} closestChopp
 * @param {DistanceTable} distanceTable
 * @param {Map.<Number, LocalMinima>} localMinimaByChoppIndex
 * @param {Map.<Number, Boolean>} lutDroneTable
*/
const sortClosestDroneOfChopp = (iClosestChopp, dronesStates, closestChopp, distanceTable, localMinimaByChoppIndex, lutDroneTable) => {
	if (dronesStates.length === 0) throw new Error("empty drones states");

	let localMinima = Infinity;
	let localMinimaX = -1;
	for (let x = 0; x < dronesStates.length; ++x) {
		if (lutDroneTable.get(x) === true) {
			// console.log(`    drone ${x} true, skipping`);
			continue;
		}

		const distance = distanceTable.table[coord2dToLin(x, iClosestChopp, dronesStates.length)];
		if (distance < localMinima) {
			localMinima = distance;
			localMinimaX = x;
		}
	}

	console.assert(localMinimaX !== -1, "wtf localMinimaX === -1");
	// console.log(`local minima of chopp ${closestChopp.choppIndex} is ${localMinimaX}: ${localMinima.toFixed(2)}`);
	localMinimaByChoppIndex.set(closestChopp.choppIndex, { dist: localMinima, droneI: localMinimaX });
}

/**
 * @param {Point2D} droneState
 * @param {Array.<Point2D>} chopps
 * @param {Array.<Boolean>} lutTakenChopps
 * @returns {Number}
 */
const findClosestUntakenChoppIndexOrMinus1 = (droneState, chopps, lutTakenChopps) => {
	let minDroneDistForcurrentChopp = Infinity;
	let closestAvailableChoppIndex  = -1;

	for (let iChopp = 0; iChopp < chopps.length; ++iChopp) {
		const chopp = chopps[iChopp];
		if (lutTakenChopps[iChopp]) continue;

		const dist = droneToChoppDistance(chopp.x, chopp.y, droneState.x, droneState.y);
		if (dist < minDroneDistForcurrentChopp) {
			minDroneDistForcurrentChopp = dist;
			closestAvailableChoppIndex = iChopp;
		}
	}

	// if lutTakenChopps only contains trues, no chopp remains
	if (closestAvailableChoppIndex === -1) return -1;

	lutTakenChopps[closestAvailableChoppIndex] = true;
	return closestAvailableChoppIndex;
}
