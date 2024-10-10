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

    //LoadUrl
    // useEffect(()=> {
    //     wavesurfer && wavesurfer.load(audioUrl)
    // }, [audioUrl])

    return (
        <>

            {/* LOADING BAR */}
           { loadingProgress < 100 && <div style={{ width: '100%', backgroundColor: 'gray', height: '20px', display: 'flex', alignItems:'center' }}>
                <div style={{width: `${loadingProgress}%`,backgroundColor: 'blue',height: '60%',transition: 'width 0.2s'}}></div>
            </div>}
            {/* Waveform */}
            <div id="waveform" ref={containerRef} />

            {isReady &&
                <div className="player-controls">
                    <span id="player-playpause"onClick={onPlayPause} >
                        {isPlaying ? <FaCirclePause size={40} /> : <FaCirclePlay size={40} />}
                    </span>
                    <span id="player-timeline">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>}
        </>
    )
};


// export const LoadingBar = () => {
//     return (

//     )
// }

export default AudioPlayer;
