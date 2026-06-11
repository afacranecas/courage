import React from 'react'
import { getAbility } from '../data/abilities'
import { classifyFear, FEAR_CATEGORY_LABELS } from '../data/fears'

export default function Celebration({fearText,strengths,onReplay,onReset}:{
  fearText:string
  strengths:string[]
  onReplay:()=>void
  onReset:()=>void
}) {
  const category = classifyFear(fearText)
  const colors = strengths.map(name => getAbility(name)?.cssColor || '#ff6fae')
  while (colors.length < 3) colors.push(colors[0] || '#ff6fae')

  return (
    <div className="celebration">
      <div className="celebration-sun" />
      <div className="celebration-cloud cloud-one" />
      <div className="celebration-cloud cloud-two" />

      <div className="confetti-field" aria-hidden="true">
        {Array.from({length: 42}, (_, index) => (
          <i
            key={index}
            style={{
              '--x': `${(index * 37) % 100}%`,
              '--delay': `${(index % 9) * -0.24}s`,
              '--color': colors[index % colors.length]
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="dance-floor" aria-hidden="true">
        <div className={`victory-challenge ${category}`}>
          {category === 'fire' && <><i/><i/><i/><i/></>}
          {category === 'creature' && <><b/><b/></>}
        </div>

        <div className="dancing-hero">
          <div
            className="dance-cape"
            style={{
              '--cape-one': colors[0],
              '--cape-two': colors[1],
              '--cape-three': colors[2]
            } as React.CSSProperties}
          />
          <div className="dance-head"><i/><i/></div>
          <div className="dance-body" />
          <div className="dance-arm left" />
          <div className="dance-arm right" />
          <div className="dance-leg left" />
          <div className="dance-leg right" />
        </div>
      </div>

      <div className="celebration-card">
        <div className="step-kicker">{FEAR_CATEGORY_LABELS[category]} cleared</div>
        <h2>You cleared your fear!</h2>
        <p>Your strengths helped you carry courage through it.</p>
        <div className="victory-powers">
          {strengths.map(name => {
            const ability = getAbility(name)
            return (
              <strong key={name} style={{'--power-color': ability?.cssColor || '#ffffff'} as React.CSSProperties}>
                {ability?.shortName || name}
              </strong>
            )
          })}
        </div>
        <div className="celebration-actions">
          <button className="pixel-btn" onClick={onReplay}>Dance again</button>
          <button className="pixel-btn secondary" onClick={onReset}>New quest</button>
        </div>
      </div>
    </div>
  )
}
