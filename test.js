const {parseStream} = require('./lib/cjs')
const fs = require('fs')
const path = require('path')

async function main() {
    const fileStream = fs.createReadStream(path.join(__dirname, './test/admin.txt'), { encoding: 'utf8' })
    const output = await parseStream(fileStream)
}

main()