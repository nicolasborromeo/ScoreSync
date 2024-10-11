import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { FaBedPulse, FaCirclePlay } from "react-icons/fa6";
import { FaCirclePause } from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";

import { useWavesurfer } from '@wavesurfer/react'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'



const AudioPlayer = ({ audioUrl }) => {
    const containerRef = useRef()
    const formatTime = (seconds) => [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':')
    const [duration, setDuration] = useState()
    const [loadingProgress, setLoadingProgress] = useState()

    //wavesurfer instance
    const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
        container: containerRef,
        height: 100,
        autoplay: false,
        waveColor: '#EB3678',
        progressColor: 'rgb(100, 0, 100)',
        url: audioUrl,
        plugins: useMemo(() => [Timeline.create()], []),
    })

    //play pause
    const onPlayPause = useCallback(() => {
        wavesurfer && wavesurfer.playPause()
    }, [wavesurfer])

    //Get track duration
    useEffect(() => {
        if (wavesurfer && isReady) {
            setDuration(wavesurfer.getDuration())
        }
    }, [wavesurfer, isReady])

    //Loading
    useEffect(() => {
        if (wavesurfer) {
            wavesurfer.on('loading', (percent) => {
                setLoadingProgress(percent)
            })
        }
    }, [wavesurfer, loadingProgress])


    return (
        <>

            {/* LOADING BAR */}
            {loadingProgress < 100 &&
                <div className="loading-bar-container" style={{ width: '50%', backgroundColor: 'gray', height: '20px', display: 'flex', alignItems: 'center', margin: '50px auto', borderRadius: '20px' }}>
                    <div style={{ position: "absolute", display:'flex', justifyContent:'center', padding:'0 10px', fontSize:'0.8rem', color:'black' }}>
                        <span>Loading...</span>
                    </div>
                    <div className="loading-bar" style={{ width: `${loadingProgress}%`, backgroundColor: '#EB3678', filter: 'grayscale(40%) opacity(0.4) brightness(2)', height: '60%', borderRadius:'20px',transition: 'width 0.2s' }}></div>
                </div>}
            {/* Waveform */}
            <div id="waveform" className={!isReady ? 'hidden' : ''} ref={containerRef} />
            {/* Player Controls */}
            {isReady &&
                <div className="player-controls">
                    <span id="player-playpause" onClick={onPlayPause} >
                        {isPlaying ? <FaCirclePause size={40} /> : <FaCirclePlay size={40} />}
                    </span>
                    <span id="player-timeline">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>}
        </>
    )
};


export default AudioPlayer;
