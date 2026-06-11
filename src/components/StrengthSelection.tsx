import React from 'react'
import { ABILITIES } from '../data/abilities'

export default function StrengthSelection({selected,onToggle,onNext,onBack}:{
  selected:string[],
  onToggle:(s:string)=>void,
  onNext:()=>void,
  onBack:()=>void
}){
  return (
    <div className="screen-content">
      <div className="step-kicker">Discover your cape powers</div>
      <h2 className="title">Which statements feel most like you?</h2>
      <p className="muted">Choose up to three. Each one reveals a strength and adds its color to your cape.</p>
      <div className="ability-grid">
        {ABILITIES.map(ability=>{
          const sel = selected.includes(ability.name)
          return (
            <button
              type="button"
              key={ability.name}
              className={"ability-card" + (sel ? ' selected' : '')}
              style={{'--ability-color': ability.cssColor} as React.CSSProperties}
              onClick={()=>onToggle(ability.name)}
              aria-pressed={sel}
            >
              <span className="ability-icon">{ability.icon}</span>
              <span>
                <small className="power-reveal">{ability.shortName}</small>
                <strong>{ability.name}</strong>
                <small className="power-description">{ability.description}</small>
              </span>
              <span className="ability-check">{sel ? 'ON' : '+'}</span>
            </button>
          )
        })}
      </div>
      <div className="selection-meter">{selected.length}/3 cape powers discovered</div>
      <div className="footer-buttons">
        <button className="pixel-btn secondary" onClick={onBack}>Back</button>
        <div style={{flex:1}} />
        <button className="pixel-btn" disabled={selected.length === 0} onClick={onNext}>Start quest</button>
      </div>
    </div>
  )
}
