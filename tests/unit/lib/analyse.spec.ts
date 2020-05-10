import { detectType, analyse } from '../../../src/lib/analyse'

describe('detectType', () => {
  it('Detects expected types', () => {
    const assertions = [
      ['', 'null'],
      ['1990-01-01', 'date'],
      ['1990-01-2', 'string'],
      ['1/1/1990', 'string'],
      ['2020-05-03T12:17:48Z', 'datetime'],
      ['100.50', 'number'],
      ['123', 'number'],
      ['true', 'boolean'],
      ['1', 'boolean'],
      ['0', 'boolean'],
      ['yes', 'boolean']
    ]
    assertions.forEach(([input, output]) => {
      expect(detectType(input)).toBe(output)
    })
  })
})

describe('analyse', () => {
  it('Returns state object', () => {
    const row = { name: 'John Doe', age: '30' }
    const state = {}
    const expected = {
      name: { string: 1 },
      age: { number: 1 }
    }
    expect(analyse(state, row)).toEqual(expected)
  })

  it("Increments the state it's passed", () => {
    const row = { name: 'John Doe', age: '30' }
    const state = {
      name: { string: 2 },
      age: { number: 2 }
    }
    const expected = {
      name: { string: 3 },
      age: { number: 3 }
    }
    expect(analyse(state, row)).toEqual(expected)
  })

  it('Reduces', () => {
    const rows = [
      { name: 'John Doe', age: '30' },
      { name: 'Jane Doe', age: '31' }
    ]
    const expected = {
      name: { string: 2 },
      age: { number: 2 }
    }
    const result = rows.reduce(analyse, {})
    expect(result).toEqual(expected)
  })

  it('Lists multiple types', () => {
    const rows = [
      { name: 'John Doe', age: '30' },
      { name: 'John Doe', age: 'thirty' },
      { name: 'John Doe', age: '' }
    ]
    const expected = {
      name: { string: 3 },
      age: { string: 1, null: 1, number: 1 }
    }
    const result = rows.reduce(analyse, {})
    expect(result).toEqual(expected)
  })

  it.skip("Doesn't mutate the state", () => {
    const row = { name: 'John Doe', age: '30' }
    const state = { name: { string: 1 } }
    analyse(state, row)
    expect(state).toEqual({ name: { string: 1 } })
  })
})
