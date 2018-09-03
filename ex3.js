const _ =require('lodash');

const {forums, threads}=require ("./testdata.js");
console.log(forums)
console.log(threads)

const fs = require('fs-extra')
const path=require('path');
const fpath=(fname)=>path.join(__dirname,"..","text",fname);
const dirs=forums.map(f=>fpath(f.name));
console.log(dirs);
dirs.map(dir=>fs.ensureDirSync(dir));


let fid=threads[0].fid;
let forum=_.find(forums, { 'fid': fid });
let dirName=fpath(forum.name);
for(let i=0;i<threads.length;i++){
	const thread=threads[i];
	const subject=thread.subject;
	const filename=_.snakeCase(subject)+".md";
	const tpath=path.join(dirName,filename);
	console.log(tpath);
	const text="### "+thread.subject+"\r\n"+
	thread.author+"\r\n"+
	thread.postdate+"\r\n"+
	thread.pw_tmsg.content+"\r\n";
	// console.log(text);
	 fs.writeFileSync(tpath, text);
}
// fs.writeFileSync(file, data[, options])