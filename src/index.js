import { clamp, coord2dToLin, euclideanDistance } from "./lib/math.js";

(() => {

//  ########################################################################
//  ################################ HTML ##################################
//  ########################################################################

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvao");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

canvas.height = document.body.clientHeight - 16;
canvas.width  = canvas.height;

// for mode 3
canvas.width *= 1.2;


// CONFIG
const textSize = 18;
const circleRad = 7;
const lineWidth = 2;

const destinCircleRad = circleRad * 2


const droneColor = "blue";


const lineColor = "rgba(0, 0, 0, 0.5)"
const circleColor = "black";

const labelColor = "black";

const acceptPathColor = "blue";
const destinNodeColor = "blue";
const failPathColor = "red";

const activeNodesColor = "lime";

const indicesColor = "black";


const MAX_WID = 1111;
const MAX_HEI = 911;

const xFix = x => x; // / MAX_WID * canvas.width;
const yFix = y => y; // / MAX_HEI * canvas.height;


// constants
const TAU = 6.28318530;

const mode1 = () => {

}

const mode2 = () => {

}

const mode3 = () => {

}

const mode4 = () => {

}

const mode5 = () => {

}

const modeFunctionsByMode = new Map();

modeFunctionsByMode.set("mode1", mode1);
modeFunctionsByMode.set("mode2", mode2);
modeFunctionsByMode.set("mode3", mode3);
modeFunctionsByMode.set("mode4", mode4);
modeFunctionsByMode.set("mode5", mode5);

const onChangeMode = mode => {
	// console.log(`change mode ${mode}`);
	const switchMode = modeFunctionsByMode.get(mode);
	if (!switchMode) throw new Error(`Invalid mode: ${mode}`)

	// stopPlaying();
	// clearNodesAndCons();
	switchMode();
}

const play = () => {
	console.log(`play`);

}







//  ########################################################################
//  ############################## Graphics ################################
//  ########################################################################

let globalTimeoutHandle;
const sleep = ms => new Promise(r => {
	globalTimeoutHandle = setTimeout(r, ms);
});





// // simple 1, in order
// const draw = {
// 	chopps: [
// 		{ x: 0, y: 0 },
// 		{ x: 3, y: 0 },
// 	],
// 	drones: [
// 		{ xStart: 3, yStart: 1 },
// 		{ xStart: 5, yStart: 0 },
// 	]
// }

// // simple 1, out of order
// const draw = {
// 	chopps: [
// 		{ x: 3, y: 0 },
// 		{ x: 0, y: 0 },
// 	],
// 	drones: [
// 		{ xStart: 3, yStart: 1 },
// 		{ xStart: 5, yStart: 0 },
// 	]
// }


// // simple 1 error
// const draw = {
// 	chopps: [
// 		{ x: 0, y: 0 },
// 		{ x: 3, y: 0 },
// 	],
// 	drones: [
// 		{ xStart: 3, yStart: 1 },
// 		{ xStart: 8, yStart: 0 },
// 	]
// }



// // 4x4 many to many
// const draw = {
// 	chopps: [
// 		{ x: 0, y: 0 },
// 		{ x: 0, y: 1 },
// 		{ x: 0, y: 2 },
// 		{ x: 0, y: 3 },
// 	],
// 	drones: [
// 		{ xStart: 1, yStart: 3 },
// 		{ xStart: 1, yStart: 2 },
// 		{ xStart: 1, yStart: 1 },
// 		{ xStart: 1, yStart: 0 },
// 	]
// }

// // many to few
// const draw = {
// 	chopps: [
// 		{ x: 0, y: 0 },
// 		{ x: 0, y: 1 },
// 		{ x: 0, y: 2 },
// 		{ x: 0, y: 3 },
// 	],
// 	drones: [
// 		{ xStart: 1, yStart: 2 },
// 		{ xStart: 1, yStart: 1 },
// 	],
// }

// // few to many, order problem
// const draw = {
// 	chopps: [
// 		{ x: 0, y: 1 },
// 		{ x: 0, y: 2 },
// 	],
// 	drones: [
// 		{ xStart: 3, yStart: 3 },
// 		{ xStart: 2, yStart: 3 },
// 		{ xStart: 1, yStart: 3 },
// 	],
// }


// // permutations
// const draw = {
// 	chopps: [
// 		{ x: 2, y: -1.0 },
// 		{ x: 1, y: -2.0 },
// 		{ x: 0, y: -3.0 },
// 	],
// 	drones: [
// 		{ xStart: 2, yStart: 1 },
// 		{ xStart: 3, yStart: 1 },
// 		{ xStart: 4, yStart: 1 },
// 	]
// }

// // permutations many to few
const draw = {
	chopps: [
		{ x: 0, y: -4.5 },
		{ x: 1, y: -4.5 },
		{ x: 0, y: -3.0 },
		{ x: 2, y: -1.0 },
		{ x: 1, y: -2.0 },
	],
	drones: [
		{ xStart: 3, yStart: 1 },
		{ xStart: 4, yStart: 1 },
		{ xStart: 2, yStart: 1 },
	]
}

// // permutations 2
// const draw = {
// 	chopps: [
// 		{ x: 2, y: -1.0 },
// 		{ x: 1, y: -2.0 },
// 		{ x: 0, y: -3.0 },
// 	],
// 	drones: [
// 		{ xStart: 0, yStart: 1 },
// 		{ xStart: 2, yStart: 1 },
// 		{ xStart: 3, yStart: 1 },
// 	]
// }


class DistanceTable {
	/**
	 * @param {Array.<Number>} table
	//  * @param {Array.<Number>} droneIndices
	 * @param {Array.<Number>} choppIndices
	 */
	// constructor(table, droneIndices, choppIndices) {
	constructor(table, choppIndices) {
		this.table = table;
		// this.droneIndices = droneIndices;
		this.choppIndices = choppIndices;
	}
}

// TODO: type
const createDistanceTable = (closestChopps, dronesStates) => {
	const table = [];
	const choppIs = [];

	for (let iClose = 0; iClose < closestChopps.length; ++iClose) {
		const closestChopp = closestChopps[iClose];
		const closestChoppIndex = closestChopp.choppIndex;
		choppIs.push(closestChoppIndex);
		for (let iDrone = 0; iDrone < dronesStates.length; ++iDrone) {
			const droneState = dronesStates[iDrone];
			const droneToChoppDist = euclideanDistance(closestChopp.pos.x, closestChopp.pos.y, droneState.x, droneState.y);
			table[coord2dToLin(iDrone, iClose, dronesStates.length)] = droneToChoppDist;
		}
	}

	return new DistanceTable(table, choppIs);
}


class Point2D {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}


class ClosestChopp {
	/**
	 * @param {Point2D} pos
	 * @param {Number} choppIndex
	 */
	constructor(pos, choppIndex) {
		this.pos = pos;
		this.choppIndex = choppIndex;
		// this.dist = dist;
	}
}


/** @type {Array.<Point2D>} */
const dronesStates = [];

/** @param {Array.<{ xStart: Number, yStart: Number }>} drones */
const initDroneStates = drones => {
	for (const drone of drones) {
		dronesStates.push(new Point2D(drone.xStart, drone.yStart));
	}
}


// INIT LABELS graphics
const asciiACode = 'A'.charCodeAt(0);

/** @type {Map.<Object, String>} */
const labels = new Map();
/**
 * @param {Array.<{ xStart: Number, yStart: Number }>} drones
 * @param {Array.<Point2D>} chopps
 * @param {Array.<Point2D>} droneStates
 */
const initLabels = (drones, chopps, droneStates) => {
	for (let i = 0; i < drones.length; ++i) {
		const droneLabel = String.fromCharCode(asciiACode + i);

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
// initLabels(draw.drones, draw.chopps);





/**
 * @param {DistanceTable} dTable
 * @param {Array.<Point2D>} dronesStates
 */
const logDistanceTableObj = (dTable, dronesStates) => {
	let str = ` `;
	for (let i = 0; i < dronesStates.length; ++i) {
		// const droneIndex = dTable.droneIndices[i];
		str += "    "
		str += String.fromCharCode(asciiACode + i);
	}
	str += "\n"
	for (let y = 0; y < dTable.choppIndices.length; ++y) {
		const choppIndex = dTable.choppIndices[y];
		str += `${choppIndex}`;
		str += "| "
		for (let x = 0; x < dronesStates.length; ++x) {
			str += dTable.table[coord2dToLin(x, y, dronesStates.length)].toFixed(2);
			str += " "
		}
		str += "|\n"
	}
	console.log(str);
}

const logLM = localMinimaByChoppIndex => {
	let str = ``;
	for (const [k, v] of localMinimaByChoppIndex) {
		str += `${k} -> ${v.dist.toFixed(2)} (${v.droneI})\n`
	}
	console.log(str);
}

const logLut = lut => {
	let str = ``;
	for (const [k, v] of lut) {
		str += `${k} -> ${v}\n`
	}
	console.log(str);
}

const logDistanceTable = (table, width, height) => {
	let str = ` `;
	// for (let x = 0; x < width; ++x) {
	// 	str += "    "
	// 	str += String.fromCharCode(asciiACode + x);
	// }
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



class DroneStart {
	constructor(xStart, yStart) {
		this.xStart = xStart;
		this.yStart = yStart;
	}
}

/**
 * @typedef {Map.<DroneStart, Array.<Point2D>>} DeliveryPointsByDroneStart
 */


/**
 * @param {Array.<DroneStart>} drones
 * @param {Array.<Point2D>} chopps
 * @returns {DeliveryPointsByDroneStart}
 */
const solveDyn = (drones, chopps) => {

	/** @type {DeliveryPointsByDroneStart} */
	const deliveryListByDrone = new Map();

	for (let i = 0; i < drones.length; ++i) {
		const drone = drones[i];
		deliveryListByDrone.set(drone, []);
	}

	// TODO: local variable dronesStates, pass it along
	initDroneStates(drones);
	// graphics
	initLabels(draw.drones, draw.chopps, dronesStates);


	// TODO: chopp state
	const lutTakenChopps = [];
	for (let i = 0; i < chopps.length; ++i) lutTakenChopps[i] = false;
	// console.log(lutTakenChopps);

	// /** @type {Array.<Point2D>} */
	// let closestAvailableChopps = [];


	// LOOP HERE


	/** @type {Array.<ClosestChopp>} */
	const closestChopps = [];

	// TODO: function getClosestChopps
	for (let iDroneState = 0; iDroneState < dronesStates.length; ++iDroneState) {

		const droneState = dronesStates[iDroneState];
		const closestUntakenChoppIndex = findClosestUntakenChoppIndexOrMinus1(droneState, chopps, lutTakenChopps);

		// TODO: if more drones than chopps, find the closest drones
		if (closestUntakenChoppIndex === -1) break;

		const closestUntakenChopp = chopps[closestUntakenChoppIndex];
		// closestAvailableChopps.push(closestUntakenChopp);
		// closestAvailableChoppIndices.push(closestUntakenChoppIndex);
		// console.log(`drone ${labels.get(drone)} assigned to chopp ${labels.get(closestAvailChopp)}`);

		closestChopps.push(new ClosestChopp(closestUntakenChopp, closestUntakenChoppIndex));
	}
	// for (const closest of closestChopps) { console.log(labels.get(closest.pos)); }





	const distanceTableObj = createDistanceTable(closestChopps, dronesStates);
	// TODO: if debug mode
	logDistanceTableObj(distanceTableObj, dronesStates);




	// length min(K, available)
	// TODO: make a copy of the drones states and reduce it instead of using through a lut
	const lutDroneTable = new Map();
	for (let iDrone = 0; iDrone < dronesStates.length; ++iDrone) lutDroneTable.set(iDrone, false);

	const lutChoppTable = new Map();
	for (let iChopp = 0; iChopp < closestChopps.length; ++iChopp) lutChoppTable.set(closestChopps[iChopp].choppIndex, false);



	// TODO: refactor this into a decent function

	// TODO: class LocalMinima
	/** @type {Map.<Number, { dist: Number, droneI: Number }>} */
	const localMinimaByChoppIndex = new Map();

	// find farthest closest chopp
	for (let iFoundDelivery = 0; iFoundDelivery < closestChopps.length; ++iFoundDelivery) {
		localMinimaByChoppIndex.clear();

		// find all max of local minimas
		for (let iClosest = 0; iClosest < closestChopps.length; ++iClosest) {
			const closestChopp = closestChopps[iClosest];
			if (lutChoppTable.get(closestChopp.choppIndex) === true) {
				// console.log(`      chopp ${closestChopp.choppIndex} true, skipping`);
				continue;
			}

			// TODO: make a copy of the drones states and reduce it instead of using through a lut
			sortClosestDroneOfChopp(iClosest, dronesStates, closestChopp, distanceTableObj, localMinimaByChoppIndex, lutDroneTable, lutChoppTable);
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
	}


	return deliveryListByDrone;
}


/**
 * @param {Map.<Number, { dist: Number, droneI: Number }>} localMinimaByChoppIndex 
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



/**
 * @param {Number} iClosest
 * @param {Array.<Point2D>} dronesStates
 * @param {ClosestChopp} closestChopp
 * @param {DistanceTable} distanceTable
 * @param {Map.<Number, { dist: Number, droneI: Number }>} localMinimaByChoppIndex
 * @param {Map.<Number, Boolean>} lutDroneTable
*/
const sortClosestDroneOfChopp = (iClosest, dronesStates, closestChopp, distanceTable, localMinimaByChoppIndex, lutDroneTable) => {
	if (dronesStates.length === 0) throw new Error("empty drones states");

	let localMinima = Infinity;
	let localMinimaX = -1;
	for (let x = 0; x < dronesStates.length; ++x) {
		if (lutDroneTable.get(x) === true) {
			// TODO: make a copy of the drones states and reduce it instead of using through luts
			// console.log(`    drone ${x} true, skipping`);
			continue;
		}

		const distance = distanceTable.table[coord2dToLin(x, iClosest, dronesStates.length)];
		if (distance < localMinima) {
			localMinima = distance;
			localMinimaX = x;
		}
	}

	console.assert(localMinimaX !== -1, "wtf");
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

		const dist = euclideanDistance(chopp.x, chopp.y, droneState.x, droneState.y);
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


/** @type {DeliveryPointsByDroneStart} */
const deliveryListsByDrone = solveDyn(draw.drones, draw.chopps);
if (!deliveryListsByDrone) throw new Error("delivery list undefined!");







const renderDescription = () => {
	ctx.fillStyle = circleColor;
	fillCircleIn(15, 15, circleRad);

	const txt = ": Pedido chopp";
	ctx.font = `${20}px sans-serif`
	const measure = ctx.measureText(txt);
	const textH = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent
	fillText(txt, 15 + circleRad, 15 + textH/2);

	ctx.fillStyle = droneColor;
	fillCircleIn(15, 45, circleRad);

	const txt2 = ": Drone";
	ctx.font = `${20}px sans-serif`
	const measure2 = ctx.measureText(txt);
	const textH2 = measure2.actualBoundingBoxAscent + measure2.actualBoundingBoxDescent
	fillText(txt2, 15 + circleRad, 45 + textH2/2);
}


const xRemapToCanvas = (x, coordinateSystemMax) => x / coordinateSystemMax * canvas.width;
const yRemapToCanvas = (y, coordinateSystemMax) => (y / coordinateSystemMax * canvas.height);

const xCenterInCanvas = x => x + canvas.width  * 0.5;
const yCenterInCanvas = y => canvas.height - (y + canvas.height * 0.5);


const coordinateSystemMax = 10;

const renderConnections = () => {
	ctx.lineWidth = 3;
	ctx.strokeStyle = lineColor;
	for (const [droneSt, deliveryList] of deliveryListsByDrone) {
		if (deliveryList.length === 0) continue;

		const xDrone = remapX(droneSt.xStart);
		const yDrone = remapY(droneSt.yStart);

		const first = deliveryList[0];
		const xF = remapX(first.x);
		const yF = remapY(first.y);
		strokeLineBetween(xDrone, yDrone, xF, yF);

	}
}

const remapX = x => 100 + xRemapToCanvas(x, coordinateSystemMax);
const remapY = y => yCenterInCanvas(yRemapToCanvas(y, coordinateSystemMax));

const renderChoppsAndDrones = () => {
	ctx.fillStyle = circleColor;
	for (const chopp of draw.chopps) {
		const x = remapX(chopp.x);
		const y = remapY(chopp.y);
		// const x = 100 + xRemapToCanvas(chopp.x, coordinateSystemMax);
		// const y = yCenterInCanvas(yRemapToCanvas(chopp.y, coordinateSystemMax));
		fillCircleIn(x, y, circleRad);

		const label = labels.get(chopp);
		const measure = ctx.measureText(label);
		const letterW = measure.width
		const letterH = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent
		fillText(label, x - letterW * 0.5, y - letterH);
	}

	ctx.fillStyle = droneColor;
	for (const drone of draw.drones) {
		const x = remapX(drone.xStart);
		const y = remapY(drone.yStart);
		// const x = 100 + xRemapToCanvas(drone.xStart, coordinateSystemMax);
		// const y = yCenterInCanvas(yRemapToCanvas(drone.yStart, coordinateSystemMax));
		fillCircleIn(x, y, circleRad);

		const label = labels.get(drone);
		const measure = ctx.measureText(label);
		const letterW = measure.width
		const letterH = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent
		fillText(label, x - letterW * 0.5, y - letterH);
	}
}

const render = () => {

	// reset
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.setLineDash([]);

	renderDescription();

	renderConnections();

	renderChoppsAndDrones();


	// return;
	// HERE
	window.requestAnimationFrame(render);
}



const drawBezier = (startLocal, cp1, cp2, end) => {
	ctx.beginPath();
	ctx.moveTo(startLocal.x, startLocal.y);
	ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
	ctx.stroke();
}

const strokeCircleIn = (x, y, size) => {
	if (!size) console.error(`wrong size in strokeCircleIn`);
	ctx.beginPath();
	ctx.arc(x, y, size, 0, TAU);
	ctx.stroke();
}

const fillCircleIn = (x, y, size) => {
	ctx.beginPath();
	ctx.arc(xFix(x), yFix(y), yFix(size), 0, TAU);
	ctx.fill();
}

const strokeLineBetween = (x0, y0, x1, y1) => {
	ctx.beginPath();
	ctx.moveTo(xFix(x0), yFix(y0));
	ctx.lineTo(xFix(x1), yFix(y1));
	ctx.stroke();
}

const fillText = (text, x, y) => {
	ctx.fillText(text, xFix(x), yFix(y))
}



//  ########################################################################
//  ############################# BOOTSTRAP ################################
//  ########################################################################


/** @type {HTMLSelectElement} */
const select = document.getElementById("modos");
select.onchange = () => onChangeMode(select.value);

/** @type {HTMLInputElement} */
const playButton = document.getElementById("play");
playButton.onclick = play;


select.value = "mode1";
select.onchange()


window.requestAnimationFrame(render);


})();