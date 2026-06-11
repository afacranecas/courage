import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import OvercomingScene from '../game/OvercomingScene'
import { getAbility } from '../data/abilities'

export default function GameWrapper({fearText,strengths,onFinish,onChangeFear}:{
  fearText:string,
  strengths:string[],
  onFinish:()=>void,
  onChangeFear:()=>void
}){
  const containerRef = useRef<HTMLDivElement|null>(null)
  const gameRef = useRef<Phaser.Game|undefined>(undefined)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  useEffect(()=>{
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current || undefined,
      width: 800,
      height: 400,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true
      },
      backgroundColor: '#182052',
      scene: [ new OvercomingScene({ key: 'overcoming' }) ]
    }

    const game = new Phaser.Game(config)
    gameRef.current = game

    const onCelebrate = () => { onFinishRef.current() }
    window.addEventListener('overcoming:celebration', onCelebrate as EventListener)

    return ()=>{
      window.removeEventListener('overcoming:celebration', onCelebrate as EventListener)
      try{ game.destroy(true) }catch(e){}
    }
  }, [])

  useEffect(()=>{
    const game = gameRef.current
    if(!game) return
    const restart = () => {
      const scene = game.scene.getScene('overcoming')
      if (scene?.scene.settings) scene.scene.restart({ fearText, strengths })
    }
    if (game.isBooted) restart()
    else game.events.once(Phaser.Core.Events.READY, restart)

    return () => {
      game.events.off(Phaser.Core.Events.READY, restart)
    }
  }, [fearText, strengths])

  const sendJump = () => {
    window.dispatchEvent(new CustomEvent('overcoming:jump'))
  }

  return (
    <div className="game-screen">
      <div className="game-hud">
        <div className="fear-readout">
          <span className="hud-label">Your quest</span>
          <strong>{fearText || 'Face the unknown'}</strong>
        </div>
        <div className="cape-readout" aria-label="Cape abilities">
          <span className="hud-label power-label">Cape powers</span>
          <div className="cape-chips">
            {strengths.map(name => {
              const ability = getAbility(name)
              return (
                <span className="cape-chip" key={name} style={{'--chip-color': ability?.cssColor || '#ffffff'} as React.CSSProperties}>
                  {ability?.shortName || name}
                </span>
              )
            })}
          </div>
        </div>
        <button className="pixel-btn secondary compact" onClick={onChangeFear}>Edit quest</button>
      </div>

      <div className="game-stage">
        <div className="game-container" ref={containerRef} />
        <button className="jump-button" onPointerDown={sendJump}>
          <span>SPACE</span>
          JUMP
        </button>
      </div>
    </div>
  )
}
