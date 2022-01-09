/** @param {NS} ns **/
export async function main(ns) {
	const args = ns.flags([["help", false]]);
	var script = "scale_hack.js";
	var server = args._[0];
	var threads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(script));
	if (threads === 0) return;
	ns.tprint(`Running '${script}' on '${server}' with ${threads} threads...`);
	await ns.scp(script, ns.getHostname(), server);
	ns.exec(script, server, threads);
}
