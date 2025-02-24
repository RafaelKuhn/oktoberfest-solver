import { getSeededRandomGenerator } from "./deterministicSeededRandom.js";
import { lerp } from "./math.js";
import { Drone, Point2D } from "./oktoberfestSolver.js";


export class OktoberfestLayoutData {
	/**
	 * @param {Array.<Point2D>} chopps
	 * @param {Array.<Drone>} drones
	 */
	constructor(chopps, drones) {
		this.chopps = chopps;
		this.drones = drones;
	}
}


/** @param {OktoberfestLayoutData} data */
const stargazerMode = data => {

	const getRandom = getSeededRandomGenerator("salário programador senior > 15 mil kk")
	const randomPointsAmount = 32;

	data.chopps = [];
	pushRandomChoppsInACircle(5, 0, 4, randomPointsAmount, getRandom, data);

	const droneMinY = -4;
	const droneMaxY = 4;
	const droneAmount = 10;
	data.drones = [];
	pushDronesInParallel(droneAmount, droneMinY, droneMaxY, data);
}


/** @param {OktoberfestLayoutData} data */
const unoptimized = data => {
	// // simple 1 error
	data.chopps = [
		{ x: 0, y: 0 },
		{ x: 3, y: 0 },
	]
	data.drones = [
		{ xStart: 3, yStart: 1 },
		{ xStart: 8, yStart: 0 },
	]
}

/** @param {OktoberfestLayoutData} data */
const manyFew = data => {
	data.chopps = [
		{ x: 0, y: -1 },
		{ x: 0, y: 0 },
		{ x: 0, y: 1 },
		{ x: 0, y: 2 },
	]
	data.drones = [
		{ xStart: 9, yStart: 3 },
		{ xStart: 8, yStart: 3 },
		{ xStart: 7, yStart: 3 },
		{ xStart: 6, yStart: 3 },
		{ xStart: 5, yStart: 3 },
		{ xStart: 4, yStart: 3 },
		{ xStart: 3, yStart: 3 },
		{ xStart: 2, yStart: 3 },
		{ xStart: 1, yStart: 3 },
	]
}

/** @param {OktoberfestLayoutData} data */
const manyFewCluster = data => {
	const getRandom = getSeededRandomGenerator("não tenho sorte.")

	data.chopps = [];
	pushRandomChoppsInACircleSurface(4, 0, 3.5, 15, getRandom, data);

	data.drones = [];
	pushRandomDronesInACircle(4, 0, 2.5, 50, getRandom, data);
}

/** @param {OktoberfestLayoutData} data */
const simple = data => {
	// // simple 1, in order
	data.chopps = [
		{ x: 0, y: 0 },
		{ x: 3, y: 0 },
	]
	data.drones = [
		{ xStart: 3, yStart: 1 },
		{ xStart: 5, yStart: 0 },
	]
}

/** @param {OktoberfestLayoutData} data */
const obviousPath1 = data => {
	data.chopps = [
		{ x: 3, y: 0 },
		{ x: 4, y: 1 },
		{ x: 5, y: 0 },
		{ x: 4, y: -1 },
		{ x: 3, y: -2 },
		{ x: 4, y: -3 },
		{ x: 5, y: -2 },
	]
	data.drones = [
		{ xStart: 0, yStart: 0 },
	]
}

/** @param {OktoberfestLayoutData} data */
const obviousPath2 = data => {
	data.chopps = [
		{ x: 3, y: 0 },
		{ x: 4, y: 1 },
		{ x: 5, y: 0 },
		{ x: 4, y: -1 },
		{ x: 3, y: -2 },
		{ x: 4, y: -3 },
		{ x: 5, y: -2 },
	]
	data.drones = [
		{ xStart: 0, yStart: 0 },
		{ xStart: 0, yStart: 1 },
	]
}

/** @param {OktoberfestLayoutData} data */
const obviousPath3 = data => {
	data.chopps = [
		{ x: 3, y: 0 },
		{ x: 4, y: 1 },
		{ x: 5, y: 0 },
		{ x: 4, y: -1 },
		{ x: 3, y: -2 },
		{ x: 4, y: -3 },
		{ x: 5, y: -2 },
	]
	data.drones = [
		{ xStart: 0, yStart: 0 },
		{ xStart: 0, yStart: 1 },
		{ xStart: 0, yStart: -1 },
	]
}


/** @param {OktoberfestLayoutData} data */
const permutations2 = data => {
	// // permutations
	data.chopps = [
		{ x: 2, y: -1.0 },
		{ x: 1, y: -2.0 },
		{ x: 0, y: -3.0 },
	]
	data.drones = [
		{ xStart: 2, yStart: 1 },
		{ xStart: 3, yStart: 1 },
		{ xStart: 4, yStart: 1 },
	]
}

