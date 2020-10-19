import fs from 'fs-extra';
import path from 'path';

async function dataStuctureDir() {
	const dir = process.env.DATA_FS_DIR || '../../files/structure';
	await fs.ensureDir(dir);
	return dir;
}

function filePath(dataDir, key) {
	return path.join(__dirname, dataDir, `${key}.json`);
}

async function readJSON(dataDir, key) {
	const readFrom = filePath(dataDir, key);
	// console.log(readFrom);
	const data = await fs.readFile(readFrom, 'utf8');
	return JSON.parse(data);
}

async function crupdate(key, json) {
	const dataDir = await dataStuctureDir();
	if (key.indexOf('/') >= 0) throw new Error(`key ${key} cannot contain '/'`);
	//   var note = new Note(key, title, body);
	const writeTo = filePath(dataDir, key);
	const writeJSON = json;

	await fs.writeFile(writeTo, writeJSON, 'utf8');
	return json;
}

export function create(key, title, body) {
	return crupdate(key, title, body);
}

export function update(key, title, body) {
	return crupdate(key, title, body);
}

export async function read(key) {
	const dataDir = await dataStuctureDir();
	const structure = await readJSON(dataDir, key);

	return structure;
}

export async function destroy(key) {
	const dataDir = await dataStuctureDir();
	await fs.unlink(filePath(dataDir, key));
}

export async function keylist() {
	const dataDir = await dataStuctureDir();
	let filez = await fs.readdir(dataDir);
	if (!filez || typeof filez === 'undefined') filez = [];

	const thenotes = filez.map(async fname => {
		const key = path.basename(fname, '.json');

		const rec = await readJSON(dataDir, key);
		return rec.key;
	});
	return Promise.all(thenotes);
}

export async function count() {
	const dataDir = await dataStuctureDir();
	const filez = await fs.readdir(dataDir);
	return filez.length;
}

// export async function close() {}
