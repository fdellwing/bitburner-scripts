export async function main(ns) {
    const hostname = "phantasy";

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
