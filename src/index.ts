const fs = require('fs')
const path = require('path')
const figlet = require('figlet')
const { Command } = require('commander')

const program = new Command()

console.log(figlet.textSync('Dir Manager'))

program
  .version('1.0.0')
  .description('An example of a simple CLI')
  .option('-l, --ls [value]', "list directory content")
  .option('-t, --touch <value>', 'create new empty file')
  .option('-m, --mkdir <value>', 'create new empty directory')
  .parse(process.argv)

async function listDirContents(filePath: string) {
  try {
    const files = await fs.promises.readdir(filePath)
    const detailedFilePromises = files.map(async (file: string) => {
      const fileDetails = await fs.promises.lstat(path.resolve(filePath, file))
      const {size, birthtime } = fileDetails
      return {
        filename: file, "size(KB)": size, createdAt: birthtime
      }
    })

    const detailedFiles = await Promise.all(detailedFilePromises)
    console.table(detailedFiles)
    
  } catch (error) {
    console.error("Error occurred while reading the directory!", error)
    
  }
}

function createDir(filePath: string) {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath)
    console.log("The directory has been created successfully")
  }
}

function createFile(filePath: string) {
  fs.openSync(filePath, "w");
  console.log("An empty file has been created");
}

const options = program.opts()

if (options.ls) {
  const filePath = typeof options.ls === 'string' ? options.ls : __dirname
  listDirContents(filePath)
}
if (options.mkdir) {
  createDir(path.resolve(__dirname, options.mkdir));
}
if (options.touch) {
  createFile(path.resolve(__dirname, options.touch));
}