import React, { useEffect, useState } from 'react'

export default function DeviceSelector({ onSelect, onClose }) {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null) // IMPROVEMENT: Track specific error states

  useEffect(() => {
    let testStream = null // IMPROVEMENT: Track the stream so we can kill it

    async function load() {
      try {
        // IMPROVEMENT: Only ask for video. Asking for audio here will crash the 
        // whole selector if the user doesn't have a microphone plugged into their PC.
        testStream = await navigator.mediaDevices.getUserMedia({ video: true })
        
        const all = await navigator.mediaDevices.enumerateDevices()
        const videoInputs = all.filter(d => d.kind === 'videoinput')
        
        setDevices(videoInputs)
        if (videoInputs.length > 0) setSelected(videoInputs[0].deviceId)
      } catch (err) {
        console.error('Could not enumerate devices:', err)
        // IMPROVEMENT: User-friendly error messages based on the actual failure
        if (err.name === 'NotAllowedError') {
          setErrorMsg("Camera permission denied. Please allow access in your OS privacy settings.")
        } else if (err.name === 'NotFoundError') {
          setErrorMsg("No capture devices found. Please plug in your device.")
        } else {
          setErrorMsg("Failed to access media devices.")
        }
      } finally {
        setLoading(false)
        
        // CRITICAL IMPROVEMENT: Kill the test stream! 
        // If we don't, the capture card stays locked and App.jsx can't connect to it.
        if (testStream) {
          testStream.getTracks().forEach(track => track.stop())
        }
      }
    }
    
    load()

    // Safety cleanup in case the component unmounts mid-load
    return () => {
      if (testStream) {
        testStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{
        background: '#13151f', border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: 10, padding: '20px 24px', width: 360, maxWidth: '90vw',
      }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>
          Select capture device
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16 }}>
          Choose your capture card. Audio will be captured automatically.
        </div>

        {loading ? (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '12px 0' }}>
            Loading devices...
          </div>
        ) : errorMsg ? (
          <div style={{ fontSize: 11, color: 'var(--red-light)', padding: '12px 0', lineHeight: 1.4 }}>
            {errorMsg}
          </div>
        ) : devices.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--red-light)', padding: '12px 0' }}>
            No video devices found. Make sure your capture card is connected.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
            {devices.map(device => (
              <button
                key={device.deviceId}
                onClick={() => setSelected(device.deviceId)}
                style={{
                  textAlign: 'left', padding: '8px 12px', borderRadius: 6,
                  border: `0.5px solid ${selected === device.deviceId ? 'rgba(55,138,221,0.5)' : 'rgba(255,255,255,0.09)'}`,
                  background: selected === device.deviceId ? 'rgba(55,138,221,0.12)' : 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: selected === device.deviceId ? '#378ADD' : 'rgba(255,255,255,0.2)',
                }} />
                <span style={{
                  fontSize: 11,
                  color: selected === device.deviceId ? '#85B7EB' : 'var(--text-secondary)',
                }}>
                  {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                </span>
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              fontSize: 11, padding: '6px 14px', borderRadius: 5,
              border: '0.5px solid rgba(255,255,255,0.12)',
              color: 'var(--text-secondary)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => selected && onSelect(selected)}
            disabled={!selected || !!errorMsg} // Disable connect if there's an error
            style={{
              fontSize: 11, padding: '6px 14px', borderRadius: 5,
              border: '0.5px solid rgba(55,138,221,0.4)',
              background: selected && !errorMsg ? 'rgba(55,138,221,0.15)' : 'rgba(255,255,255,0.04)',
              color: selected && !errorMsg ? '#85B7EB' : 'var(--text-muted)',
            }}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  )
}