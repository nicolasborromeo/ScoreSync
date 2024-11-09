import { useModal } from "../../context/Modal"
import { useToast } from '../../context/ToastContext';
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { thunkDeleteCard, thunkUnPublishCard, thunkPublishCard } from "../../store/cards"

//components
import CardTitleModal from "./CardTitleModal"
//icons
import { CiEdit } from "react-icons/ci";
import { RxCursorText } from "react-icons/rx";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineUnpublished } from "react-icons/md";
import { MdOutlinePublishedWithChanges } from "react-icons/md";

// import { IoMdCloudDone } from "react-icons/io";
// import { MdOutlineCloudOff } from "react-icons/md";


export default function CardMenu({ cardId, cardTitle, isActive, x, y, menuRef, showMenu, setShowMenu }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { addToast } = useToast()
    const { setModalContent, closeModal } = useModal()

    const handleDeleteCard = (cardId) => {
        dispatch(thunkDeleteCard(cardId)).then(() => setShowMenu(false))
    }

    const handleUnPublishCard = (cardId) => {
        if (isActive) dispatch(thunkUnPublishCard(cardId))
            .then(() => setShowMenu(false))
            .then(() => addToast('Your card is now private'))
        if (!isActive) dispatch(thunkPublishCard(cardId))
            .then(() => setShowMenu(false))
            .then(() => addToast('Your card is now public'))
    }

    return (
        <div className="options-container"
            style={{ display: showMenu ? 'flex' : 'none', position: 'absolute', top: y, left: x }}
            ref={menuRef}
        >
            <div
                style={{ cursor: 'pointer' }}
                onClick={() => setModalContent(<CardTitleModal action={'rename'} cardTitle={cardTitle} cardId={cardId} closeModal={closeModal} />)}
            >
                <RxCursorText />Rename
            </div>
            <div
                style={{ color: '#e22847', cursor: 'pointer' }}
                onClick={() => handleDeleteCard(cardId)}>
                <RiDeleteBin6Line />
                Delete
            </div>
            <div
                style={{ color: 'lightgray', cursor: 'pointer' }}
                onClick={() => navigate(`/cards/${cardId}`)}>
                <CiEdit />
                Edit
            </div>
            {
            isActive ? (
                    <div
                        style={{ color: 'lightgray', cursor: 'pointer' }}
                        onClick={() => handleUnPublishCard(cardId)}>
                        <MdOutlineUnpublished />
                        UnPublish
                    </div>
                ) : (
                    <div
                        style={{ color: 'lightgray', cursor: 'pointer' }}
                        onClick={() => handleUnPublishCard(cardId)}>
                        <MdOutlinePublishedWithChanges />
                        Publish
                    </div>
                )
            }
        </div>
    )


}

// function TrackMenu({  handleDeleteTrack }) {
