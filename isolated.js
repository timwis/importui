const pump = require('pump')
const through2 = require('through2')
const to = require('flush-write-stream')
const csv = require('csv-parser')
const fs = require('fs')

let count = 0

pump(
  fs.createReadStream('users.csv'),
  csv(),
  through2.obj((data, _enc, cb) => {
    count++
    console.log('row', count)
    cb(null, data)
  }),
  to.obj((_data, _enc, cb) => {
    cb()
  }),
  () => {
    console.log('done')
  }
)
// .on('data', () => {}) // when this line is commented, only 16 lines are processed
