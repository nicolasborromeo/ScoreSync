import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useWavesurfer } from '@wavesurfer/react'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import tinycolor from "tinycolor2";

//helper
import { formatTime } from "../../utils/utils";
//icons
import { FaCirclePlay } from "react-icons/fa6";
import { FaCirclePause } from "react-icons/fa6";

//component
const CardAudioPlayer = ({ audioUrl, waveformColor }) => {
    const containerRef = useRef()
    const [duration, setDuration] = useState()
    const [loadingProgress, setLoadingProgress] = useState()

    //wavesurfer instance
    const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
        container: containerRef,
        height: 100,
        autoplay: false,
        waveColor: waveformColor || '#EB3678',
        progressColor: tinycolor(waveformColor).darken(10).toString() || 'rgb(100, 0, 100)',
        url: audioUrl,
        plugins: useMemo(() => [
            Hover.create({
                lineColor: '#ff0000',
                lineWidth: 2,
                labelBackground: '#555',
                labelColor: '#fff',
                labelSize: '11px',
            }),
        ], []),
    });

    // Function to handle volume change
    // const handleVolumeChange = (event) => {
    //     const volume = event.target.value;
    //     if (wavesurfer) {
    //         wavesurfer.setVolume(volume);
    //     }
    // };

    useEffect(() => {
        if (wavesurfer) {
            wavesurfer.on('interaction', () => {
                wavesurfer.play()
            })
        }
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
                <div className="card-loading-bar-container" style={{ width: '50%', backgroundColor: 'lightgray', height: '20px', display: 'flex', alignItems: 'center', margin: '50px auto', borderRadius: '20px' }}>
                    <div style={{ position: "absolute", display: 'flex', justifyContent: 'center', padding: '0 10px', fontSize: '0.8rem', color: 'black' }}>
                    </div>
                    <div className="card-loading-bar" style={{ width: `${loadingProgress}%`, backgroundColor: waveformColor || '#EB3678', filter: 'grayscale(20%) brightness(1.2)', height: '60%', borderRadius: '20px', transition: 'width 0.2s' }}></div>
                </div>}



            {/* Waveform */}
            <div id="card-details-waveform-container">

            <div id="card-waveform" className={!isReady ? 'hidden' : ''} ref={containerRef} />
            </div>

            {/* Player Controls */}
            {isReady &&
                <div className="card-player-controls" style={{ color: waveformColor }}>
                    <span id="card-player-playpause" onClick={onPlayPause} >
                        {isPlaying ? <FaCirclePause size={40} /> : <FaCirclePlay size={40} />}
                    </span>
                    <span id="card-player-timeline">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>}
        </>
    )
};


export default CardAudioPlayer;
