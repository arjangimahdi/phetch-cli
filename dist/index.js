#! /usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const pj = require('./../package.json');
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const figlet = require("figlet");
const { exec } = require('child_process');
const program = new Command();
console.log(figlet.textSync("PHETCH-CLI"));
const patterns = [
    {
        name: 'Transform',
        extension: 'ts',
        type: 't',
        content: `
        export function [name]Transform(data: [input]) {
            // transformed data
        }
        `
    },
    {
        name: 'Interface',
        extension: 'ts',
        type: 'i',
        content: `
        export interface [name]Interface {
            // interface props
        }
        `
    },
    {
        name: 'Api',
        extension: 'ts',
        type: 'a',
        content: `
        import { $fetch, type FetchOptions } from 'ofetch'
        
        interface IApiInstance { }
        
        export default defineNuxtPlugin((nuxtApp) => {
            const config = useRuntimeConfig()
            const fetchOptions: FetchOptions = {
                baseURL: 'BASE URL',
            }
            const apiFetcher = $fetch.create(fetchOptions)
            const modules: IApiInstance = { }
        
            return {
                provide: {
                    api: modules
                }
            }
        })
        `
    }
];
program
    .name('phetch-cli')
    .description('Phetch-CLI is a dependency to create `phetch` modules and API layer')
    .option("init", 'create initial `phetch` functionalities')
    .option("create-module <name> [argument]", 'create new module')
    .option("-l, --ls [value]", "list directory content")
    .version(pj.version)
    .action((options) => {
    if (options.ls) {
        const filePath = typeof options.ls === "string" ? options.ls : __dirname;
        listDirContents(filePath);
    }
});
program
    .command('init')
    .description('create initial functionalities')
    .action(() => {
    console.log(`Installing ofetch`);
    exec(`npm install ofetch --save-dev`, (error, stdout, stderr) => {
        if (error) {
            console.error(chalk_1.default.red(`Error during installation: ${error.message}`));
            return;
        }
        if (stderr) {
            console.error(chalk_1.default.red(`stderr: ${stderr}`));
            return;
        }
        console.log(chalk_1.default.green(`stdout: ${stdout}`));
        console.log(chalk_1.default.blue.bold('ofetch installed successfully!'));
    });
});
program
    .command('create-module')
    .description('create new module')
    .argument('<name>', 'the name of module you want to create')
    .option('--crud', 'crud', 'create CRUD module')
    .option('--empty', 'empty', 'create empty module')
    .option('--default', 'default', 'create default module')
    .action((name, options) => {
    if (options.crud) {
        // CRUD
    }
    if (options.empty) {
        // empty
    }
    if (options.default) {
        // default
    }
});
program.parse(process.argv);
// if (options.api) {
//     const names = ['Transform.ts', 'Api.ts', 'Factory.ts']
//     createDir(path.resolve(__dirname, options.api));
//     for (const name of names) {
//         const fullPath = path.resolve(path.join(__dirname, `/${options.api}`), options.api + name)
//         createFile(fullPath)
//         writeFile(fullPath)
//     }
// }
function listDirContents(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield fs.promises.readdir(filePath);
            const detailedFilePromises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                const fileDetails = yield fs.promises.lstat(path.resolve(filePath, file));
                const { size, birthtime } = fileDetails;
                return {
                    filename: file,
                    "size(KB)": size,
                    createdAt: birthtime,
                };
            }));
            const detailedFiles = yield Promise.all(detailedFilePromises);
            console.table(detailedFiles);
        }
        catch (error) {
            console.error(chalk_1.default.red("Error occurred while reading the directory!", error));
        }
    });
}
function writeFile(filePath) {
    fs.writeFile(filePath, 'console.log("Hello World!");', function (err) {
        if (err) {
            return console.error(chalk_1.default.red(err));
        }
        console.log("File created!");
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
//# sourceMappingURL=index.js.map