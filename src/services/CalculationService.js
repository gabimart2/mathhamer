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

function calculateAnalytics (attacker, defender) {
  return null
}

function calculateSimulation (attacker, defender, iterations = 100000) {
  return null
}

function calculate (attacker, defender) {
  const parsedAttacker = parseAttacker(attacker)
  const parsedDefender = parseDefender(defender)
  console.log('Attacker: ', parsedAttacker)
  console.log('Defender: ', parsedDefender)
  return {
    analytics: calculateAnalytics(parsedAttacker, parsedDefender),
    simulation: calculateSimulation(parsedAttacker, parsedDefender, 100000)
  }
}

const CalculationService = {
  calculate
}

export default CalculationService
