"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require('fs');
const path = require('path');
const figlet = require('figlet');
const { Command } = require('commander');
const program = new Command();
console.log(figlet.textSync('Dir Manager'));
program
    .version('1.0.0')
    .description('An example of a simple CLI')
    .option('-l, --ls [value]', "list directory content")
    .option('-t, --touch <value>', 'create new empty file')
    .option('-m, --mkdir <value>', 'create new empty directory')
    .parse(process.argv);
function listDirContents(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield fs.promises.readdir(filePath);
            const detailedFilePromises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                const fileDetails = yield fs.promises.lstat(path.resolve(filePath, file));
                const { size, birthtime } = fileDetails;
                return {
                    filename: file, "size(KB)": size, createdAt: birthtime
                };
            }));
            const detailedFiles = yield Promise.all(detailedFilePromises);
            console.table(detailedFiles);
        }
        catch (error) {
            console.error("Error occurred while reading the directory!", error);
        }
    });
}
function createDir(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
        console.log("The directory has been created successfully");
    }
}
function createFile(filePath) {
    fs.openSync(filePath, "w");
    console.log("An empty file has been created");
}
const options = program.opts();
if (options.ls) {
    const filePath = typeof options.ls === 'string' ? options.ls : __dirname;
    listDirContents(filePath);
}
if (options.mkdir) {
    createDir(path.resolve(__dirname, options.mkdir));
}
if (options.touch) {
    createFile(path.resolve(__dirname, options.touch));
}
//# sourceMappingURL=index.js.map