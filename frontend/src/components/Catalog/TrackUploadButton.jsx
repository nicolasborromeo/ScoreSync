//Upload Button
import { FaCloudUploadAlt } from 'react-icons/fa';
import { AiOutlineLoading } from "react-icons/ai";

import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkUploadTracks } from '../../store/tracks';

export default function TrackUploadButton() {
    const userId = useSelector(state => state.session.user.id)
    const [uploading, setUploading] = useState()
    const dispatch = useDispatch()
    const handleUploadTracks = async e => {
        const files = e.target.files

        if (files.length >= 1) {
            setUploading(true)
            const res = await dispatch(thunkUploadTracks(files, userId));
            if (res.ok) setUploading(false)
        }
    }


    const hiddenInputRef = useRef(null)
    const handleClick = () => {
        if (hiddenInputRef.current) {
            hiddenInputRef.current.click();
        }
    }
    if (uploading) {
        return (
            <button className="add-tracks-button">
                UPLOADING...
                <AiOutlineLoading className='loading-icon' size={25}/>
            </button>
        )
    } else {
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
                // className="upload-tracks-icon"
                className="add-tracks-button"
                >
                    UPLOAD TRACKS
                    <FaCloudUploadAlt size={25} className="colored" />
                </button>
            </div>
        )
    }
}
