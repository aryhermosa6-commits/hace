import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

function ensureFile(p, fallback){
  try{
    if(!fs.existsSync(p)){
      fs.mkdirSync(path.dirname(p), { recursive:true });
      fs.writeFileSync(p, JSON.stringify(fallback, null, 2));
    }
  }catch(e){}
}

export function readJSON(file, fallback){
  const p = path.join(dataDir, file);
  ensureFile(p, fallback);
  try{
    const raw = fs.readFileSync(p, "utf-8");
    return JSON.parse(raw || "null") ?? fallback;
  }catch(e){
    return fallback;
  }
}

export function writeJSON(file, obj){
  const p = path.join(dataDir, file);
  fs.mkdirSync(path.dirname(p), { recursive:true });
  const tmp = p + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2));
  fs.renameSync(tmp, p);
}

export function appendJSONList(file, listKey, item){
  const doc = readJSON(file, { [listKey]: [] });
  if(!Array.isArray(doc[listKey])) doc[listKey] = [];
  doc[listKey].push(item);
  writeJSON(file, doc);
  return doc;
}
