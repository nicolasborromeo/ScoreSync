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
    const [showPlayer, setShowPlayer] = useState(true)

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
    const handleTrackPlay = (url) => {
        console.log('open a bottom player')
        console.log(url)
        setAudioUrl(url)
    }

    const toggleShowPlayer = () => {
        console.log('toggle')
        if (showPlayer) setShowPlayer(false)
        else setShowPlayer(true)
    }

    //Track Options Menu
    const openTrackMenu = (e, trackId, trackTitle) => {
        e.stopPropagation()
        setX(e.clientX + 10)
        setY(e.clientY + 10)
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
        <>
            <h1>Catalog</h1>
            <TrackUploadButton handleUploadTracks={handleUploadTracks} />
            <table className="tracks-table">
                <thead>
                    <tr>
                        <th></th><th>Name</th><th>Duration</th><th>Uploaded</th><th>Rm</th>
                    </tr>
                </thead>
                {catalog?.length >= 1 &&
                    Array.isArray(catalog) &&
                    <tbody>
                        {stateUpdated && catalog.map(track => (
                            <tr key={track.id} className="catalog-track-row">
                                <td><FaPlay style={{ cursor: 'pointer' }} onClick={() => handleTrackPlay(track.filePath)} /></td>
                                <td>{track.title}</td>
                                <td>{formatSecsToMins(track.duration)}</td>
                                <td>{formatUploaded(track.createdAt)}</td>
                                <td><CiMenuKebab style={{ cursor: 'pointer' }} onClick={(e) => openTrackMenu(e, track.id, track.title)} /></td>
                            </tr>
                        ))}
                    </tbody>
                }
                {!catalog.length &&
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
                {uploading &&
                    <td colSpan="5" style={{ textAlign: 'center', borderBottom: '1px solid #eeeeee' }}>
                        <AiOutlineLoading className='loading-icon' /> Uploading...
                    </td>

                }
            </table>
            <div className="audio-player-container">
                <span style={{ justifySelf: 'flex-end', width: '100%', cursor: 'pointer' }} onClick={toggleShowPlayer}>x</span>
                <div id="audio-player" style={{ display: showPlayer ? 'block' : 'none' }}>
                    <AudioPlayer audioUrl={audioUrl} />
                </div>
            </div>
            <div
                className="track-options-menu-container"
            >
            </div>
            <TrackOptionsMenu
                handleDeleteTrack={handleDeleteTrack}
                trackId={trackId}
                trackTitle={trackTitle}
                showMenu={showMenu}
                menuRef={menuRef}
                x={x}
                y={y}
            />
        </>
    )
}

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

            <button onClick={handleClick}
                style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer'
                }}>
                {/* Upload Track s: */}
                <FaCloudUploadAlt size={30} />
            </button>
        </div>
    )

}

function TrackOptionsMenu({ trackId, trackTitle, x, y, menuRef, showMenu, handleDeleteTrack }) {
    const { setModalContent, closeModal } = useModal()

    return (
        <div className="track-options-container"
            style={{ display: showMenu ? 'block' : 'none', position: 'absolute', top: y, left: x }}
            ref={menuRef}
        >
            <div
                style={{ cursor: 'pointer' }}
                onClick={()=>setModalContent(<RenameModal trackId={trackId} trackTitle={trackTitle} closeModal={closeModal}/>)}
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

function RenameModal({trackId, trackTitle, closeModal}) {
    const [title, setTitle] = useState(trackTitle)
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState()
    const dispatch = useDispatch()

    useEffect(()=> {
        if(title.length > 2) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [title])

    const handleUpdateTitle = async (trackId) => {
        if (title !== '') dispatch(thunkUpdateTrackTitle(trackId, title)).then(()=> closeModal())
    }

    return (
        <div>
            <h3>Rename Track</h3>
            <fieldset >
                <legend>Track name</legend>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    />
            </fieldset>
            <div className="cancel-rename-buttons">
                <button onClick={closeModal}>CANCEL</button>
                <button onClick={()=> handleUpdateTitle(trackId)} disabled={disabled}>RENAME</button>
            </div>
        </div>
    )
}
