const transformer = require('./can-migrate-script')
const yargs = require('yargs').usage('Usage: $0 ...paths').argv
const fs = require('fs')

function main() {
  let paths = yargs._
  paths.forEach((filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) throw err
      const transformedData = transformer({source: data, path: filePath}, false)
      if (transformedData !== data)
        fs.writeFile(filePath, transformedData, (err) => {
          if (err) throw err
          console.log(`wrote ${filePath}`)
        })
    });
  })
}

main()
