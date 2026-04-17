import React, { useRef, useState, useEffect, useCallback } from 'react'
import CapturePanel from './components/CapturePanel'
import InfoPanel from './components/InfoPanel'
import TitleBar from './components/TitleBar'
import DeviceSelector from './components/DeviceSelector'
import SettingsPanel from './components/settings/SettingsPanel'
import { useBattleState } from './hooks/useBattleState'
import { useSettings } from './hooks/useSettings'
import bgImage from './assets/Background.png'

export default function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const ocrIntervalRef = useRef(null)
  const isProcessingRef = useRef(false)

  const [feedSize, setFeedSize] = useState('fill')
  const [isStreaming, setIsStreaming] = useState(false)
  const [showDeviceSelector, setShowDeviceSelector] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [ocrActive, setOcrActive] = useState(false)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume
  }, [volume])

  const { battleState, updateFromOCR, manualOverride, resetBattle, advanceTurn } = useBattleState()
  const { team, ocrRegions, prefs, loaded, saveTeam, saveOcrRegions, savePrefs } = useSettings()

  useEffect(() => {
    if (!loaded) return
    if (prefs.feedSize) setFeedSize(prefs.feedSize)
    if (prefs.ocrEnabled) setOcrActive(true)
  }, [loaded, prefs.feedSize, prefs.ocrEnabled])

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessingRef.current) return
    isProcessingRef.current = true
    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      const dataUrl = await new Promise(resolve => {
        canvas.toBlob(blob => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(blob)
        }, 'image/jpeg', 0.8)
      })
      if (window.metaAPI) {
        const newState = await window.metaAPI.processFrame(dataUrl)
        if (newState) updateFromOCR(newState)
      }
    } catch (err) {
      console.error('Failed to capture or process frame:', err)
    } finally {
      isProcessingRef.current = false
    }
  }, [updateFromOCR])

  useEffect(() => {
    if (isStreaming && ocrActive) {
      ocrIntervalRef.current = setInterval(captureFrame, prefs.ocrIntervalMs ?? 2500)
    } else {
      clearInterval(ocrIntervalRef.current)
    }
    return () => clearInterval(ocrIntervalRef.current)
  }, [isStreaming, ocrActive, captureFrame, prefs.ocrIntervalMs])

  const startStream = useCallback(async (deviceId) => {
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const videoDevice = allDevices.find(d => d.deviceId === deviceId)
      const matchingAudio = allDevices.find(d =>
        d.kind === 'audioinput' &&
        (d.groupId === videoDevice?.groupId || (videoDevice && d.label.includes(videoDevice.label.split(' ')[0])))
      )
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: deviceId },
          width:    { ideal: 1920 },
          height:   { ideal: 1080 },
          frameRate: { ideal: 60 },
        },
        audio: {
          ...(matchingAudio ? { deviceId: { exact: matchingAudio.deviceId } } : {}),
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = false
        videoRef.current.play()
      }
      setIsStreaming(true)
      setShowDeviceSelector(false)
    } catch (err) {
      console.error('Failed to start stream:', err)
    }
  }, [])

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    setIsStreaming(false)
    clearInterval(ocrIntervalRef.current)
  }, [])

  useEffect(() => () => stopStream(), [stopStream])

  async function handleAdvanceTurn() {
    if (window.metaAPI) {
      const newState = await window.metaAPI.advanceTurn()
      if (newState) updateFromOCR(newState)
    } else {
      advanceTurn()
    }
  }

  function handleToggleOcr() {
    const newVal = !ocrActive
    setOcrActive(newVal)
    savePrefs({ ocrEnabled: newVal })
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'relative',
backgroundImage: `url(${bgImage})`,
backgroundSize: 'cover',
backgroundPosition: 'center',
backgroundRepeat: 'no-repeat',
    }}>
      <TitleBar
        isStreaming={isStreaming}
        ocrActive={ocrActive}
        onOcrToggle={handleToggleOcr}
        onReset={resetBattle}
        onOpenSettings={() => setShowSettings(true)}
        onAdvanceTurn={handleAdvanceTurn}
        turn={battleState.turn}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{
          width: '60%',
          minWidth: 700,
          maxWidth: 1200,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '0.5px solid rgba(255,255,255,0.08)',
          background: 'rgba(9, 10, 20, 0.85)',
          transition: 'width 0.2s ease',
        }}>
          <CapturePanel
            videoRef={videoRef}
            isStreaming={isStreaming}
            feedSize={feedSize}
            onFeedSizeChange={setFeedSize}
            onOpenDeviceSelector={() => setShowDeviceSelector(true)}
            onStopStream={stopStream}
            team={team}
            volume={volume}
            onVolumeChange={setVolume}
          />
        </div>

        <InfoPanel
          battleState={battleState}
          onManualOverride={manualOverride}
          team={team}
        />
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {showDeviceSelector && (
        <DeviceSelector
          onSelect={startStream}
          onClose={() => setShowDeviceSelector(false)}
        />
      )}

      {showSettings && (
        <SettingsPanel
          team={team}
          prefs={prefs}
          onSaveTeam={saveTeam}
          onSavePrefs={savePrefs}
          onClose={() => setShowSettings(false)}
          videoRef={videoRef}
          ocrRegions={ocrRegions}
          onSaveOcrRegions={saveOcrRegions}
        />
      )}
    </div>
  )
}
