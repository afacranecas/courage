import React from 'react'

export default function FearInput({value,onChange,onNext,onBack}:{
  value:string,
  onChange:(v:string)=>void,
  onNext:()=>void,
  onBack:()=>void
}){
  return (
    <div className="screen-content">
      <div className="step-kicker">Quest 01</div>
      <h2 className="title">What action are you afraid to take?</h2>
      <p className="muted">Give the fear a name so your hero can face it.</p>
      <div style={{height:8}} />
      <input
        maxLength={100}
        placeholder="I am afraid to..."
        className="input"
        value={value}
        onChange={e=>onChange(e.target.value)}
      />
      <div className="character-count">{value.length}/100</div>
      <div className="footer-buttons">
        <button className="pixel-btn secondary" onClick={onBack}>Back</button>
        <div style={{flex:1}} />
        <button className="pixel-btn" disabled={!value.trim()} onClick={onNext}>Choose powers</button>
      </div>
    </div>
  )
}
