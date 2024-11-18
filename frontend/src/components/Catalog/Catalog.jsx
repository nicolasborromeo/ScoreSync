import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useModal } from "../../context/Modal";
import { useToast} from '../../context/ToastContext'

import { thunkGetUserTracks, thunkDeleteTrack, thunkUploadTracks } from "../../store/tracks"
import { formatUploaded, formatSecsToMins } from "../../utils/utils";

import AudioPlayer from "../AudioPlayer"
import RenameModal from "../RenameModal";

import { FaCloudUploadAlt } from 'react-icons/fa';
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineLoading } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";
import { RxCursorText } from "react-icons/rx";

import './Catalog.css'

import {
    PlayIcon,
    XIcon,
} from "lucide-react";


export default function Catalog() {
    const user = useSelector(state => state.session.user)
    const catalog = useSelector(state => state.catalog.userTracks)
    const dispatch = useDispatch()

    //Catalog Table State Variables
    const [activeTrackId, setActiveTrackId] = useState()

    //Track Option Menu States Variables
    const [trackId, setTrackId] = useState()
    const [trackTitle, setTrackTitle] = useState()
    const [x, setX] = useState()
    const [y, setY] = useState()
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef()

    //Audio Plater State variables
    const [stateUpdated, setStateUpdated] = useState()
    const [audioUrl, setAudioUrl] = useState()
    const [showPlayer, setShowPlayer] = useState(false)


    //uplading
    const [uploading, setUploading] = useState()
    const [uploadingTrackNames, setUploadingTrackNames] = useState()

    //toast
    const {addToast} = useToast()

    //Thunk operations
    useEffect(() => {
        dispatch(thunkGetUserTracks())
            .then(() => {
                setStateUpdated(true)
            })
    }, [user, dispatch])


    const handleUploadTracks = async e => {
        const files = e.target.files
        const trackNames = [...files].map(file => file.name)
        if (files.length >= 1) {
            setUploadingTrackNames(trackNames)
            setUploading(true)
            dispatch(thunkUploadTracks(files, user.id))
            .then(() => {
                addToast('Upload successful!')
                setUploading(false)
            })
            .catch(()=> {
                addToast('Error: There was an error while uploading', 'error')
                    setUploading(false)
            })

        }
    }



    const handleDeleteTrack = (trackId) => {
        dispatch(thunkDeleteTrack(trackId))
        .then(()=> addToast('Successfully deleted.'))
        setShowMenu(false)
    }

    //AudioPlayer Functions
    const handleTrackPlay = (url, title) => {
        setTrackTitle(title)
        setAudioUrl(url)
        setShowPlayer(true)
    }

    const toggleShowPlayer = () => {
        if (showPlayer) {
            setShowPlayer(false)
            setActiveTrackId(null)
        }
        else setShowPlayer(true)
    }

    //Track Options Menu
    const openTrackMenu = (e, trackId, trackTitle) => {
        e.stopPropagation()
        setX(e.clientX - 80)
        setY(e.clientY)
        setTrackId(trackId)
        setTrackTitle(trackTitle)
        setShowMenu(true)
    }
    useEffect(() => {
        const closeMenu = e => {
            if (!menuRef.current.contains(e.target)) setShowMenu(false)
        }
        if (showMenu) document.addEventListener('click', closeMenu)
        return () => document.removeEventListener('click', closeMenu)
    }, [showMenu])


    return (
        <div id="catalog-container">

            <div className="page-title-container">
                <div className="page-title-content">
                    <p id="page-title">Catalog</p>
                    <div className="gradient-button-background">
                        <TrackUploadButton handleUploadTracks={handleUploadTracks} uploading={uploading} />
                    </div>
                </div>
            </div>
            <div className="table-and-player-container">

                <table className="tracks-table">
                    <thead><tr><th>Name</th><th></th><th>Duration</th><th>Uploaded</th><th></th></tr></thead>
                    {
                        catalog
                        &&
                        Array.isArray(catalog)
                        &&
                        <tbody id="tracks-tbody">
                            {
                                !catalog.length
                                &&
                                !uploading
                                &&
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center'}} >
                                        <p className="no-items-message-container"> You don&apos;t have any Tracks uploaded yet.<span> Click the icon <FaCloudUploadAlt /> to start building your catalog</span></p>
                                    </td>
                                </tr>
                            }
                            {
                                uploading
                                &&
                                uploadingTrackNames.map(
                                    track => (
                                        <tr key={track}>
                                            <td id="track-row-play-icon">
                                                <div className="play-background">
                                                    <AiOutlineLoading className='loading-icon' size={16} />
                                                </div>
                                            </td>
                                            <td style={{ fontStyle: 'italic' }}>{track}</td>
                                            <td></td>
                                            <td></td>
                                            <td><CiMenuKebab id="menu-icon" color="#545b69" /></td>
                                        </tr>
                                    )
                                )
                                // <>

                                // </>

                            }
                            {stateUpdated
                                &&
                                catalog.toReversed().map(
                                    track => (
                                        <tr key={track.id}
                                            className={`catalog-track-row ${activeTrackId == track.id ? 'active-track' : ''}`} id={track.id} >
                                            <td id="track-row-play-icon">
                                                <div className="play-background">
                                                    <PlayIcon size={16}
                                                        onClick={() => {
                                                            handleTrackPlay(track.filePath, track.title)
                                                            setActiveTrackId(track.id)
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td>{track.title}</td>
                                            <td>{formatSecsToMins(track.duration)}</td>
                                            <td>{formatUploaded(track.createdAt)}</td>
                                            <td><CiMenuKebab id="menu-icon" color="#545b69" onClick={(e) => openTrackMenu(e, track.id, track.title)} /></td>
                                        </tr>
                                    ))}
                        </tbody>
                    }

                </table>



                {/* AUDIOPLAYER */}
                {
                    showPlayer
                    &&
                    <div className="audio-player-container">
                        <div className="title-x-container">
                            <span id="audio-player-track-title">{trackTitle}</span>
                            <span className="close-audio-player-x" onClick={toggleShowPlayer}><XIcon size={20} /></span>
                        </div>
                        <div id="audio-player" style={{ display: showPlayer ? 'block' : 'none' }}>
                            <AudioPlayer audioUrl={audioUrl} />
                        </div>
                    </div>
                }
            </div>

            {/* OPTIONS MENU hidden component */}
            <TrackMenu
                handleDeleteTrack={handleDeleteTrack}
                trackId={trackId}
                trackTitle={trackTitle}
                showMenu={showMenu}
                menuRef={menuRef}
                x={x}
                y={y}
            />
        </div>
    )
}

//Upload Button
function TrackUploadButton({ handleUploadTracks, uploading }) {
    const hiddenInputRef = useRef(null)
    const handleClick = () => {
        if (hiddenInputRef.current) {
            hiddenInputRef.current.click();
        }
    }

    if (!uploading) return (
        <div>
            <input
                type="file"
                accept=".wav,.mp3"
                multiple
                onChange={handleUploadTracks}
                ref={hiddenInputRef}
                style={{ display: 'none' }}
            />
            <button onClick={handleClick} className="upload-icon">
                <span>UPLOAD TRACKS</span>
                <span>
                    <FaCloudUploadAlt size={20} />
                </span>
            </button>
        </div>
    )
}

//Track Row Menu
function TrackMenu({ trackId, trackTitle, x, y, menuRef, showMenu, handleDeleteTrack }) {
    const { setModalContent, closeModal } = useModal()

    return (
        <div className="options-container"
            style={{ display: showMenu ? 'flex' : 'none', position: 'absolute', top: y, left: x }}
            ref={menuRef}
        >
            <div
                style={{ cursor: 'pointer' }}
                onClick={() => setModalContent(<RenameModal id={trackId} title={trackTitle} type={'Track'} closeModal={closeModal} />)}
            >
                <RxCursorText />Rename
            </div>
            <div
                style={{ color: '#e22847', cursor: 'pointer' }}
                onClick={() => handleDeleteTrack(trackId)}>
                <RiDeleteBin6Line />
                Delete
            </div>
        </div>
    )
}
