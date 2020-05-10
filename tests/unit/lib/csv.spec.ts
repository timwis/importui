import fs from 'fs'
import { basename } from 'path'

import { getPreview, upload } from '@/lib/csv'

const USERS_FILE = 'tests/fixtures/users.csv'

describe('getPreview', () => {
  it('counts the rows', async () => {
    const file = createHTML5File(USERS_FILE)
    const { count } = await getPreview(file, 5)
    expect(count).toBe(30)
  })

  it('gets sample rows', async () => {
    const file = createHTML5File(USERS_FILE)
    const { sampleRows } = await getPreview(file, 5)
    expect(sampleRows.length).toBe(5)
    expect(sampleRows[0]).toHaveProperty('first_name')
  })

  it('gets the header', async () => {
    const file = createHTML5File(USERS_FILE)
    const { header } = await getPreview(file)
    expect(header.length).toBe(5)
  })
})

describe('upload', () => {
  it('maps the header', async () => {
    const file = createHTML5File(USERS_FILE)
    const header = ['id', 'firstName', 'lastName', 'email', 'years_old']
    await upload({
      file,
      header,
      uploadFn: async (data) => {
        const keys = Object.keys(data)
        expect(keys).toMatchObject(header)
      }
    })
  })

  it('uploads all rows', async () => {
    const file = createHTML5File(USERS_FILE)
    let count = 0
    await upload({
      file,
      uploadFn: async (_data) => { count++ }
    })
    expect(count).toBe(30)
  })

  it('delays by specified interval', async () => {
    const file = createHTML5File(USERS_FILE)
    let shouldBeDelaying = false
    await upload({
      file,
      delayMs: 100,
      uploadFn: async (_data) => {
        expect(shouldBeDelaying).toBe(false)
        shouldBeDelaying = true
        setTimeout(() => { shouldBeDelaying = false }, 100)
      }
    })
  })
})

function createHTML5File (filePath: string): File {
  const body = fs.readFileSync(filePath).toString()
  const type = 'text/csv'
  const blob = new Blob([body], { type }) as any
  blob.name = basename(filePath)
  blob.lastModifiedDate = new Date()
  return blob as File
}
