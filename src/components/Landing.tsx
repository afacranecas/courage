import React from 'react'

export default function Landing({onStart}:{onStart:()=>void}){
  return (
    <div className="center landing">
      <div className="pixel-spark">+ &nbsp; * &nbsp; +</div>
      <div className="eyebrow">A tiny courage quest</div>
      <h1 className="logo">OVER<span>COMING</span></h1>
      <p className="subtitle">Name the fear. Equip your courage. Make the leap.</p>
      <button className="pixel-btn start-btn" onClick={onStart}>Press start</button>
      <div className="tiny-note">No lives lost. Try as many times as you need.</div>
    </div>
  )
}
