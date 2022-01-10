/** @param {NS} ns **/
export async function main(ns) {
	const args = ns.flags([]);
	var script = "scale_hack.js";
	var server = args._[0];
	var threads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(script));
	if (threads === 0) return;
	await ns.scp(script, ns.getHostname(), server);
	var anti_stale = Math.floor(threads / 1000);
	for (let i = 0; i < anti_stale; i++) {
		ns.tprint(`Running '${script}' on '${server}' with 1000 threads...`);
		ns.exec(script, server, 1000, i);
	}
	var threads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(script));
	if (threads === 0) return;
	ns.tprint(`Running '${script}' on '${server}' with ${threads} threads...`);
	ns.exec(script, server, threads);
}
