import { useEffect, useRef, useState } from "react";
function makeNoise(ctx){
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) output[i] = (Math.random()*2-1)*0.6;
  const white = ctx.createBufferSource(); white.buffer=noiseBuffer; white.loop=true;
  const biquad = ctx.createBiquadFilter(); biquad.type="bandpass"; biquad.frequency.value=1200; biquad.Q.value=0.6;
  const gain = ctx.createGain(); gain.gain.value=0.08;
  white.connect(biquad); biquad.connect(gain); gain.connect(ctx.destination);
  return { white };
}
export default function AudioNoiseToggle(){
  const [on, setOn]=useState(false);
  const ctxRef=useRef(null); const nodeRef=useRef(null);
  useEffect(()=>()=>{ try{ nodeRef.current?.white?.stop?.(); }catch(e){} try{ ctxRef.current?.close?.(); }catch(e){} },[]);
  const toggle=async ()=>{
    if(on){
      try{ nodeRef.current?.white?.stop?.(); }catch(e){}
      nodeRef.current=null; try{ await ctxRef.current?.close?.(); }catch(e){}
      ctxRef.current=null; setOn(false); return;
    }
    const ctx=new (window.AudioContext||window.webkitAudioContext)(); await ctx.resume();
    const node=makeNoise(ctx); node.white.start(0); ctxRef.current=ctx; nodeRef.current=node; setOn(true);
  };
  return <button className={`btn small ${on?"primary":""}`} onClick={toggle} title="Static/noise toggle">{on?"NOISE: ON":"NOISE: OFF"}</button>;
}
