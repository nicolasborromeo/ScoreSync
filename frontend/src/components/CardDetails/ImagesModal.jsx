
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { thunkGetUserImages } from '../../store/images';
import { thunkUpdateCardImage } from '../../store/cards';
import { FaCloudUploadAlt } from 'react-icons/fa';
import '../Images/Images.css'
import ImageUploadButton from '../ImageUploadButton';

export default function ImagesModal({ cardId, type, closeModal }) {
    const user = useSelector(state => state.session.user)
    const images = useSelector(state => state.images.userImages || [])
    const dispatch = useDispatch()
    const [stateUpdated, setStateUpdated] = useState(false)
    //Thunk operations
    useEffect(() => {
        dispatch(thunkGetUserImages()).then(() => {
            setStateUpdated(true)
        })
    }, [user, dispatch])

    const handleUpdatePicture = (imgId) => {
        dispatch(thunkUpdateCardImage(cardId, type, imgId)).then(() => closeModal())
    }

    return (
        <div id="images-modal-container">

            {
                images?.length
                &&
                stateUpdated
                &&
                <div className="images-modal-grid">
                    {images?.reverse().map(img => (
                        <div className="image-item" key={img.id} onDoubleClick={() => handleUpdatePicture(img.id)} style={{ cursor: 'pointer' }}>
                            <img src={img.url} alt={img.name} />
                            <p>{img.name}</p>
                        </div>
                    ))}
                </div>
            }
            {
                !images.length
                &&
                <>
                    <div style={{ textAlign: 'center', color: 'white', lineHeight: '2em' }}>
                        You don&apos;t have any uploaded images yet. <br />Click the icon <FaCloudUploadAlt /> to start building your catalog
                    </div>

                </>
            }
            <div id="images-modal-button-container">
                <ImageUploadButton />
            </div>
        </div>
    )
}
