import { useEffect, useState } from "react";
import { signImageURL } from "../lib/signedImg";
export default function LookbookCarousel({ images=[] }){
  const [i,setI]=useState(0);
  const [signed,setSigned]=useState([]);
  const captions = [
    'Pit style on point',
    'Crowd surfing vibes',
    'Mic grab moment',
    'Stage dive energy',
    'Unity in the pit',
    'Brutal groove'
  ];
  // Auto cycle through images every 3.5s
  useEffect(()=>{
    const t=setInterval(()=>setI(x=>(x+1)%Math.max(1,images.length)),3500);
    return ()=>clearInterval(t);
  },[images.length]);
  // Sign all provided image URLs so the carousel uses temporary URLs that expire
  useEffect(()=>{
    let alive=true;
    (async()=>{
      const out=[];
      for(const p of images){
        try{
          out.push(await signImageURL(p));
        }catch(e){
          out.push(p);
        }
      }
      if(alive) setSigned(out);
    })();
    return ()=>{alive=false};
  },[images]);
  if(!images.length) return null;
  const cur=signed[i]||images[i];
  const caption = captions[i % captions.length];
  return (
    <div className="card" style={{overflow:"hidden"}}>
      <div className="imgGuard" onContextMenu={(e)=>e.preventDefault()} onDragStart={(e)=>e.preventDefault()}>
        <img src={cur} alt="" style={{width:"100%",height:380,objectFit:"cover"}}/>
      </div>
      <div className="cardPad" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div className="small">LOOKBOOK {i+1}/{images.length}</div>
        <div className="row">
          <button className="btn small" onClick={()=>setI(x=>(x-1+images.length)%images.length)}>PREV</button>
          <button className="btn small" onClick={()=>setI(x=>(x+1)%images.length)}>NEXT</button>
        </div>
      </div>
      {/* Caption with typewriter effect */}
      <div className="cardPad">
        <div className="typewriter small" style={{color:'var(--muted)'}}>{caption}</div>
      </div>
    </div>
  );
}
