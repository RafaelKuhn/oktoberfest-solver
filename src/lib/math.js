
export const TAU = 6.28318530;
export const infinity = 9_999_999_999;

export const coord2dToLin = (x, y, width) => y * width + x;

export const droneToChoppDistance = (x0, y0, x1, y1) => euclideanDistance(x0, y0, x1, y1);

const euclideanDistance = (x0, y0, x1, y1) => {
	const pointsVecX = x1 - x0;
	const pointsVecY = y1 - y0;
	return Math.sqrt(pointsVecX * pointsVecX + pointsVecY * pointsVecY);
}

const euclideanDistanceSq = (x0, y0, x1, y1) => {
	const pointsVecX = x1 - x0;
	const pointsVecY = y1 - y0;
	return pointsVecX * pointsVecX + pointsVecY * pointsVecY;
}


/** @return {Number} */
export const clamp = (x, min, max) => Math.max(min, Math.min(x, max));

/** @return {Number} */
export const lerp = (a, b, t) => (1 - t) * a + t * b;

/** @return {Number} */
const inverseLerp = (a, b, v) => (v - a) / (b - a);

/** @return {Number} */
const dot = (x0, y0, x1, y1) => x0 * x1 + y0 * y1;


const isApprox = (v, dest) => isApproxThreshold(v, dest, 0.005);
const isApproxThreshold = (v, dest, threshold) => Math.abs(v - dest) < threshold;

/**
 * @param {{ x: Number, y: Number }} point0 
 * @param {{ x: Number, y: Number }} point1 
 */
const manhattanDistance = (point0, point1) => {
	return Math.abs(point0.x - point1.x) + Math.abs(point0.y - point1.y);
}

/**
 * @param {{ x: Number, y: Number }} point0 
 * @param {{ x: Number, y: Number }} point1 
 */
const chebyshevDistance = (point0, point1) => {
	const xDist = Math.abs(point0.x - point1.x);
	const yDist = Math.abs(point0.y - point1.y);
	return Math.max(xDist, yDist);
}

