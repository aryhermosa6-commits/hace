import { readSession } from '../../../lib/auth'; export default function handler(req,res){ const sess=readSession(req); res.status(200).json({ ok:!!sess, session:sess||null }); }
