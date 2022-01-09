import {list_servers} from "functions.js"

export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    if (args.help || args._.length < 1) {
        ns.tprint("This script will generate money by hacking a target server from all rooted servers (+ home).");
        ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} joesguns`);
        return;
    }
    const host = args._[0];
    const script = "basic_hack.js";
    const servers = list_servers(ns).filter(s => ns.hasRootAccess(s)).filter(s => !s.startsWith("auto_serv")).concat(['home']);
    for (const server of servers) {
        ns.scriptKill(script, server);
        var threads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(script));
        if (threads === 0) continue;
        if (server === "home") threads = threads / 2;
        ns.tprint(`Attacking '${host}' from '${server}' with ${threads} threads...`);
        await ns.scp(script, ns.getHostname(), server);
        ns.exec(script, server, threads, host);
    }
}
