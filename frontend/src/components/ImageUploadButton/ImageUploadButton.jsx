import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCloudUploadAlt } from 'react-icons/fa';
import { thunkUploadImages } from "../../store/images";
import { AiOutlineLoading } from "react-icons/ai";
import '../../index.css'

export default function ImageUploadButton() {
    const user = useSelector(state => state.session.user)

    const dispatch = useDispatch()
    const [uploading, setUploading] = useState()

    const handleUploadImages = async e => {
        const files = e.target.files
        if (files.length >= 1) {
            setUploading(true)
            const res = await dispatch(thunkUploadImages(files, user.id));
            if (res.ok) setUploading(false)
        }
    }

    const hiddenInputRef = useRef(null)

    const handleClick = () => {
        if (hiddenInputRef.current) {
            hiddenInputRef.current.click();
        }
    }
    if(uploading)
        return (
            // <div style={{ textAlign: 'center', color:'gray' }}>
            //     <AiOutlineLoading className='loading-icon' /> Uploading...
            // </div>
            <div>
            <input
                type="file"
                accept=".jpg,.png,.webp"
                multiple
                onChange={handleUploadImages}
                ref={hiddenInputRef}
                style={{ display: 'none' }}
            />

            <button onClick={handleClick} className="add-tracks-button">
                <span>UPLOADING...</span>
                <AiOutlineLoading className='loading-icon' size={30}/>
            </button>


        </div>
    )
    if(!uploading)
    return (
        <div>
            <input
                type="file"
                accept=".jpg,.png,.webp"
                multiple
                onChange={handleUploadImages}
                ref={hiddenInputRef}
                style={{ display: 'none' }}
            />

            <button onClick={handleClick} className="add-tracks-button">
                <span>UPLOAD IMAGES</span>
                <FaCloudUploadAlt size={30} className="colored" />
            </button>


        </div>
    )

}
