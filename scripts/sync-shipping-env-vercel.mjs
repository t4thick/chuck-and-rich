/**
 * Push shipping label env to Vercel Production (lovely-queen-market).
 * Prereq: npx vercel login && npx vercel link --project lovely-queen-market
 *
 *   node scripts/sync-shipping-env-vercel.mjs
 */

import { spawnSync } from 'node:child_process'

const VARS = {
  SHIP_LABEL_MODE: 'quick',
  SHIP_PREFERRED_CARRIER: 'UPS',
  SHIP_PREFERRED_UPS_SERVICE: 'Ground',
  SHIP_PREFERRED_USPS_SERVICE: 'Ground Advantage',
  SHIP_FROM_NAME: 'Lovely Queen African Market',
  SHIP_FROM_STREET1: '1668 E Dublin Granville Rd',
  SHIP_FROM_CITY: 'Columbus',
  SHIP_FROM_STATE: 'OH',
  SHIP_FROM_ZIP: '43229',
  SHIP_FROM_COUNTRY: 'US',
  SHIP_FROM_PHONE: '6144460893',
  SHIP_FROM_EMAIL: 'kkras5050@gmail.com',
  SHIP_DEFAULT_WEIGHT_LB: '3',
  SHIP_DEFAULT_LENGTH_IN: '12',
  SHIP_DEFAULT_WIDTH_IN: '10',
  SHIP_DEFAULT_HEIGHT_IN: '8',
}

function addEnv(name, value, environment) {
  const r = spawnSync(
    'npx',
    ['--yes', 'vercel@latest', 'env', 'add', name, environment, '--force'],
    { input: value, encoding: 'utf8', stdio: ['pipe', 'inherit', 'inherit'], shell: true }
  )
  return r.status === 0
}

let ok = 0
for (const [name, value] of Object.entries(VARS)) {
  process.stdout.write(`Setting ${name}… `)
  if (addEnv(name, value, 'production')) {
    ok++
    console.log('ok')
  } else {
    console.log('FAILED')
  }
}

console.log(`\nDone: ${ok}/${Object.keys(VARS).length} variables on Vercel Production.`)
