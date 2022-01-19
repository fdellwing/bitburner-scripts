/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    if (args.help) {
        ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    const hook0 = eval("document.getElementById('overview-extra-hook-0')");
    const hook1 = eval("document.getElementById('overview-extra-hook-1')");
    while (true) {
        try {
            const headers = []
            const values = [];
            // Add script income per second
            headers.push("ScrInc");
            var income = ns.getScriptIncome()[0];
            var incomeSuffix = '';
            while (income / 1000 > 1) {
                incomeSuffix += 'k';
                income /= 1000;
            }
            values.push(income.toFixed(2) + incomeSuffix + '/sec');
            // Add script exp gain rate per second
            headers.push("ScrExp");
            var exp = ns.getScriptExpGain();
            var expSuffix = '';
            while (exp / 1000 > 1) {
                expSuffix += 'k';
                exp /= 1000;
            }
            values.push(exp.toFixed(2) + expSuffix + '/sec');
            headers.push("Shares");
            values.push('x' + ns.getSharePower().toFixed(2));
            // TODO: Add more neat stuff

            // Now drop it into the placeholder elements
            hook0.innerText = headers.join(" \n");
            hook1.innerText = values.join("\n");
        } catch (err) { // This might come in handy later
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(1000);
    }
}
