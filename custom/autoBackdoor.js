/** @param {NS} ns **/
export async function main(ns) {
	let servers = ["home"],
		routes = { home: ["home"] };
	// Scan all servers and keep track of the path to get to them
	ns.disableLog("scan");
	for (let i = 0, j; i < servers.length; i++)
		for (j of ns.scan(servers[i]))
			if (!servers.includes(j)) servers.push(j), routes[j] = routes[servers[i]].slice(), routes[j].push(j);
	// Filter out servers that cannot or should not be hacked / backdoored
	let toBackdoor = servers.filter(s => s != "home" && !s.includes("auto_serv") && ns.hasRootAccess(s) && !ns.getServer(s).backdoorInstalled);

	for (const server of toBackdoor) {
		for (let hop of routes[server])
			ns.connect(hop);
		if (server === "w0r1d_d43m0n") {
			ns.alert("Ready to hack w0r1d_d43m0n!");
			while (true) await ns.sleep(10000); // Sleep forever so the script isn't run multiple times to create multiple overlapping alerts
		}
		// Install backdoor
		if (await ns.installBackdoor()) {
			ns.tprint(`Backdoor on ${server} failed, try again later...`);
		}
		ns.connect("home");
	}	
}
