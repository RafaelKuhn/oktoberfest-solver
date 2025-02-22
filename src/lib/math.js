

const infinity = 9_999_999;

export const isApprox = (v, dest) => isApproxThreshold(v, dest, 0.005);
export const isApproxThreshold = (v, dest, threshold) => Math.abs(v - dest) < threshold;


export const euclideanDistance = (x0, y0, x1, y1) => {
	const pointsVecX = x1 - x0;
	const pointsVecY = y1 - y0;
	return Math.sqrt(pointsVecX * pointsVecX + pointsVecY * pointsVecY);
}

export const euclideanDistanceSquared = (x0, y0, x1, y1) => {
	const pointsVecX = x1 - x0;
	const pointsVecY = y1 - y0;
	return pointsVecX * pointsVecX + pointsVecY * pointsVecY;
}

export const coord2dToLin = (x, y, width) => y * width + x;

/**
 * @param {{ x: Number, y: Number }} point0 
 * @param {{ x: Number, y: Number }} point1 
 */
const euclideanDistance2 = (point0, point1) => {
	const pointsVecX = point1.x - point0.x;
	const pointsVecY = point1.y - point0.y;
	return Math.sqrt(pointsVecX * pointsVecX + pointsVecY * pointsVecY);
}

/**
 * @param {{ x: Number, y: Number }} point0 
 * @param {{ x: Number, y: Number }} point1 
 */
export const manhattanDistance = (point0, point1) => {
	return Math.abs(point0.x - point1.x) + Math.abs(point0.y - point1.y);
}

/**
 * @param {{ x: Number, y: Number }} point0 
 * @param {{ x: Number, y: Number }} point1 
 */
export const chebyshevDistance = (point0, point1) => {
	const xDist = Math.abs(point0.x - point1.x);
	const yDist = Math.abs(point0.y - point1.y);
	return Math.max(xDist, yDist);
}


/** @return {Number} */
export const clamp = (x, min, max) => Math.max(min, Math.min(x, max));

/** @return {Number} */
export const lerp = (a, b, t) => (1 - t) * a + t * b;

/** @return {Number} */
export const inverseLerp = (a, b, v) => (v - a) / (b - a);

/** @return {Number} */
export const dot = (x0, y0, x1, y1) => x0 * x1 + y0 * y1;

/** @param {Number} p0x @param {Number} p1x  @param {Number} p1x  @param {Number} p1y */
export const distanceSq = (p0x, p0y, p1x, p1y) => {
	const pointsVecX = p1x - p0x;
	const pointsVecY = p1y - p0y;
	return pointsVecX * pointsVecX + pointsVecY * pointsVecY;
}
