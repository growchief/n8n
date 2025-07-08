const path = require('path');
const { task, src, dest } = require('gulp');
const {copyFile} = require('fs/promises');

task('build:icons', copyIcons);

function copyIcons() {
	return copyFile('nodes/Postiz/postiz.png', 'dist/nodes/Postiz/postiz.png');
}