/** @param {OktoberfestLayoutData} data */
const permutations1 = data => {
	data.chopps = [
		{ x: 2, y: -1.0 },
		{ x: 1, y: -2.0 },
		{ x: 0, y: -3.0 },
	];
	data.drones = [
		{ xStart: 0, yStart: 1 },
		{ xStart: 2, yStart: 1 },
		{ xStart: 3, yStart: 1 },
	];
}

/** @param {OktoberfestLayoutData} data */
const permutations3 = data => {
	// // permutations many to few
	data.chopps = [
		{ x: 0, y: -4.5 },
		{ x: 0.8, y: -4.5 },
		{ x: 0, y: -3.0 }, // 2
		{ x: 2, y: -1.0 }, // 3
		{ x: 1, y: -2.0 }, // 4
	]
	data.drones = [
		{ xStart: 3, yStart: 1 },
		{ xStart: 4, yStart: 1 },
		{ xStart: 2, yStart: 1 },
	]
}

/** @param {OktoberfestLayoutData} data */
const test1 = data => {
	data.chopps = [
		{ x: 1.0, y: 0 },
		{ x: 1.0, y: 1 },
	]
	data.drones = [
		{ xStart: 0, yStart: 0 }, // A
		{ xStart: 0, yStart: 1.99 }, // B certo
		// { xStart: 0, yStart: 2.01 }, // B errado
	]
}


/** @param {OktoberfestLayoutData} data */
const test = data => {
	// data.chopps = [
	// 	{ x: 0.0, y: -4 },
	// 	{ x: 1.0, y: -4 },
	// ]
	// data.drones = [
	// 	{ xStart: 0, yStart: -3.0 }, // A
	// 	{ xStart: 1, yStart: -2.0 }, // B certo
	// ]

	data.chopps = [
		{ x: 0.0, y: -4 },
		{ x: 1.0, y: -4 },
	]
	data.drones = [
		{ xStart: 0, yStart: -3.0 }, // A
		{ xStart: 1, yStart: -2.0 }, // B certo
	]
}

/** @param {OktoberfestLayoutData} data */
const stress = data => {
	console.log(`TODO: profile stress test!`);

	const getRandom = getSeededRandomGenerator("alguma seed 2")

	data.chopps = [];
	pushRandomChoppsInACircle(6.0,  0.0, 2, 2000, getRandom, data);
	pushRandomChoppsInACircle(0.5, -2.5, 1, 1000, getRandom, data);

	data.drones = [];
	pushRandomDronesInACircle(1.5, 2.5, 1, 200, getRandom, data);
}


/** @param {OktoberfestLayoutData} data */
const clusters = data => {
	const getRandom = getSeededRandomGenerator("alguma seed 2")

	data.chopps = [];
	pushRandomChoppsInACircle(6, 0, 2, 20, getRandom, data);
	pushRandomChoppsInACircle(0.5, -2.5, 1, 10, getRandom, data);

	data.drones = [
		{ xStart: 3, yStart: 0 },
		// { xStart: 3.2, yStart: 0.2 }, // point close to drone A
		// { xStart: 0.5, yStart: -2.5 }, // point closer to second clustewr
	]
}

/** @param {OktoberfestLayoutData} data */
const parallel = data => {
	// // 4x4 many to many
	data.chopps = [
		{ x: 1.0, y: 0 },
		{ x: 3.2, y: 1 },
		{ x: 4.4, y: 2 },
		{ x: 5.6, y: 3 },
	]
	data.drones = [
		{ xStart: 0, yStart: 3 },
		{ xStart: 0, yStart: 2 },
		{ xStart: 0, yStart: 1 },
		{ xStart: 0, yStart: 0 },
	]
}

/** @param {OktoberfestLayoutData} data */
const parallel2 = data => {
	// // 4x4 many to many
	data.chopps = [
		{ x: 1.0, y: 0 },
		{ x: 3.2, y: 1 },
		{ x: 4.4, y: 2 },
		{ x: 5.6, y: 3 },

		{ x: 1.5, y: 0 },
		{ x: 3.7, y: 1 },
		{ x: 5.1, y: 2 },
		{ x: 6.1, y: 3 },
	]
	data.drones = [
		{ xStart: 0, yStart: 3 },
		{ xStart: 0, yStart: 2 },
		{ xStart: 0, yStart: 1 },
		{ xStart: 0, yStart: 0 },
	]
}

