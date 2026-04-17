import React from 'react'

export default function TitleBar({
  isStreaming, ocrActive, onOcrToggle, onReset,
  onOpenSettings, onAdvanceTurn, turn,
}) {
  
  // Detect macOS to make room for the native "traffic light" window controls
  // (Safe check that won't crash the browser if 'process' isn't defined)
  const isMac = typeof process !== 'undefined' && process.platform === 'darwin'

  return (
    <div style={{
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      // IMPROVEMENT: Added 72px left padding ONLY on Mac to avoid the close/minimize buttons
      paddingLeft: isMac ? 72 : 12,
      paddingRight: 12,
      borderBottom: '0.5px solid rgba(255,255,255,0.08)',
      background: '#090a14',
      WebkitAppRegion: 'drag', // Makes the whole bar draggable
      flexShrink: 0,
    }}>
      
      {/* IMPROVEMENT: Removed 'no-drag' so clicking the title still moves the window */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: isStreaming ? '#3bc46b' : 'rgba(255,255,255,0.2)',
          transition: 'background 0.3s',
        }} />
        <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
          MetaMetric
        </span>
        {turn > 0 && (
          <span style={{
            fontSize: 9, padding: '1px 6px', borderRadius: 3,
            background: 'rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.3)',
          }}>
            Turn {turn}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* IMPROVEMENT: Moved 'no-drag' specifically to the buttons so they can be clicked */}
        <button
          onClick={onAdvanceTurn}
          title="Advance turn - decrements all field condition counters"
          style={{
            WebkitAppRegion: 'no-drag',
            fontSize: 10, padding: '3px 10px', borderRadius: 5,
            border: '0.5px solid rgba(239,159,39,0.4)',
            background: 'rgba(239,159,39,0.08)',
            color: '#FAC775',
          }}
        >
          End turn
        </button>

        <button
          onClick={onOcrToggle}
          title="Toggle OCR Screen Reading"
          style={{
            WebkitAppRegion: 'no-drag',
            fontSize: 10, padding: '3px 10px', borderRadius: 5,
            border: `0.5px solid ${ocrActive ? 'rgba(55,138,221,0.5)' : 'rgba(255,255,255,0.15)'}`,
            background: ocrActive ? 'rgba(55,138,221,0.15)' : 'transparent',
            color: ocrActive ? '#85B7EB' : 'rgba(255,255,255,0.4)',
          }}
        >
          OCR {ocrActive ? 'on' : 'off'}
        </button>

        <button
          onClick={onReset}
          title="Reset battle state to Turn 0"
          style={{
            WebkitAppRegion: 'no-drag',
            fontSize: 10, padding: '3px 10px', borderRadius: 5,
            border: '0.5px solid rgba(226,75,74,0.3)',
            color: 'rgba(226,75,74,0.7)',
          }}
        >
          Reset
        </button>

        <button
          onClick={onOpenSettings}
          title="Open Settings & Calibration"
          style={{
            WebkitAppRegion: 'no-drag',
            fontSize: 10, padding: '3px 10px', borderRadius: 5,
            border: '0.5px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          Settings
        </button>
      </div>
    </div>
  )
}