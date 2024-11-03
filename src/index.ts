#! /usr/bin/env node

import chalk from 'chalk';
const pj = require('./../package.json')
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const figlet = require("figlet");
const { exec } = require('child_process');
import { ExecException } from "child_process";

const program = new Command();

console.log(figlet.textSync("PHETCH-CLI"));

const pluginPattern = {
    name: 'api',
    extension: 'ts',
    type: 'plugin',
    content: `
import { $fetch, type FetchOptions } from 'ofetch'

interface IApiInstance {

}

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const fetchOptions: FetchOptions = {
        baseURL: 'BASE URL',
    }
    const apiFetcher = $fetch.create(fetchOptions)
    const modules: IApiInstance = {
    
    }

    return {
        provide: {
            api: modules
        }
    }
})
`
}
const factoryPattern = {
    name: 'factory',
    extension: 'ts',
    type: 'factory',
    content: `
import type { $Fetch, FetchOptions } from 'ofetch'

class FetchFactory<T> {
  private $fetch: $Fetch

  constructor($fetcher: $Fetch) {
    this.$fetch = $fetcher
  }

  async call(
    method: string,
    url: string,
    data?: object,
    fetchOptions?: FetchOptions<'json'>
  ): Promise<T> {
    return this.$fetch<T>(url, {
      method,
      body: data,
      ...fetchOptions
    })
  }
}

export default FetchFactory
`
}

const patterns = [
    {
        name: 'Transform',
        extension: 'ts',
        type: 'transform',
        content: `
        export function [name]Transform(data: [input]) {
            // transformed data
        }
        `
    },
    {
        name: 'Interface',
        extension: 'ts',
        type: 'interface',
        content: `
        export interface [name]Interface {
            // interface props
        }
        `
    },
    {
        name: 'Api',
        extension: 'ts',
        type: 'api',
        content: `
        
        `
    }
]

program
    .name('phetch-cli')
    .description('Phetch-CLI is a dependency to create `phetch` modules and API layer')
    .option("init", 'create initial `phetch` functionalities')
    .option("create-module <name> [argument]", 'create new module')
    .option("-l, --ls [value]", "list directory content")
    .version(pj.version)
    .action((options: any) => {        
        if (options.ls) {
            const filePath = typeof options.ls === "string" ? options.ls : __dirname;
            listDirContents(filePath);
        }
    })

program
    .command('init')
    .description('create initial functionalities')
    .action(() => {
        console.log(`Installing ofetch`);

        exec(`npm install ofetch --save-dev`, (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) {
                console.error(chalk.red(`Error during installation: ${error.message}`));
                return;
            }
            if (stderr) {
                console.error(chalk.red(`stderr: ${stderr}`));
                return;
            }
            console.log(chalk.green(`stdout: ${stdout}`));
            console.log(chalk.blue.bold('ofetch installed successfully!'));
            createPlugin('./plugins', pluginPattern)
            createFactory('./src', factoryPattern)
        });

    })

program
    .command('create-module')
    .description('create new module')
    .argument('<name>', 'the name of module you want to create')
    .option('--crud', 'crud', 'create CRUD module')
    .option('--empty', 'empty', 'create empty module')
    .option('--default', 'default', 'create default module')
    .action((name: string, options: any) => {
        if (options.crud) {
            // CRUD
        }
        if (options.empty) {
            // empty
        }
        if (options.default) {
            const fullPath = path.resolve(path.join(__dirname, `/./plugins`), pluginPattern.name + '.' + pluginPattern.extension)
            console.log(fullPath);
            
            insertTextBetweenString(fullPath, 'interface IApiInstance {', `\n${name}`)
            console.log(chalk.redBright.bold('plugin added!'));
        }
    })

program.parse(process.argv)

async function listDirContents(filePath: string) {
    try {
        const files = await fs.promises.readdir(filePath);
        const detailedFilePromises = files.map(async (file: string) => {
            const fileDetails = await fs.promises.lstat(path.resolve(filePath, file));
            const { size, birthtime } = fileDetails;
            return {
                filename: file,
                "size(KB)": size,
                createdAt: birthtime,
            };
        });

        const detailedFiles = await Promise.all(detailedFilePromises);
        console.table(detailedFiles);
    } catch (error) {
        console.error(chalk.red("Error occurred while reading the directory!", error));
    }
}
function writeFile(filePath: string, content: string, parameter?: string) {
    const c = content.replace('[p]', parameter as string)
    fs.writeFile(filePath, c, function(err: string) {
        if (err) {
            return console.error(chalk.red(err));
        }
        console.log("File created!");
    })
}
function createDir(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log("The directory has been created successfully");
    }
}
function createFile(filePath: string) {
    const dir = path.dirname(filePath); 

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.openSync(filePath, "w");
    console.log("An empty file has been created at:", filePath);
}
function createFactory(p: string, pattern: any) {
    createDir(p)
    const fullPath = path.resolve(path.join(__dirname, `/${p}`), pattern.name + '.' + pattern.extension)
    createFile(fullPath)
    writeFile(fullPath, pattern.content)
}
function createPlugin(p: string, pattern: any) {
    createDir(p)
    const fullPath = path.resolve(path.join(__dirname, `/${p}`), pattern.name + '.' + pattern.extension)
    createFile(fullPath)
    writeFile(fullPath, pattern.content)
}

function insertTextBetweenString(filePath: string, searchString: string, insertText: string): string {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        const startIndex = fileContent.indexOf(searchString);
        const endIndex = startIndex + searchString.length;

        if (startIndex === -1) {
            return `The string "${searchString}" was not found in the file.`;
        }

        const updatedContent = 
            fileContent.slice(0, startIndex + searchString.length) +
            insertText +
            fileContent.slice(endIndex);        

        fs.writeFileSync(filePath, updatedContent, 'utf-8');

        return `The text "${insertText}" was successfully inserted after "${searchString}" in the file.`;
    } catch (error) {
        return `An error occurred while processing the file: ${error}`;
    }
}