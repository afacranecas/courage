import React, { useState } from 'react'
import Landing from './components/Landing'
import FearInput from './components/FearInput'
import StrengthSelection from './components/StrengthSelection'
import GameWrapper from './components/GameWrapper'
import Celebration from './components/Celebration'

type Screen = 'landing'|'fear'|'strengths'|'game'|'reflection'

export default function App(){
  const [screen,setScreen] = useState<Screen>('landing')
  const [fear,setFear] = useState('')
  const [strengths,setStrengths] = useState<string[]>([])

  const reset = ()=>{ setFear(''); setStrengths([]); setScreen('landing') }

  return (
    <div className="app">
      <div className="panel">
        {screen === 'landing' && (
          <Landing onStart={()=>setScreen('fear')} />
        )}

        {screen === 'fear' && (
          <FearInput
            value={fear}
            onChange={v=>setFear(v)}
            onNext={()=>setScreen('strengths')}
            onBack={()=>setScreen('landing')}
          />
        )}

        {screen === 'strengths' && (
          <StrengthSelection
            selected={strengths}
            onToggle={(s)=>{
              setStrengths(prev=> prev.includes(s)? prev.filter(x=>x!==s): prev.length<3? [...prev,s]: prev)
            }}
            onNext={()=>setScreen('game')}
            onBack={()=>setScreen('fear')}
          />
        )}

        {screen === 'game' && (
          <GameWrapper
            fearText={fear}
            strengths={strengths}
            onFinish={()=>setScreen('reflection')}
            onChangeFear={()=>setScreen('fear')}
          />
        )}

        {screen === 'reflection' && (
          <Celebration
            fearText={fear}
            strengths={strengths}
            onReplay={()=>setScreen('game')}
            onReset={reset}
          />
        )}

      </div>
    </div>
  )
}
