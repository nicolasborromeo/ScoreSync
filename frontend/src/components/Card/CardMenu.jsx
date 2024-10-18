import { useModal } from "../../context/Modal"
import CardTitleModal from "./CardTitleModal"
import { thunkDeleteCard } from "../../store/cards"
import { useDispatch } from "react-redux"
import { RxCursorText } from "react-icons/rx";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function CardMenu({ cardId, cardTitle, x, y, menuRef, showMenu, setShowMenu }) {
    const dispatch = useDispatch()
    const { setModalContent, closeModal } = useModal()

    const handleDeleteCard = (cardId) => {
        dispatch(thunkDeleteCard(cardId)).then(()=> setShowMenu(false))
    }

    return (
        <div className="track-options-container"
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
        </div>
    )


}

// function TrackMenu({  handleDeleteTrack }) {
