import { useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { useModal } from "../../context/Modal"
import { thunkCreateNewCard, thunkRenameCard} from "../../store/cards"

export default function CardTitleModal ({navigate, action, cardTitle = '', cardId}) {
    const {closeModal } = useModal()
    const [newTitle, setNewTitle] = useState(cardTitle)
    const [disabled, setDisabled] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        if (newTitle.length > 2) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [newTitle])

    const handleNewCard = () => {
        dispatch(thunkCreateNewCard(newTitle))
        .then((res)=> {
            navigate(`/cards/${res.id}`)
        })
        .then(()=>closeModal())
    }

    const handleRenameCard = () => {
        dispatch(thunkRenameCard(cardId, newTitle)).then(()=> closeModal())
    }


    return (
        <div id="create-card-modal-content">
            <h4>Enter a title for your Card </h4>
            <fieldset>
                <legend>Card title: </legend>
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
            </fieldset>
            <div className="cancel-create-buttons">
                <button id="create-card-modal-cancel-button" onClick={closeModal}>CANCEL</button>
                {action === 'create' && <button id="create-button" onClick={handleNewCard} disabled={disabled} style={disabled? {cursor:'not-allowed'} : {cursor:'pointer'}}>CREATE</button>}
                {action === 'rename' && <button id="create-button" onClick={handleRenameCard} disabled={disabled} style={disabled? {cursor:'not-allowed'} : {cursor:'pointer'}}>RENAME</button>}
            </div>
        </div>
    )
}
