/**
 * Indicates whether a value is dice notation
 * @param {string} value — String with the value
 * @returns {boolean}
 */
function isDiceNotation (value) {
  if (typeof value !== 'string') return false
  // Quitamos espacios al inicio y final
  const str = value.trim()
  // Regex: opcionalmente un número de dados, 'd' o 'D', número de caras, y opcionalmente un modificador +Z o -Z
  const diceRegex = /^(\d*)[dD](\d+)([+-]\d+)?$/
  return diceRegex.test(str)
}

/**
 * Parses a dice notation string (e.g. "2D6+1", "1d3", "3D6")
 * @param {string} notation — String with the dice notation.
 * @returns {{ numDice: number, diceSides: number, modifier: number }}
 * @throws {Error} If the notation is invalid.
 */
function parseDiceNotation (notation) {
  // Regex: opcionalmente un número, seguido de 'd' o 'D', luego un número,
  // luego opcionalmente (+ o -) y otro número.
  const regex = /^(\d*)[dD](\d+)([+-]\d+)?$/
  const match = notation.trim().match(regex)
  if (!match) {
    throw new Error(`Notación inválida: "${notation}"`)
  }

  // match[1]: cantidad de dados (puede estar vacío)
  // match[2]: caras del dado
  // match[3]: modificador (incluye signo) o undefined
  const count = match[1] === '' ? 1 : parseInt(match[1], 10)
  const sides = parseInt(match[2], 10)
  const modifier = match[3] ? parseInt(match[3], 10) : 0

  return { count, sides, modifier }
}

/**
 * Parses attacker data
 * @param {object} attacker — atacker profile and number of miniatures in strings
 * @returns {object}
 */
function parseAttacker (attacker) {
  return {
    numModels: parseInt(attacker.numModels, 10),
    profile: {
      attacks: {
        random: isDiceNotation(attacker.profile.attacks),
        value: isDiceNotation(attacker.profile.attacks)
          ? parseDiceNotation(attacker.profile.attacks)
          : parseInt(attacker.profile.attacks, 10)
      },
      skill: attacker.profile.skill !== 'N/A'
        ? parseInt(attacker.profile.skill, 10)
        : 1,
      strength: parseInt(attacker.profile.strength, 10),
      armorPen: parseInt(attacker.profile.armorPen, 10),
      damage: {
        random: isDiceNotation(attacker.profile.damage),
        value: isDiceNotation(attacker.profile.damage)
          ? parseDiceNotation(attacker.profile.damage)
          : parseInt(attacker.profile.damage, 10)
      }
    }
  }
}

/**
 * Parses defender data
 * @param {object} defender — atacker profile and number of miniatures in strings
 * @returns {object}
 */
function parseDefender (defender) {
  return {
    numModels: parseInt(defender.numModels, 10),
    profile: {
      toughness: parseInt(defender.profile.toughness, 10),
      save: parseInt(defender.profile.save, 10),
      invulnerableSave: defender.profile.invulnerableSave !== 'N/A'
        ? parseInt(defender.profile.invulnerableSave, 10)
        : 7,
      fellNoPain: defender.profile.fellNoPain !== 'N/A'
        ? parseInt(defender.profile.fellNoPain, 10)
        : 7,
      wounds: parseInt(defender.profile.wounds, 10)
    }
  }
}

function calculate (attacker, defender) {
  const parsedAttacker = parseAttacker(attacker)
  const parsedDefender = parseDefender(defender)
  console.log('Attacker: ', parsedAttacker)
  console.log('Defender: ', parsedDefender)
  return {
    analytics: computeAnalytical(parsedAttacker, parsedDefender),
    simulation: simulateMonteCarlo(parsedAttacker, parsedDefender, 100000)
  }
}

function rollDice (count, sides, modifier = 0) {
  let total = 0
  for (let i = 0; i < count; i++) total += Math.floor(Math.random() * sides) + 1
  return total + modifier
}

