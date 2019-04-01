const { transformer, PROBABLY_NATIVE_TAGS } = require('./can-migrate-script')
const yargs = require('yargs').usage('Usage: $0 ...paths').argv
const fs = require('fs')

function main() {
  let paths = yargs._
  let readFilesCount = 0
  paths.forEach((filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      readFilesCount++
      if (err) throw err
      const transformedData = transformer({source: data, path: filePath}, false)
      if (readFilesCount === paths.length) {
        // like Promise.all
        if (PROBABLY_NATIVE_TAGS.length) {
          console.warn('not sure everything worked fine')
          console.warn('if you see in the array below native tags:')
          console.warn('1. Discard all changes introduced by this script run')
          console.warn('2. Add those native tags to NATIVE_ELEMENT_TAGS in isPropOfNativeElement function')
          console.warn('3. Rerun the script')
          console.warn('Here this array:')
          console.log(PROBABLY_NATIVE_TAGS)
          console.log('If there are only custom tags you can do nothing and just proceed, everything worked fine then')
        }
      }

      if (transformedData !== data)
        fs.writeFile(filePath, transformedData, (err) => {
          if (err) throw err
          console.log(`wrote ${filePath}`)
        })
    });
  })
}

main()
