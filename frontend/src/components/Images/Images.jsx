import './Images.css'

import { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { thunkGetUserImages, thunkDeleteImage, thunkUploadImages } from '../../store/images';
import { useModal } from "../../context/Modal";

//icons
import { FaCloudUploadAlt } from 'react-icons/fa';
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCursorText } from "react-icons/rx";
import { AiOutlineLoading } from "react-icons/ai";
import { MoreVerticalIcon } from 'lucide-react'

//components
import RenameModal from '../RenameModal';
import ExpandedImage from '../ExpandedImage';
// import Footer from '../Footer'

//return
export default function Images() {
    const { setModalContent, closeModal } = useModal()
    const user = useSelector(state => state.session.user)
    const images = useSelector(state => state.images.userImages)
    const dispatch = useDispatch()
    const [stateUpdated, setStateUpdated] = useState(false)
    const [uploading, setUploading] = useState()

    //Thunk operations
    useEffect(() => {
        dispatch(thunkGetUserImages()).then(() => {
            setStateUpdated(true)
        })
    }, [user, dispatch])


    const handleDeleteImage = (imageId) => {
        dispatch(thunkDeleteImage(imageId))
        setShowMenu(false)
    }


    const handleUploadImages = async e => {
        const files = e.target.files
        if (files.length >= 1) {
            setUploading(true)
            const res = await dispatch(thunkUploadImages(files, user.id));
            if (res.ok) setUploading(false)
        }
    }

    //Image Options Menu
    //States Variables
    const [imageId, setImageId] = useState()
    const [imageName, setImageName] = useState()
    const [x, setX] = useState()
    const [y, setY] = useState()
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef()

    const openImageMenu = (e, id, name) => {
        e.stopPropagation()

        setX(e.clientX)
        setY(e.clientY + 15)
        setImageId(id)
        setImageName(name)
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
        <div id="images-container">

            <div className="page-title-container">
                <div className="page-title-content">
                    <p id="page-title">Images</p>
                    <ImageUploadButton handleUploadImages={handleUploadImages} uploading={uploading} />
                </div>
            </div>

            <div className="image-grid">
                {
                    stateUpdated
                    &&
                    images?.map(img => (
                        <div className="image-item" key={img.id} onClick={() => setModalContent(<ExpandedImage img={img} closeModal={closeModal} />)}>
                            <img src={img.url} alt={img.name} />
                            <div id="name-options-container">
                                <p>{img.name.split('.')[0]}</p>
                                <span>
                                    <MoreVerticalIcon
                                        size={18}
                                        id="menu-icon"
                                        onClick={(e) => openImageMenu(e, img.id, img.name)}
                                    />
                                </span>
                            </div>
                        </div>
                    ))}
                {
                    uploading
                    &&
                    <div style={{ textAlign: 'center', margin: '1em', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1em' }}>
                        <AiOutlineLoading className='loading-icon colored' />
                    </div>
                }
            </div>

            {
                !images?.length
                &&
                <>
                    <p className="no-items-message-container">You don&apos;t have any Images uploaded yet. Click the icon <FaCloudUploadAlt /> to start building your portfolio</p>
                </>
            }

            <ImageMenu
                handleDeleteImage={handleDeleteImage}
                imageId={imageId}
                imageName={imageName}
                showMenu={showMenu}
                menuRef={menuRef}
                x={x}
                y={y}
            />
            {/* <Footer /> */}
        </div>
    )
}


function ImageUploadButton({ handleUploadImages, uploading }) {
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
                accept=".jpg,.png,.webp"
                multiple
                onChange={handleUploadImages}
                ref={hiddenInputRef}
                style={{ display: 'none' }}
            />

            <button onClick={handleClick} className="upload-icon">
                <span>UPLOAD IMAGES</span>
                <span><FaCloudUploadAlt size={20} className="colored" /></span>
            </button>
        </div>
    )

}


function ImageMenu({ imageId, imageName, x, y, menuRef, showMenu, handleDeleteImage }) {
    const { setModalContent, closeModal } = useModal()

    return (
        <div className="options-container"
            style={{ display: showMenu ? 'flex' : 'none', position: 'fixed', top: y, left: x }}
            ref={menuRef}
        >
            <div
                style={{ cursor: 'pointer' }}
                onClick={() => setModalContent(<RenameModal id={imageId} title={imageName} type={'Image'} closeModal={closeModal} />)}
            >
                <RxCursorText />Rename
            </div>
            <div
                style={{ color: '#e22847', cursor: 'pointer' }}
                onClick={() => handleDeleteImage(imageId)}>
                <RiDeleteBin6Line />
                Delete
            </div>
        </div>
    )
}
