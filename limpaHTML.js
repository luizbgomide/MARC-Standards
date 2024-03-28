// Remove scripts e o link Contact Us

const { Console } = require("console");
const fs = require("fs");
const path = require("path");

const scriptRE = /\s*<script[\s\S]+?<\/script>/g
const contactUsRE = /<a href="\/cdn-cgi\/l\/email-protection#.+?Contact Us<\/a>/
const file_location="site/marc/"
const sourceDir = path.resolve(file_location);
const missingHttp = 'href="//';
const replaceHttp = 'href="http://';

function readDirectory(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((item) => {
        if (item.isDirectory()) {
            readDirectory(path.join(dir, item.name));
        } else if (item.isFile()) {
            processFile(path.join(dir, item.name));
        } else {
            console.log("Algo errado com: {}", item.name);
        }
    });
    process.stdout.write("\n");
}

function processFile(file) {
    let innerLink = path.relative(sourceDir, file).replace(/\\/g, "/");
    let sourceLink = path.posix.join("www.loc.gov/marc",innerLink);
    let sourceLinkHtml = `<a href="http://${sourceLink}" class="noprint">Source</a>`
    let ext = path.extname(file);
    if (ext != ".html" && ext != ".htm") {
        // ignora arquivos que não sejam html
        process.stdout.write("-");
        return;
    }
    let contents = fs.readFileSync(file, 'utf8');
    contents = contents.replaceAll(scriptRE, "");
    contents = contents.replaceAll(missingHttp, replaceHttp);
    // assumindo que há apenas um link de contato na página
    contents = contents.replace(contactUsRE, sourceLinkHtml);


    fs.writeFileSync(file, contents);
    process.stdout.write(".");
}

if (!fs.statSync(sourceDir, { throwIfNoEntry: false })?.isDirectory()) {
    console.log(`\nAbortando! "${sourceDir}" não encontrado.`)
}
else {
    cleanHTML();
}

function cleanHTML() {
    readDirectory(sourceDir);
    console.log(`\n\nProcesso completo.\nArquivos HTML modificados em: "${sourceDir}"`);
}