function computeEffectiveSave (defProfile, armorPen) {
  const { save, invulnerableSave } = defProfile
  const adjustedArmor = save + armorPen
  const pArmor = adjustedArmor <= 6 ? (7 - adjustedArmor) / 6 : 0
  const pInvul = invulnerableSave <= 6 ? (7 - invulnerableSave) / 6 : 0
  const pSave = Math.max(pArmor, pInvul)
  return { pSave, pFail: 1 - pSave }
}

// Error function approximation
function erf (x) {
  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  const t = 1 / (1 + p * x)
  const y = 1 - ((((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x)
  return sign * y
}

function phi (z) {
  return 0.5 * (1 + erf(z / Math.sqrt(2)))
}

function computeAnalytical (attacker, defender) {
  const { numModels, profile } = attacker
  const { attacks, skill, strength, armorPen, damage } = profile
  const { numModels: defModels, profile: defProf } = defender
  const { toughness, wounds, fellNoPain } = defProf

  // Attacks
  let muAtt = 0
  let varAtt = 0
  if (attacks.random) {
    const { count, sides, modifier = 0 } = attacks.value
    const muModel = count * (sides + 1) / 2 + modifier
    const varModel = count * ((sides ** 2 - 1) / 12)
    muAtt = muModel * numModels
    varAtt = varModel * numModels
  } else {
    muAtt = attacks.value * numModels
    varAtt = 0
  }
  const pHit = Math.max(0, Math.min(1, (7 - skill) / 6))

  // Wounds
  let woundTarget
  if (strength >= 2 * toughness) woundTarget = 2
  else if (strength > toughness) woundTarget = 3
  else if (strength === toughness) woundTarget = 4
  else if (strength * 2 <= toughness) woundTarget = 6
  else woundTarget = 5
  const pWound = (7 - woundTarget) / 6

  // Saves
  const { pFail: pFailSave } = computeEffectiveSave(defProf, armorPen)

  // FNP fail prob
  const pFailFNP = fellNoPain <= 6 ? (fellNoPain - 1) / 6 : 1

  // Analytical chain
  const muH = muAtt * pHit
  const varH = muAtt * pHit * (1 - pHit) + varAtt * pHit ** 2
  const sigmaH = Math.sqrt(varH)

  const muW = muH * pWound
  const varW = pWound ** 2 * varH + pWound * (1 - pWound) * muH
  const sigmaW = Math.sqrt(varW)

  const muU = muW * pFailSave
  const varU = pFailSave ** 2 * varW + pFailSave * (1 - pFailSave) * muW
  const sigmaU = Math.sqrt(varU)

  // Damage before FNP
  let muDmg = 0
  let varDmg = 0
  if (damage.random) {
    const { count, sides } = damage.value
    muDmg = count * (sides + 1) / 2
    varDmg = count * ((sides ** 2 - 1) / 12)
  } else {
    muDmg = damage.value
    varDmg = 0
  }
  const muDmgTotal = muU * muDmg
  const varDmgTotal = muU * varDmg + varU * muDmg ** 2
  const sigmaDmgTotal = Math.sqrt(varDmgTotal)

  // After FNP
  const muAfterFNP = muDmgTotal * pFailFNP
  const varAfterFNP =
    muDmgTotal * pFailFNP * (1 - pFailFNP) + varDmgTotal * pFailFNP ** 2
  const sigmaAfterFNP = Math.sqrt(varAfterFNP)

  // Kills
  const muKills = muAfterFNP / wounds
  const sigmaKills = sigmaAfterFNP / wounds

  // Distribution of kills (approx discrete normal)
  const killsDistribution = {}
  if (sigmaKills > 0) {
    for (let k = 0; k <= defModels; k++) {
      const lower = (k - 0.5 - muKills) / sigmaKills
      const upper = (k + 0.5 - muKills) / sigmaKills
      killsDistribution[k] = phi(upper) - phi(lower)
    }
  } else {
    const k = Math.round(muKills)
    killsDistribution[k] = 1
  }

  return {
    attacks: { mean: muAtt, sigma: Math.sqrt(varAtt) },
    impacts: { mean: muH, sigma: sigmaH },
    wounds: { mean: muW, sigma: sigmaW },
    unsaved: { mean: muU, sigma: sigmaU },
    damageBeforeFNP: { mean: muDmgTotal, sigma: sigmaDmgTotal },
    damageAfterFNP: { mean: muAfterFNP, sigma: sigmaAfterFNP },
    kills: { mean: muKills, sigma: sigmaKills },
    killsDistribution
  }
}

function simulateMonteCarlo (attacker, defender, simRuns = 10000) {
  const results = {
    attacks: [],
    impacts: [],
    wounds: [],
    unsaved: [],
    damageBeforeFNP: [],
    damageAfterFNP: [],
    wasted: [],
    kills: []
  }
  const { numModels, profile } = attacker
  const { attacks, skill, strength, armorPen, damage } = profile
  const defProf = defender.profile

  const pHit = Math.max(0, Math.min(1, (7 - skill) / 6))
  let woundTarget
  if (strength >= 2 * defProf.toughness) woundTarget = 2
  else if (strength > defProf.toughness) woundTarget = 3
  else if (strength === defProf.toughness) woundTarget = 4
  else if (strength * 2 <= defProf.toughness) woundTarget = 6
  else woundTarget = 5
  const pWound = (7 - woundTarget) / 6
  const { pFail: pFailSave } = computeEffectiveSave(defProf, armorPen)
  const pFailFNP = defProf.fellNoPain <= 6 ? (defProf.fellNoPain - 1) / 6 : 1

  for (let i = 0; i < simRuns; i++) {
    // Determine number of attacks
    let totalAttacks = 0
    if (attacks.random) {
      for (let m = 0; m < numModels; m++) {
        totalAttacks += rollDice(
          attacks.value.count,
          attacks.value.sides,
          attacks.value.modifier || 0
        )
      }
    } else {
      totalAttacks = attacks.value * numModels
    }

    let hits = 0
    let woundsCount = 0
    let unsaved = 0
    let dmgRoll = 0
    let afterFNP = 0
    let wasted = 0
    let kills = 0
    let remHP = defProf.wounds

    for (let atk = 0; atk < totalAttacks; atk++) {
      if (Math.random() > pHit) continue
      hits++
      if (Math.random() > pWound) continue
      woundsCount++
      if (Math.random() > pFailSave) continue
      unsaved++
      const roll = damage.random
        ? rollDice(damage.value.count, damage.value.sides)
        : damage.value
      dmgRoll += roll
      let passed = 0
      for (let d = 0; d < roll; d++) {
        if (Math.random() < pFailFNP) passed++
      }
      afterFNP += passed
      if (passed > 0) {
        let dmgLeft = passed
        // Apply damage across multiple models correctly
        while (dmgLeft > 0 && kills < defender.numModels) {
          if (dmgLeft >= remHP) {
            dmgLeft -= remHP
            kills++
            remHP = defProf.wounds
          } else {
            remHP -= dmgLeft
            dmgLeft = 0
          }
        }
        // Any remaining damage after all models dead is wasted
        if (dmgLeft > 0) {
          wasted += dmgLeft
        }
      }
    }

    results.attacks.push(totalAttacks)
    results.impacts.push(hits)
    results.wounds.push(woundsCount)
    results.unsaved.push(unsaved)
    results.damageBeforeFNP.push(dmgRoll)
    results.damageAfterFNP.push(afterFNP)
    results.wasted.push(wasted)
    results.kills.push(kills)
  }

  const summary = {}
  for (const key in results) {
    const arr = results[key]
    const mean = arr.reduce((a, v) => a + v, 0) / arr.length
    const varr = arr.reduce((a, v) => a + (v - mean) ** 2, 0) / arr.length
    summary[key] = { mean, sigma: Math.sqrt(varr) }
  }
  // Empirical kills distribution
  const dist = {}
  for (let k = 0; k <= defender.numModels; k++) dist[k] = 0
  results.kills.forEach(k => {
    const capped = Math.min(k, defender.numModels)
    dist[capped] = (dist[capped] || 0) + 1
  })
  for (const k in dist) dist[k] /= simRuns
  summary.killsDistribution = dist

  return summary
}


const CalculationService = {
  calculate
}

export default CalculationService