/** @param {OktoberfestLayoutData} data */
const modeUbots = data => {
	data.drones = [
		{ xStart: 0.5, yStart: 4 },
		// { xStart: 3.0, yStart: 4 },
		// { xStart: 5.0, yStart: 2 },
		// { xStart: 7.0, yStart: 4 },
		// { xStart: 8.0, yStart: 3 },
	]
	data.chopps = [
		/* 0 */ { x: 7.6, y: 0.6 },
		/* 1 */ { x: 7.4, y: 0.7 },
		/* 2 */ { x: 8, y: 0.6 },
		/* 3 */ { x: 8.2, y: 0.8 },
		/* 4 */ { x: 8.2, y: 1 },
		/* 5 */ { x: 8, y: 1.2 },
		/* 6 */ { x: 7.4, y: 1.4 },
		/* 7 */ { x: 7.4, y: 1.8 },
		/* 8 */ { x: 7.6, y: 2 },
		/* 9 */ { x: 7.6, y: 1.2 },
		/* 10 */ { x: 7.9, y: 2 },
		/* 11 */ { x: 8, y: 2 },
		/* 12 */ { x: 8.2, y: 1.8 },
		/* 13 */ { x: 6.8, y: 3 },
		/* 14 */ { x: 6.5, y: 3 },
		/* 15 */ { x: 6.3, y: 3 },
		/* 16 */ { x: 6, y: 3 },
		/* 17 */ { x: 6.4, y: 0.8 },
		/* 18 */ { x: 6.4, y: 1.2 },
		/* 19 */ { x: 6.4, y: 1.6 },
		/* 20 */ { x: 6.4, y: 2 },
		/* 21 */ { x: 6.4, y: 2.6 },
		/* 22 */ { x: 6.4, y: 3.4 },
		/* 23 */ { x: 5.3, y: 1 },
		/* 24 */ { x: 5.8, y: 1.2 },
		/* 25 */ { x: 5.6, y: 1 },
		/* 26 */ { x: 5.8, y: 1.6 },
		/* 27 */ { x: 5.6, y: 1.8 },
		/* 28 */ { x: 5.3, y: 1.8 },
		/* 29 */ { x: 4.8, y: 1.6 },
		/* 30 */ { x: 5, y: 1.8 },
		/* 31 */ { x: 4.8, y: 1.2 },
		/* 32 */ { x: 5, y: 1 },
		/* 33 */ { x: 3.2, y: 1.8 },
		/* 34 */ { x: 3.8, y: 1.8 },
		/* 35 */ { x: 4, y: 1.6 },
		/* 36 */ { x: 4.2, y: 1.4 },
		/* 37 */ { x: 3.4, y: 1.8 },
		/* 38 */ { x: 3.6, y: 1.8 },
		/* 39 */ { x: 4.2, y: 1 },
		/* 40 */ { x: 3.4, y: 0.8 },
		/* 41 */ { x: 3.8, y: 0.8 },
		/* 42 */ { x: 3.2, y: 0.8 },
		/* 43 */ { x: 3, y: 1 },
		/* 44 */ { x: 3, y: 1.5 },
		/* 45 */ { x: 3, y: 2 },
		/* 46 */ { x: 3, y: 2.5 },
		/* 47 */ { x: 3, y: 3 },
		/* 48 */ { x: 3, y: 3.5 },
		/* 49 */ { x: 2, y: 3.5 },
		/* 50 */ { x: 2, y: 3 },
		/* 51 */ { x: 2, y: 2.5 },
		/* 52 */ { x: 2, y: 2 },
		/* 53 */ { x: 2, y: 1.5 },
		/* 54 */ { x: 2, y: 1 },
		/* 55 */ { x: 1.5, y: 0.5 },
		/* 56 */ { x: 0.95, y: 0.58 },
		/* 57 */ { x: 0.53, y: 1.1 },
		/* 58 */ { x: 0.5, y: 1.5 },
		/* 59 */ { x: 0.5, y: 2 },
		/* 60 */ { x: 0.5, y: 2.5 },
		/* 61 */ { x: 0.5, y: 3 },
		/* 62 */ { x: 0.5, y: 3.5 },
	]
}



/** @type {Map.<String, Function>} */
const internalCallbacksByMode = new Map();

/** @type {Array.<Function>} */
const onChangeModeCallbacks = [];

