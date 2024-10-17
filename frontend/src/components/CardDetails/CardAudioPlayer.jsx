import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { FaCirclePause } from "react-icons/fa6";

import { useWavesurfer } from '@wavesurfer/react'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
// import Hover from 'wavesurfer.js/dist/plugin/wavesurfer.hover.js'; // Ensure this import is correct


import { formatTime } from "../../utils/utils";


const CardAudioPlayer = ({ audioUrl }) => {
    const containerRef = useRef()
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
        plugins:  useMemo(() => [
            Hover.create({
              lineColor: '#ff0000',
              lineWidth: 2,
              labelBackground: '#555',
              labelColor: '#fff',
              labelSize: '11px',
            }),
          ],[])
    })
    useEffect(()=> {
        if(wavesurfer){
            wavesurfer.on('interaction', () => {
            wavesurfer.play()
          })}
    }, [wavesurfer])


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
                <div className="card-loading-bar-container" style={{ width: '50%', backgroundColor: 'gray', height: '20px', display: 'flex', alignItems: 'center', margin: '50px auto', borderRadius: '20px' }}>
                    <div style={{ position: "absolute", display:'flex', justifyContent:'center', padding:'0 10px', fontSize:'0.8rem', color:'black' }}>
                    </div>
                    <div className="card-loading-bar" style={{ width: `${loadingProgress}%`, backgroundColor: '#EB3678', filter: 'grayscale(40%) brightness(0.5)', height: '60%', borderRadius:'20px',transition: 'width 0.2s' }}></div>
                    <span style={{position:'absolute', padding:'0 10px', fontSize:'0.8rem'}}>Loading...</span>
                </div>}


            {/* Waveform */}
            <div id="card-waveform" className={!isReady ? 'hidden' : ''} ref={containerRef} />

            {/* Player Controls */}
            {isReady &&
                <div className="card-player-controls">
                    <span id="card-player-playpause" onClick={onPlayPause} >
                        {isPlaying ? <FaCirclePause size={40} /> : <FaCirclePlay size={40} />}
                    </span>
                    <span id="card-player-timeline">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>}
        </>
    )
};


export default CardAudioPlayer;
