import { readJSON } from "../../lib/storageServer";
export default function handler(req, res){
  const doc = readJSON("products.json", { settings:{}, products:[] });
  res.status(200).json(doc);
}
