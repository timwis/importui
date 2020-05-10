import _ from 'lodash'
import { isValid, parseISO } from 'date-fns'

// Mutates state for performance
export function analyse (state: any, row: any) {
  return Object.entries(row)
    .reduce((accum, [key, value]) => {
      const type = detectType(value as string)
      accum[key] = accum[key] || {}
      accum[key][type] = (accum[key][type] + 1) || 1
      return accum
    }, state)
}

export const detectType: (value: string) => string = _.cond([
  [isEmptyString, _.constant('null')],
  [isISODate, _.constant('date')],
  [isISODateTime, _.constant('datetime')],
  [isBoolean, _.constant('boolean')], // can also be numeric
  [isNumeric, _.constant('number')],
  [_.stubTrue, _.constant('string')]
])

function isEmptyString (value: string) {
  return value === ''
}

function isISODate (value: string) {
  return value.includes('-') && isValid(parseISO(value)) &&
         value.length === 10
}

function isISODateTime (value: string) {
  return value.includes('-') && isValid(parseISO(value)) &&
         value.length > 10
}

function isNumeric (value: string) {
  return !isNaN(parseFloat(value)) && isFinite(+value)
}

function isBoolean (value: string) {
  return ['0', '1', 'true', 'false', 'yes', 'no'].includes(value.toLowerCase())
}
