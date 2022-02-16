function getStaminaPercentage(ns) {
  const res = ns.bladeburner.getStamina();
  return res[0] / res[1];
}

function canWork(ns) {
  return getStaminaPercentage(ns) > 0.5;
}

function shouldTrain(ns) {
  const res = ns.bladeburner.getStamina();
  return res[1] < 400;
}

function rest(ns) {
  if (shouldTrain(ns)) {
    ns.bladeburner.startAction("general", "Training");
    return ns.bladeburner.getActionTime("general", "Training");
  }
  ns.bladeburner.startAction("general", "Field Analysis");
  return ns.bladeburner.getActionTime("general", "Field Analysis");
}

const getChance = (type, name, ns) =>
  ns.bladeburner.getActionEstimatedSuccessChance(type, name);

function work(ns) {
  const contracts = ns.bladeburner.getContractNames();
  const operations = ns.bladeburner.getOperationNames();

  const bestContract = contracts
    .filter(contract => ns.bladeburner.getActionCountRemaining("contract", contract))
    .map(contract => {
      return {
        type: "contract",
        name: contract,
        chance: getChance("contract", contract, ns)
      };
    })
    .reduce((a, b) => (a.chance > b.chance ? a : b));

  const bestOp = operations
    .filter(operation => ns.bladeburner.getActionCountRemaining("operation", operation))
    .map(operation => {
      return {
        type: "operation",
        name: operation,
        chance: getChance("operation", operation, ns)
      };
    })
    .reduce((a, b) => (a.chance > b.chance ? a : b));

  // If chance is lower than 75% and we have more than 50 chaos, decrease chaos
  if (ns.bladeburner.getCityChaos(ns.bladeburner.getCity()) > 50 && bestOp.chance[0] < 0.75 && bestContract.chance[0] < 0.75) {
    ns.bladeburner.startAction("general", "Diplomacy");
    return ns.bladeburner.getActionTime("general", "Diplomacy");
  }

  if (bestOp.chance >= bestContract.chance) {
    ns.bladeburner.startAction(bestOp.type, bestOp.name);
    return ns.bladeburner.getActionTime(bestOp.type, bestOp.name);
  }
  ns.bladeburner.startAction(bestContract.type, bestContract.name);
  return ns.bladeburner.getActionTime(bestContract.type, bestContract.name);
}

function checkSkills(ns) {
  const skills = ns.bladeburner.getSkillNames().map(skill => {
    return {
      name: skill,
      level: ns.bladeburner.getSkillLevel(skill),
      cost: ns.bladeburner.getSkillUpgradeCost(skill)
    };
  }).sort((a, b) => a.cost - b.cost);
  var didUpgradeSkill = false;
  skills.forEach(skill => {
    if (
      skill.cost <= ns.bladeburner.getSkillPoints() &&
      // Overclock has max level of 90, prevent infinite recursion
      !(skill.name == "Overclock" && skill.level == 90)
    ) {
      ns.bladeburner.upgradeSkill(skill.name);
      didUpgradeSkill = true;
    }
  });
  if (ns.bladeburner.getSkillPoints() > 0 && didUpgradeSkill)
    checkSkills(ns);
}

const getBonusTimeMultiplier = (ns) =>
  ns.bladeburner.getBonusTime() > 10 ? 5 : 1;

function blackops(ns) {
  var blackops = ns.bladeburner.getBlackOpNames();
  for (const blackop of blackops) {
    if (ns.bladeburner.getActionCountRemaining("BlackOps", blackop)) {
      if (
        ns.bladeburner.getBlackOpRank(blackop) <= ns.bladeburner.getRank() &&
        ns.bladeburner.getActionEstimatedSuccessChance("BlackOps", blackop)[0] >= 0.75
      ) {
        ns.bladeburner.startAction("BlackOps", blackop);
        return ns.bladeburner.getActionTime("BlackOps", blackop);
      } else {
        break
      }
    }
  }

  return false
}

export async function main(ns) {
  // Set max autolevel of everything.
  const contracts = ns.bladeburner.getContractNames();
  const operations = ns.bladeburner.getOperationNames();
  contracts.forEach(contract =>
    ns.bladeburner.setActionAutolevel("contract", contract, true)
  );
  operations.forEach(operation =>
    ns.bladeburner.setActionAutolevel("operation", operation, true)
  );

  // Main loop
  while (true) {
    var sleepTime = canWork(ns) ? work(ns) : rest(ns);
    await ns.sleep(sleepTime / getBonusTimeMultiplier(ns));
    checkSkills(ns);
    sleepTime = blackops(ns);
    if (sleepTime)
      await ns.sleep(sleepTime / getBonusTimeMultiplier(ns));
  }
}
