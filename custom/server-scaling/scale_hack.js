export async function main(ns) {
    //const hostname = "phantasy";
    const hostname = "rho-construction";

    var stagger = Math.floor(10000 + (Math.random() * 1000) * 100);
    ns.print(`Waiting ${stagger}ms before starting..`);
    await ns.sleep(stagger);

    while (true) {
        if (ns.getServerSecurityLevel(hostname) > ns.getServerMinSecurityLevel(hostname) + 5) {
            await ns.weaken(hostname);
        } else if (ns.getServerMoneyAvailable(hostname) < ns.getServerMaxMoney(hostname) * 0.75) {
            await ns.grow(hostname);
        } else {
            await ns.hack(hostname);
        }
    }
}
