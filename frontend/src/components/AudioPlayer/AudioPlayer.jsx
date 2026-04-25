import { useCallback, useEffect, useRef, useState, useMemo } from "react";


import { useWavesurfer } from '@wavesurfer/react'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import { formatTime } from "../../utils/utils";

import { PlayIcon, Pause } from "lucide-react";

const AudioPlayer = ({ audioUrl }) => {
    const containerRef = useRef()
    const [duration, setDuration] = useState()
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [loadError, setLoadError] = useState('')

    //wavesurfer instance
    const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
        key: audioUrl,
        container: containerRef,
        height: 60,
        autoplay: false,
        waveColor: '#BD1792',
        progressColor: 'rgb(100, 0, 100)',
        url: audioUrl,
        plugins: useMemo(() => [Timeline.create()], []),
    })

    useEffect(() => {
        setLoadError('')
        setLoadingProgress(0)
        setDuration(undefined)
    }, [audioUrl])

    //play pause
    const onPlayPause = useCallback(() => {
        wavesurfer && wavesurfer.playPause()
    }, [wavesurfer])

    //Get track duration
    useEffect(() => {
        if (wavesurfer && isReady) {
            setDuration(wavesurfer.getDuration())
            setLoadingProgress(100)
        }
    }, [wavesurfer, isReady])

    //Loading
    useEffect(() => {
        if (!wavesurfer) return

        const onLoading = (percent) => setLoadingProgress(percent)
        const onError = () => setLoadError('Could not load audio preview')
        wavesurfer.on('loading', onLoading)
        wavesurfer.on('error', onError)

        return () => {
            wavesurfer.un('loading', onLoading)
            wavesurfer.un('error', onError)
        }
    }, [wavesurfer])


    return (
        <>

            {loadError && <p style={{ color: '#ff8aa1', fontSize: '0.85rem' }}>{loadError}</p>}

            {/* LOADING BAR */}
            {!loadError && loadingProgress < 100 &&
                <div className="loading-bar-container" style={{ width: '50%', backgroundColor: '#030712', height: '25px', display: 'flex', alignItems: 'center', margin: '50px auto', borderRadius: '20px' }}>
                    <div style={{ position: "absolute", display: 'flex', justifyContent: 'center', padding: '0 10px', fontSize: '0.8rem', color: 'black' }}>
                    </div>
                    <div className="loading-bar" style={{ width: `${loadingProgress}%`, backgroundColor: '#BD1792', height: '76%', borderRadius: '20px', transition: 'width 0.2s' }}></div>
                    <span style={{ position: 'absolute', padding: '4px 10px', fontSize: '0.8rem', fontWeight: 'bold' }}>Loading...</span>
                </div>}
            {/* Waveform */}
            <div id="waveform"
                className={!isReady ? 'hidden' : ''}
                ref={containerRef}
            />
            {/* Player Controls */}
            <div className="player-controls">
                {isReady &&
                <>
                <div className="play-background">
                    <span id="player-playpause" onClick={onPlayPause} className="clickable">
                        {isPlaying ? <Pause size={30} /> : <PlayIcon size={30} />}
                    </span>
                </div>
                <span id="player-timeline">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </>}
            </div>

        </>
    )
};


export default AudioPlayer;
