// Remove scripts e o link Contact Us

const { Console } = require("console");
const fs = require("fs");
const path = require("path");

const scriptRE = /\s*<script[\s\S]+?<\/script>/g
const contactUsRE = /<a href=.+?>Contact Us<\/a>/
const cfEmailObfuscationRE = /<a href=.+? data-cfemail="(\w+?)".+?<\/a>/g
const file_location="site/marc/"
const sourceDir = path.resolve(file_location);
const missingHttp = '="//';
const replaceHttp = '="http://';

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
    contents = contents.replaceAll(cfEmailObfuscationRE, cfEmailReplacer);
    // assumindo que há apenas um link de contato na página trocar ele pelo link para a página original
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

function cfEmailReplacer(match, codedEmail) {
    return cfDecodeEmail(codedEmail);
}

function cfDecodeEmail(encodedString) {
    var email = "", r = parseInt(encodedString.substr(0, 2), 16), n, i;
    for (n = 2; encodedString.length - n; n += 2){
        i = parseInt(encodedString.substr(n, 2), 16) ^ r;
        email += String.fromCharCode(i);
    }
    return email;
}
