// @ts-ignore
import fileReaderStream from 'filereader-stream'
import csv from 'csv-parser'
import { curry } from 'lodash'
import H from 'highland'

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

  return H(fileReaderStream(file))
    .through(csv())
    .reduce(initial, analyse(numRows))
    .toPromise(Promise)
}

interface UploadOptions {
  file: File,
  header?: string[],
  delay?: number,
  uploadFn: (data: object) => Promise<void>,
  onProgress?: (data: void) => void
}

export async function upload ({
  file,
  header,
  delay = 0,
  uploadFn,
  onProgress = () => {}
}: UploadOptions): Promise<void> {
  const csvOpts = header ? { headers: header, skipLines: 1 } : {}

  return new Promise((resolve, reject) => {
    H(fileReaderStream(file))
      .through(csv(csvOpts))
      .ratelimit(1, delay)
      .flatMap((row: any) => H(uploadFn(row)))
      .tap(onProgress)
      .stopOnError(reject)
      .done(resolve)
  })
}

const analyse = curry((numRows: number, accum: PreviewResult, row: object) => {
  accum.count++
  if (accum.sampleRows.length < numRows) accum.sampleRows.push(row)
  if (accum.header.length === 0) accum.header = Object.keys(row)
  return accum
})
