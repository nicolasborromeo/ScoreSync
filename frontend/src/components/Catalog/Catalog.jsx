import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetUserTracks, thunkDeleteTrack, thunkUploadTracks } from "../../store/tracks"
import AudioPlayer from "../AudioPlayer"
import { FaPlay } from "react-icons/fa6";
import { FaCloudUploadAlt } from 'react-icons/fa';
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineLoading } from "react-icons/ai";

import './Catalog.css'



export default function Catalog() {
    const user = useSelector(state => state.session.user)
    const catalog = useSelector(state => state.catalog.userTracks)
    const dispatch = useDispatch()


    //State variables
    const [stateUpdated, setStateUpdated] = useState()
    const [uploading, setUploading] = useState()

    const [errors, setErrors] = useState([])

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
            setErrors([]);
            const res = await dispatch(thunkUploadTracks(files, user.id));
            if (res.ok) {
                // window.alert('Uploading your tracks')
                setUploading(false)
            }
            else {
                const data = await res.json();
                if (data?.errors) setErrors(data.errors);
            }
        }
    }

    const handleDeleteTrack = (trackId) => {
        dispatch(thunkDeleteTrack(trackId))
    }

    //Table and Tracks functions
    const handleTrackPlay = () => {
        console.log('open a bottom player')
    }

    const formatUploaded = (createdAt) => {
        const date = createdAt.split('T')[0]
        const dateArray = date.split('-')
        return dateArray.toReversed().join('/')
    }



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
                <tbody>
                    {stateUpdated && catalog.map(track => (
                        <tr key={track.id} className="catalog-track-row">
                            <td><FaPlay onClick={handleTrackPlay} /></td>
                            <td>{track.title}</td>
                            <td>{track.duration}</td>
                            <td>{formatUploaded(track.createdAt)}</td>
                            <td><RiDeleteBin6Line onClick={() => handleDeleteTrack(track.id)} /></td>
                        </tr>
                    ))}
                </tbody>
                {uploading &&
                    <div>
                        <AiOutlineLoading className='loading-icon' />
                    </div>
                }
            </table>

            {/* <AudioPlayer audioUrl={'https://my-score-sync-bucket.s3.us-west-1.amazonaws.com/Nico+Borromeo_Cyrillic+Magic.wav'}/> */}

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
