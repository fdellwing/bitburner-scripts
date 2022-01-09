import {list_servers} from "functions.js"

/** @param {NS} ns **/
export async function main(ns) {
    const hacking_level = ns.getHackingLevel();
    var openers = 0;
    const programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];

    for (const program of programs) {
        if (ns.fileExists(program)) openers++;
    }

    const servers = list_servers(ns).filter(
        s => !ns.hasRootAccess(s)
    ).filter(
        s => ns.getServerRequiredHackingLevel(s) <= hacking_level
    ).filter(
        s => ns.getServerNumPortsRequired(s) <= openers
    );

    for (const server of servers) {
        switch (openers) {
            case 5:
                ns.sqlinject(server);
            case 4:
                ns.httpworm(server);
            case 3:
                ns.relaysmtp(server);
            case 2:
                ns.ftpcrack(server);
            case 1:
                ns.brutessh(server);
        }
        ns.nuke(server);
        ns.tprint(`Pwned new server: ${server}`);
    }
}
