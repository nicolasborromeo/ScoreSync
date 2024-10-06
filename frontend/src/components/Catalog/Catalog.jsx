import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetUserTracks } from "../../store/tracks"
import AudioPlayer from "../AudioPlayer"
import { FaPlay } from "react-icons/fa6";
import { FaCloudUploadAlt } from 'react-icons/fa';
import { RiDeleteBin6Line } from "react-icons/ri";
import './Catalog.css'


export default function Catalog() {
    const user = useSelector(state => state.session.user)
    const catalog = useSelector(state => state.catalog.userTracks)
    const dispatch = useDispatch()

    //State variables
    // const [tracksToUpload, setTracksToUpload] = useState([])
    const [errors, setErrors] = useState([])

    //Thunk operations
    useEffect(() => {
        dispatch(thunkGetUserTracks())
    }, [user, dispatch])

    const updateTracksToUpload = async e => {
        const files = e.target.files
        if (files.length >= 1) {
            setErrors([]);
            const res = await dispatch(thunkUploadTracks(files, user.id));
            if (res.ok) window.alert('Uploading your tracks');
            else {
                const data = await res.json();
                if (data?.errors) setErrors(data.errors);
            }
        }
    }

    //Table and Tracks functions
    const handleTrackPlay = () => {
        console.log('open a bottom player')
    }
    const handleDeleteTrack = () => {
        console.log('I want to delete this track from the db and AWS')
    }

    const formatUploaded = (createdAt) => {
        const date = createdAt.split('T')[0]
        const dateArray = date.split('-')
        return dateArray.toReversed().join('/')
    }



    return (
        <>
            <h1>Catalog</h1>
            <TrackUploadButton updateTracksToUpload={updateTracksToUpload} />
            <table className="tracks-table">
                <thead>
                    <tr>
                        <th></th><th>Name</th><th>Duration</th><th>Uploaded</th><th>Rm</th>
                    </tr>
                </thead>
                <tbody>
                    {catalog?.map(track => (
                        <tr key={track.id} className="catalog-track-row">
                            <td><FaPlay onClick={handleTrackPlay} /></td>
                            <td>{track.title}</td>
                            <td>{track.duration}</td>
                            <td>{formatUploaded(track.createdAt)}</td>
                            <td><RiDeleteBin6Line onClick={handleDeleteTrack} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* <AudioPlayer audioUrl={'https://my-score-sync-bucket.s3.us-west-1.amazonaws.com/Nico+Borromeo_Cyrillic+Magic.wav'}/> */}

        </>
    )
}

function TrackUploadButton({ updateTracksToUpload }) {
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
                onChange={updateTracksToUpload}
                ref={hiddenInputRef}
                style={{ display: 'none' }} />
            <button onClick={handleClick}
                style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer'
                }}>
                Upload Tracks:
                <FaCloudUploadAlt size={30} />
            </button>
        </div>

    )

}
