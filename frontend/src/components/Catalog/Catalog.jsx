import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useModal } from "../../context/Modal";

import { thunkGetUserTracks, thunkDeleteTrack, thunkUploadTracks, thunkUpdateTrackTitle } from "../../store/tracks"
import { formatUploaded, formatSecsToMins } from "../../utils/utils";

import AudioPlayer from "../AudioPlayer"

import { FaPlay } from "react-icons/fa6";
import { FaCloudUploadAlt } from 'react-icons/fa';
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineLoading } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";
import { RxCursorText } from "react-icons/rx";

import './Catalog.css'




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
    const [uploading, setUploading] = useState()
    const [audioUrl, setAudioUrl] = useState()
    const [showPlayer, setShowPlayer] = useState(false)

    //Thunk operations
    useEffect(() => {
        dispatch(thunkGetUserTracks()).then(() => {
            setStateUpdated(true)
        })
    }, [user, dispatch])

    const handleUploadTracks = async e => {
        const files = e.target.files

        if (files.length >= 1) {
            setUploading(true)
            const res = await dispatch(thunkUploadTracks(files, user.id));
            if (res.ok) setUploading(false)
        }
    }

    const handleDeleteTrack = (trackId) => {
        dispatch(thunkDeleteTrack(trackId))
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
        setX(e.clientX -80)
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
                <p>Catalog</p>
            </div>

            <table className="tracks-table">
                <thead><tr><th></th><th>Name</th><th>Duration</th><th>Uploaded</th><th></th></tr></thead>
                {
                catalog?.length >= 1
                &&
                Array.isArray(catalog)
                &&
                    <tbody id="tracks-tbody">
                        {stateUpdated
                        &&
                        catalog.map(
                            track => (
                            <tr key={track.id} className={`catalog-track-row ${activeTrackId == track.id ? 'active-track': ''}`} id={track.id} onClick={() => setActiveTrackId(track.id)}>
                                <td><FaPlay style={{ cursor: 'pointer' }} onClick={() => handleTrackPlay(track.filePath, track.title)} /></td>
                                <td>{track.title}</td>
                                <td>{formatSecsToMins(track.duration)}</td>
                                <td>{formatUploaded(track.createdAt)}</td>
                                <td><CiMenuKebab id="track-menu-icon" onClick={(e) => openTrackMenu(e, track.id, track.title)} /></td>
                            </tr>
                        ))}
                    </tbody>
                }

                {
                !catalog.length
                &&
                    <>
                        <tbody>
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>
                                    You don&apos;t have any uploaded tracks yet. Click the icon <FaCloudUploadAlt /> to start building your catalog
                                </td>
                            </tr>
                        </tbody>
                    </>
                }

                {
                uploading
                &&
                    <td colSpan="5" style={{ textAlign: 'center', borderBottom: '1px solid #eeeeee' }}>
                        <AiOutlineLoading className='loading-icon' /> Uploading...
                    </td>

                }

            </table>

            <TrackUploadButton handleUploadTracks={handleUploadTracks} />

            {/* AUDIOPLAYER */}
           {
           showPlayer
           &&
           <div className="audio-player-container">
            <div className="title-x-container">
                 <span id="audio-player-track-title">{trackTitle}</span>
                <span className="close-audio-player-x" onClick={toggleShowPlayer}>x</span>
            </div>
                <div id="audio-player" style={{ display: showPlayer ? 'block' : 'none' }}>
                    <AudioPlayer audioUrl={audioUrl} />
                </div>
            </div>
           }

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
function TrackUploadButton({ handleUploadTracks }) {
    const hiddenInputRef = useRef(null)
    const handleClick = () => {
        if (hiddenInputRef.current) {
            hiddenInputRef.current.click();
        }
    }
    return (
        <div>
            <input
                type="file"
                accept=".wav,.mp3"
                multiple
                onChange={handleUploadTracks}
                ref={hiddenInputRef}
                style={{ display: 'none' }}
            />
            <button onClick={handleClick} className="upload-tracks-icon">
                UPLOAD TRACKS
                <FaCloudUploadAlt size={30} className="colored" />
            </button>
        </div>
    )
}

//Track Row Menu
function TrackMenu({ trackId, trackTitle, x, y, menuRef, showMenu, handleDeleteTrack }) {
    const { setModalContent, closeModal } = useModal()

    return (
        <div className="track-options-container"
            style={{ display: showMenu ? 'flex' : 'none', position: 'absolute', top: y, left: x }}
            ref={menuRef}
        >
            <div
                style={{ cursor: 'pointer' }}
                onClick={() => setModalContent(<RenameModal trackId={trackId} trackTitle={trackTitle} closeModal={closeModal} />)}
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

//Rename Track Modal
function RenameModal({ trackId, trackTitle, closeModal }) {
    const [title, setTitle] = useState(trackTitle)
    const [disabled, setDisabled] = useState()
    const dispatch = useDispatch()

    useEffect(() => {
        if (title.length > 2) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [title])

    const handleUpdateTitle = async (trackId) => {
        if (title !== '') dispatch(thunkUpdateTrackTitle(trackId, title)).then(() => closeModal())
    }
    return (
        <div id="rename-track-modal-content">
            <h4>Rename Track</h4>
            <fieldset>
                <legend>Track name</legend>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </fieldset>
            <div className="cancel-rename-buttons">
                <button id="rename-modal-cancel-button" onClick={closeModal}>CANCEL</button>
                <button id="rename-button" onClick={() => handleUpdateTitle(trackId)} disabled={disabled}>RENAME</button>
            </div>
        </div>
    )
}
