
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