/** @param {OktoberfestLayoutData} data */
export const createSelectLayoutsOptions = data => {

	// makeSelectOption("TEST TODO REMOVE", () =>
	// 	test(data));

	makeSelectOption("1 Drone", () =>
		obviousPath1(data));

	makeSelectOption("2 Drones", () =>
		obviousPath2(data));

	makeSelectOption("3 Drones", () =>
		obviousPath3(data));
		
	makeSelectOption("Many to few 1", () =>
		manyFew(data));

	makeSelectOption("Many to few 2", () =>
		manyFewCluster(data));

	makeSelectOption("Permutations 1", () =>
		permutations1(data));
	
	makeSelectOption("Permutations 2", () =>
		permutations2(data));

	makeSelectOption("Permutations 3", () =>
		permutations3(data));

	makeSelectOption("Stress test", () =>
		stress(data));

	makeSelectOption("Clusters", () =>
		clusters(data));

	makeSelectOption("Parallel", () =>
		parallel(data));


	makeSelectOption("Simple", () =>
		simple(data));

	makeSelectOption("Unoptimized", () =>
		unoptimized(data));


	makeSelectOption("⭐ Stargazer", () =>
		stargazerMode(data));
	
	makeSelectOption("🤖 Ubots", () =>
		modeUbots(data));

}

export const selecteStartingOption = () => {
	// TODO: better way of selecting initial default option

	select.value = `${2}`; // 3 drones

	// select.value = `${8}`; // stress test
	// select.value = `${9}`; // clusters
	// select.value = `${optionsCount - 2}`; // stargazer

	select.onchange();
}

/** @param {Function} callback */
export const addOnSelectedLabelChanged = callback => {
	onChangeModeCallbacks.push(callback);
}


const onChangeMode = mode => {
	const switchMode = internalCallbacksByMode.get(mode);
	if (!switchMode) throw new Error(`Invalid mode: ${mode}`);

	// stopPlaying();
	// TODO: refresh graph
	switchMode();

	for (const callback of onChangeModeCallbacks) {
		callback();
	}
}

let optionsCount = 0;
const makeSelectOption = (label, callback) => {
	const value = `${optionsCount}`;
	if (internalCallbacksByMode.has(value)) throw new Error(`option of value '${value}' already there!`);

	internalCallbacksByMode.set(value, callback);

	const option = new Option(label, value, false, false);
	select.add(option);

	optionsCount += 1;
}

/** @type {HTMLSelectElement} */
const select = document.getElementById("selectLayout");
select.onchange = () => onChangeMode(select.value);


//  ##############################################################################################
//  ######################## RANDOM CRAP TO GENERATE CHOPPS/DRONES LAYOUT ########################
//  ##############################################################################################

const pushRandomChoppsInACircleSurface = (circleX, circleY, rad, randomPointsInCircleAmount, getRandom, data) => {
	for (let i = 0; i < randomPointsInCircleAmount; ++i) {
		const pt = getRandomPointOnCircleSurfaceRecursive(rad, getRandom);
		pt.x += circleX;
		pt.y += circleY;
		data.chopps.push(pt);
	}
}

const pushRandomChoppsInACircle = (circleX, circleY, rad, randomPointsInCircleAmount, getRandom, data) => {
	for (let i = 0; i < randomPointsInCircleAmount; ++i) {
		const pt = getRandomPointInsideCircleRecursive(rad, getRandom);
		pt.x += circleX;
		pt.y += circleY;
		data.chopps.push(pt);
	}
}


const pushRandomDronesInACircle = (circleX, circleY, rad, randomPointsInCircleAmount, getRandom, data) => {
	for (let i = 0; i < randomPointsInCircleAmount; ++i) {
		const dr = getRandomPointInsideCircleRecursive(rad, getRandom);

		data.drones.push({ xStart: dr.x + circleX, yStart: dr.y + circleY } );
	}
}

const pushDronesInParallel = (droneAmount, droneMinY, droneMaxY, data) => {
	// TODO: use coordinateSystemMax

	for (let i = 0; i < droneAmount; ++i) {
		const t = i / (droneAmount - 1);
		const droneY = lerp(droneMinY, droneMaxY, t);

		data.drones.push({ xStart: 0, yStart: droneY });
	}
}

const getRandomPointInsideCircleRecursive = (radius, random) => {

	// Generate 2 random numbers in the [-1, 1] interval
	const x = random() * 2 - 1;
	const y = random() * 2 - 1;

	if ((x*x + y*y) < 1) return { x: x * radius, y: y * radius };

	return getRandomPointInsideCircleRecursive(radius, random);
}

const getRandomPointOnCircleSurfaceRecursive = (radius, random) => {

	// Generate 2 random numbers in the [-1, 1] interval
	const u = random()*2 - 1;
	const v = random()*2 - 1;

	const u2 = u*u;
	const v2 = v*v;
	const r = u2 + v2;

	let x,y;
	if (r <= 1) {
		x = (u2 - v2)/r;
		y = (2*u*v)/r;
	}

	if (r > 1) return getRandomPointOnCircleSurfaceRecursive(radius, random);

	return { x: x * radius, y: y * radius };
}