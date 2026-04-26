import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useWavesurfer } from '@wavesurfer/react'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import tinycolor from "tinycolor2";

//helper
import { formatTime } from "../../utils/utils";
//icons
import { FaCirclePlay } from "react-icons/fa6";
import { FaCirclePause } from "react-icons/fa6";

const DEFAULT_WAVEFORM_COLOR = '#EB3678'

//component
const CardAudioPlayer = ({ audioUrl, waveformColor }) => {
    const containerRef = useRef()
    const [duration, setDuration] = useState()
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [loadError, setLoadError] = useState('')

    const resolvedWaveformColor = waveformColor || DEFAULT_WAVEFORM_COLOR
    const progressColor = useMemo(
        () => tinycolor(resolvedWaveformColor).darken(10).toString() || 'rgb(100, 0, 100)',
        [resolvedWaveformColor]
    )

    const hoverPlugin = useMemo(() => Hover.create({
        lineColor: tinycolor(DEFAULT_WAVEFORM_COLOR).lighten(20).toString() || 'rgb(100, 0, 100)',
        lineWidth: 2,
        labelBackground: '#555',
        labelColor: '#fff',
        labelSize: '11px',
    }), [])

    const plugins = useMemo(() => [hoverPlugin], [hoverPlugin])

    //wavesurfer instance
    const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
        key: audioUrl,
        container: containerRef,
        height: 100,
        autoplay: false,
        waveColor: DEFAULT_WAVEFORM_COLOR,
        progressColor: tinycolor(DEFAULT_WAVEFORM_COLOR).darken(10).toString(),
        url: audioUrl,
        plugins,
    });

    // Function to handle volume change
    // const handleVolumeChange = (event) => {
    //     const volume = event.target.value;
    //     if (wavesurfer) {
    //         wavesurfer.setVolume(volume);
    //     }
    // };

    useEffect(() => {
        setLoadError('')
        setLoadingProgress(0)
        setDuration(undefined)
    }, [audioUrl])

    useEffect(() => {
        if (!wavesurfer) return
        const onInteraction = () => wavesurfer.play()
        wavesurfer.on('interaction', onInteraction)
        return () => wavesurfer.un('interaction', onInteraction)
    }, [wavesurfer])

    useEffect(() => {
        if (!wavesurfer) return

        wavesurfer.setOptions({
            waveColor: resolvedWaveformColor,
            progressColor,
        })
    }, [wavesurfer, resolvedWaveformColor, progressColor])

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

            {loadError && <p style={{ color: '#ff8aa1', fontSize: '0.9rem' }}>{loadError}</p>}

            {/* LOADING BAR */}
            {!loadError && loadingProgress < 100 &&
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
