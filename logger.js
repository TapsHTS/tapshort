const chalk = require('chalk');
const dayjs = require('dayjs');

const format = '{tstamp} {tag} {text}\n';

function create(content) {
    write(content, 'black', 'bgGreen', 'ADD', true);
}

function remove(content) {
    write(content, 'black', 'bgRed', 'DEL', false);
}

function request(content) {
    write(content, 'black', 'bgBlue', 'GET', false);
}


function write(content, tagColor, bgTagColor, tag, error = false) {

    const timestamp = `[${dayjs().format('DD/MM - HH:mm:ss')}]`;
    const logTag = `[${tag}]`;
    const stream = error ? process.stderr : process.stdout;

    const item = format
        .replace('{tstamp}', chalk.gray(timestamp))
        .replace('{tag}', chalk[bgTagColor][tagColor](logTag))
        .replace('{text}', chalk.white(content));

    stream.write(item);
}

module.exports = { create, remove, request };