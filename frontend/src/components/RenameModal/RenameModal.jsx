import { useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { thunkUpdateImageName } from '../../store/images';
import { thunkUpdateTrackTitle } from '../../store/tracks';
import './RenameModal.css'

export default function RenameModal({ id, title, type, closeModal }) {
    const [newTitle, setNewTitle] = useState(title)
    const [disabled, setDisabled] = useState()
    const dispatch = useDispatch()

    useEffect(() => {
        if (newTitle.length > 2) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [newTitle])

    const handleUpdateTitle = async (id) => {
        if (newTitle !== '') {
            if (type === 'Track') dispatch(thunkUpdateTrackTitle(id, newTitle)).then(() => closeModal())
            if (type === 'Image') dispatch(thunkUpdateImageName(id, newTitle)).then(() => closeModal())
        }
    }

    return (
        <div id="title-modal-content">
            <h4>Rename {`${type}`}</h4>
            <fieldset>
                <legend>{`${type}`} name</legend>
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
            </fieldset>
            <div className="title-modal-buttons">
                <button id="title-modal-cancel-button" onClick={closeModal}>CANCEL</button>
                <button id="ok-button" onClick={() => handleUpdateTitle(id)} disabled={disabled}>RENAME</button>
            </div>
        </div>
    )
}
