import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCloudUploadAlt } from 'react-icons/fa';
import { thunkUploadImages } from "../../store/images";

export default function ImageUploadButton() {
    const user = useSelector(state => state.session.user)
    console.log('user in imageuploadbutton: ', user)
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

    return (
        <div>
            <input
                type="file"
                accept=".jpg,.png"
                multiple
                onChange={handleUploadImages}
                ref={hiddenInputRef}
                style={{ display: 'none' }}
            />

            <button onClick={handleClick} className="upload-tracks-icon">
                UPLOAD IMAGES
                <FaCloudUploadAlt size={30} className="colored" />
            </button>
        </div>
    )

}
