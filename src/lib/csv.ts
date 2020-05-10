// @ts-ignore
import fileReaderStream from 'filereader-stream'
import csv from 'csv-parser'
import delay from 'delay'
import { curry } from 'lodash'
import { write, tap, reduce, pipe } from 'bluestream'

interface PreviewResult {
  count: number,
  sampleRows: object[],
  header: string[]
}

export async function getPreview (file: File, numRows = 0): Promise<PreviewResult> {
  const initial = {
    count: 0,
    sampleRows: [],
    header: []
  }

  return pipe(
    fileReaderStream(file),
    csv(),
    reduce(analyse(numRows), initial)
  )
}

interface UploadOptions {
  file: File,
  header?: string[],
  delayMs?: number,
  uploadFn: (data: object) => Promise<void>
}

export async function upload ({
  file,
  header,
  delayMs,
  uploadFn
}: UploadOptions): Promise<void> {
  const csvOpts = header ? { headers: header, skipLines: 1 } : {}

  return pipe(
    fileReaderStream(file),
    csv(csvOpts),
    tap(() => delayMs && delay(delayMs)),
    write(uploadFn)
  )
}

const analyse = curry((numRows: number, accum: PreviewResult, row: object) => {
  accum.count++
  if (accum.sampleRows.length < numRows) accum.sampleRows.push(row)
  if (accum.header.length === 0) accum.header = Object.keys(row)
  return accum
})
