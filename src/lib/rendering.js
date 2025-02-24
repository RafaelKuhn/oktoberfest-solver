import { labels } from "./debug.js";
import { TAU } from "./math.js";
import { Drone, Point2D } from "./oktoberfestSolver.js";


const coordinateSystemMax = 10;

const droneColor = "blue";
const choppColor = "black";

const lineColor  = "rgba(0, 0, 0, 0.5)"
const lineColor2 = "rgba(255, 0, 0, 0.5)"

const circleRad = 7;

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvao");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");


/**
 * @type {{
 * deliveryList: DeliveriesByDrone,
 * chopps: Array.<Point2D>  
 * drones: Array.<Drone>
 * }}
 * */
const renderData = {
	deliveryList: null,
	chopps: null,
	drones: null,
}


/** @param {DeliveriesByDrone} deliveryList */
export const setDeliveriesToRender = (chopps, drones, deliveryList) => {
	renderData.chopps = chopps;
	renderData.drones = drones;
	renderData.deliveryList = deliveryList;
}

export const startRendering = () => {
	if (renderData.deliveryList === null) throw new Error(`delivery list is null!`);

	window.requestAnimationFrame(render);
}


const render = () => {

	renderClear();

	renderDescription();
	renderConnections();
	renderChoppsAndDrones();

	window.requestAnimationFrame(render);
}

const widToHeightRatio = 1.2;

window.addEventListener("resize", () => {
	setupCanvas();
});

export const setupCanvas = () => {
	canvas.height = document.body.clientHeight - 16;
	canvas.width  = canvas.height;
	canvas.width *= widToHeightRatio;
}


const renderClear = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.setLineDash([]);
}

const renderDescription = () => {
	ctx.fillStyle = choppColor;
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

const remapX = x => 100 + xRemapToCanvas(x, coordinateSystemMax * widToHeightRatio);
const remapY = y => yCenterInCanvas(yRemapToCanvas(y, coordinateSystemMax));


const renderConnections = () => {
	ctx.lineWidth = 3;
	ctx.strokeStyle = lineColor;
	let i = 0;
	for (const [droneSt, deliveryList] of renderData.deliveryList) {
		if (deliveryList.length === 0) continue;

		if (i % 2 == 0) 
			ctx.strokeStyle = lineColor;
		else
			ctx.strokeStyle = lineColor2;

		const xDrone = remapX(droneSt.xStart);
		const yDrone = remapY(droneSt.yStart);

		const first = deliveryList[0];
		const xFirst = remapX(first.x);
		const yFirst = remapY(first.y);
		strokeLineBetween(xDrone, yDrone, xFirst, yFirst );

		let xLast = xFirst;
		let yLast = yFirst;
		for (let i = 1; i < deliveryList.length; ++i) {
			const delivery = deliveryList[i];
			const xDelivery = remapX(delivery.x);
			const yDelivery = remapY(delivery.y);
			strokeLineBetween(xLast, yLast, xDelivery, yDelivery);
			xLast = xDelivery;
			yLast = yDelivery;
		}
		i += 1;
	}
}


const renderChoppsAndDrones = () => {
	ctx.fillStyle = choppColor;
	for (const chopp of renderData.chopps) {
		const x = remapX(chopp.x);
		const y = remapY(chopp.y);
		fillCircleIn(x, y, circleRad);

		const label = labels.get(chopp);
		const measure = ctx.measureText(label);
		const letterW = measure.width
		const letterH = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent
		fillText(label, x - letterW * 0.5, y - letterH);
	}

	ctx.fillStyle = droneColor;
	for (const drone of renderData.drones) {
		const x = remapX(drone.xStart);
		const y = remapY(drone.yStart);
		fillCircleIn(x, y, circleRad);

		const label = labels.get(drone);
		const measure = ctx.measureText(label);
		const letterW = measure.width
		const letterH = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent
		fillText(label, x - letterW * 0.5, y - letterH);
	}
}


//  #########################################################################
//  ############################# drawing stuff #############################
//  #########################################################################

const xFix = x => x; // / MAX_WID * canvas.width;  // UNUSED!
const yFix = y => y; // / MAX_HEI * canvas.height; // UNUSED!


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
