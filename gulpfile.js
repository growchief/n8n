const path = require('path');
const { task, src, dest } = require('gulp');
const {copyFile} = require('fs/promises');

task('build:icons', copyIcons);

async function copyIcons() {
	await copyFile('nodes/Postiz/postiz.png', 'dist/nodes/Postiz/postiz.png');
	return copyFile('pnpm-lock.yaml', 'dist/pnpm-lock.yaml');
}
