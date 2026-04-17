import React from 'react'
import { getSpriteUrl } from './utils/pokemonSprites'

const RES_LABELS = { fill: 'Display: Large' }

export default function CapturePanel({
  videoRef, isStreaming, feedSize,
  onFeedSizeChange, onOpenDeviceSelector, onStopStream, team,
  volume, onVolumeChange,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: '0.5px solid rgba(255,255,255,0.07)', flexShrink: 0,
      }}>
        <button
          style={{
            flex: 1, padding: '6px 0', fontSize: 9, fontWeight: 500,
            color: '#85B7EB',
            borderBottom: '1.5px solid #378ADD',
            letterSpacing: '0.5px',
          }}
        >
          Large
        </button>
      </div>

      {/* Video feed - fills available width, maintains 16:9 */}
      <div style={{
        width: '100%',
        paddingBottom: 0,
        background: '#000',
        flexShrink: 0,
        position: 'relative',
      }}>
        <div style={{ width: '100%', aspectRatio: '16 / 9', position: 'relative' }}>
          <video
            ref={videoRef}
            muted={false}
            playsInline
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              display: isStreaming ? 'block' : 'none',
            }}
          />
          {!isStreaming && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginBottom: 12 }}>
                No capture device
              </div>
              <button
                onClick={onOpenDeviceSelector}
                style={{
                  fontSize: 11, padding: '6px 14px', borderRadius: 5,
                  border: '0.5px solid rgba(55,138,221,0.4)',
                  background: 'rgba(55,138,221,0.1)', color: '#85B7EB',
                }}
              >
                Select device
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        padding: '5px 10px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '0.5px solid rgba(255,255,255,0.07)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: isStreaming ? '#3bc46b' : 'rgba(255,255,255,0.2)',
          }} />
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>
            {isStreaming ? 'Live (1080p Source) · Display: Large' : 'Stopped'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
              {(volume ?? 1) === 0 ? '🔇' : (volume ?? 1) < 0.5 ? '🔉' : '🔊'}
            </span>
            <input
              type="range" min={0} max={1} step={0.01}
              value={volume ?? 1}
              onChange={e => onVolumeChange?.(parseFloat(e.target.value))}
              style={{ width: 60, cursor: 'pointer', accentColor: '#378ADD' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {isStreaming ? (
              <>
                <button
                  onClick={onOpenDeviceSelector}
                  style={{
                    fontSize: 9, padding: '2px 8px', borderRadius: 3,
                    border: '0.5px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.35)',
                  }}
                >Switch</button>
                <button
                  onClick={onStopStream}
                  style={{
                    fontSize: 9, padding: '2px 8px', borderRadius: 3,
                    border: '0.5px solid rgba(226,75,74,0.3)',
                    color: 'rgba(226,75,74,0.7)',
                  }}
                >Stop</button>
              </>
            ) : (
              <button
                onClick={onOpenDeviceSelector}
                style={{
                  fontSize: 9, padding: '2px 8px', borderRadius: 3,
                  border: '0.5px solid rgba(55,138,221,0.3)',
                  color: '#85B7EB',
                }}
              >Connect</button>
            )}
          </div>
        </div>
      </div>

      {/* Team icon row - responsive sizing */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, padding: '8px 10px',
        borderTop: '0.5px solid rgba(255,255,255,0.07)',
        background: 'rgba(0,0,0,0.2)', flexShrink: 0,
      }}>
        {Array(6).fill(null).map((_, i) => {
          const slot = team?.[i]
          const name = slot?.name
          const spriteUrl = name ? getSpriteUrl(name) : null
          return (
            <div
              key={i}
              title={name || `Slot ${i + 1}`}
              style={{
                flex: 1, aspectRatio: '1 / 1',
                maxWidth: 90,
                borderRadius: 10,
                background: name ? 'rgba(55,138,221,0.08)' : 'rgba(255,255,255,0.03)',
                border: `0.5px solid ${name ? 'rgba(55,138,221,0.2)' : 'rgba(255,255,255,0.06)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {spriteUrl ? (
                <img
                  src={spriteUrl}
                  alt={name}
                  style={{ width: '90%', height: '90%', imageRendering: 'pixelated', objectFit: 'contain' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
              ) : (
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)' }}>{i + 1}</span>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ flex: 1, background: 'rgba(0,0,0,0.1)' }} />
    </div>
  )
}
