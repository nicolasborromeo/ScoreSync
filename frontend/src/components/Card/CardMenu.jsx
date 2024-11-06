import { useModal } from "../../context/Modal"
import CardTitleModal from "./CardTitleModal"
import { thunkDeleteCard, thunkUnPublishCard } from "../../store/cards"
import { useDispatch } from "react-redux"
import { RxCursorText } from "react-icons/rx";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { MdOutlineUnpublished } from "react-icons/md";



export default function CardMenu({ cardId, cardTitle, x, y, menuRef, showMenu, setShowMenu }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { setModalContent, closeModal } = useModal()

    const handleDeleteCard = (cardId) => {
        dispatch(thunkDeleteCard(cardId)).then(()=> setShowMenu(false))
    }

    const handleUnPublishCard = (cardId) => {
        dispatch(thunkUnPublishCard(cardId))
        .then(()=> setShowMenu(false))
        .then(()=> window.alert('Your card is now private'))
    }

    return (
        <div className="options-container"
            style={{ display: showMenu ? 'flex' : 'none', position: 'absolute', top: y, left: x }}
            ref={menuRef}
        >
            <div
                style={{ cursor: 'pointer' }}
                onClick={() => setModalContent(<CardTitleModal action={'rename'} cardTitle={cardTitle} cardId={cardId} closeModal={closeModal}/>)}
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
            <div
                style={{ color: 'lightgray', cursor: 'pointer' }}
                onClick={()=>handleUnPublishCard(cardId)}>
                <MdOutlineUnpublished />
                UnPublish
            </div>
        </div>
    )


}

// function TrackMenu({  handleDeleteTrack }) {
