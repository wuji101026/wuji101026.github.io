#!/usr/bin/env node
// 扫描站点内的 music/ 文件夹，把里面的音频文件名写入 music/manifest.json。
// 因为纯静态站点（GitHub Pages 等）的浏览器无法直接列目录，
// 所以用这个脚本在本地"读取文件夹"并生成清单；播放器只认这个清单。
// 用法：node build-music-manifest.js   （每次往 music/ 加/删文件后重跑一次）

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const MUSIC_DIR = path.join(ROOT, 'music');
const EXT = ['.mp3', '.m4a', '.aac', '.ogg', '.oga', '.wav', '.flac', '.opus', '.webm'];

function main() {
    if (!fs.existsSync(MUSIC_DIR)) {
        console.error('找不到 music/ 文件夹，请先创建它并放入音频文件。');
        process.exit(1);
    }
    const files = fs.readdirSync(MUSIC_DIR)
        .filter(function (f) {
            return fs.statSync(path.join(MUSIC_DIR, f)).isFile() &&
                EXT.includes(path.extname(f).toLowerCase());
        })
        .sort();

    fs.writeFileSync(
        path.join(MUSIC_DIR, 'manifest.json'),
        JSON.stringify(files, null, 2) + '\n'
    );

    console.log('已生成 music/manifest.json，共 ' + files.length + ' 个音频文件：');
    files.forEach(function (f) { console.log('  - ' + f); });
    if (files.length === 0) {
        console.log('（当前 music/ 里还没有音频文件，放入后重跑本脚本即可）');
    }
}

main();
