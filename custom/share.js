/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("share");
	const args = ns.flags([]);
	var autostart = args._[0];

	// Very ugly method to save RAM while keeping the whole logic in a single file
	eval(`
	if (!autostart) {
		var threads = Math.floor((ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - 100) / ns.getScriptRam(ns.getScriptName()));
		if (threads > 0) {
			ns.run("share.js", threads, true);
		} else {
			autostart = true;
		}
	}
	`);

	if (!autostart) return

	while (true) {
		await ns.share();
	}
}
