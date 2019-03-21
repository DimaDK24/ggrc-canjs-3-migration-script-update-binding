const transformer = require('./can-migrate-script')
const yargs = require('yargs').usage('Usage: $0 ...paths').argv

function main() {
  let paths = yargs._
  console.log(paths);
}

main()