

let globalTimeoutHandle;
const sleep = ms => new Promise(r => {
	globalTimeoutHandle = setTimeout(r, ms);
});