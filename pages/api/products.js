import { readJSON } from "../../lib/storage";
export default function handler(req, res){
  const doc = readJSON("products.json", { settings:{}, products:[] });
  res.status(200).json(doc);
}
