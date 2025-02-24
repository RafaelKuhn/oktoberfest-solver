
/**
 * @param {Array.<Number>} seedHash
 * @returns {Function}
 */
export const getSeededRandomGenerator = seed => {
	const seedHash = cyrb128BitHash(seed);
	return sfc32(seedHash[0], seedHash[1], seedHash[2], seedHash[3])
}


/**
 * @param {String} seed
 * @returns {Array.<Number>}
 */
const cyrb128BitHash = seed => {
	let h1 = 1779033703, h2 = 3144134277,
			h3 = 1013904242, h4 = 2773480762;
	for (let i = 0, k; i < seed.length; i++) {
			k = seed.charCodeAt(i);
			h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
			h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
			h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
			h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
	}
	h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
	h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
	h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
	h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
	h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;

	return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
}

/**
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 * @returns {Function}
 */
const sfc32 = (a, b, c, d) => {
  return function() {
    a |= 0; b |= 0; c |= 0; d |= 0;
    let t = (a + b | 0) + d | 0;
    d = d + 1 | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}
