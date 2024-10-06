import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { FaCirclePause } from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";


import { useWavesurfer } from '@wavesurfer/react'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'

const AudioPlayer = ({ audioUrl }) => {
    const containerRef = useRef()
    const formatTime = (seconds) => [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':')
    const [duration, setDuration] = useState()

    const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
        container: containerRef,
        heigh: 100,
        waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        url: audioUrl,
        plugins: useMemo(() => [Timeline.create()], []),
    })
    const onPlayPause = useCallback(() => {
        wavesurfer && wavesurfer.playPause()
    }, [wavesurfer])

    useEffect(() => {
        if (wavesurfer && isReady) {
            setDuration(wavesurfer.getDuration())
        }
    }, [wavesurfer, isReady])


    return (
        <>
            <div ref={containerRef} />

            {!isReady &&
                <>
                    <span className="loading-icon"><AiOutlineLoading /></span>
                    <p>Loading your audio waveform...</p>
                </>
            }

            {isReady &&
                <div className="player-controls">
                    <span onClick={onPlayPause} style={{ minWidth: '5em' }}>
                        {isPlaying ? <FaCirclePause size={40} /> : <FaCirclePlay size={40} />}
                    </span>
                    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>}
        </>
    )
};

export default AudioPlayer;
