import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { thunkGetUserTracks } from "../../store/tracks"
import { thunkAddTracksToCard } from "../../store/cards"
import { useModal } from "../../context/Modal"
import TrackUploadButton from "../Catalog/TrackUploadButton"

import { BsPlusSquareDotted } from "react-icons/bs";



export default function TracksModal({ cardId }) {
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const catalog = useSelector(state => state.catalog.userTracks)
    const [loadedTracks, setLoadedTracks] = useState(false)
    const [selectedTracks, setSelectedTracks] = useState({})
    const [disabled, setDisabled] = useState(true)
    const multipleTracks = Object.keys(selectedTracks).length >= 2

    useEffect(() => {
        dispatch(thunkGetUserTracks()).then(() => setLoadedTracks(true))
    }, [dispatch])

    useEffect(() => {
        if (Object.keys(selectedTracks).length) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }

    }, [disabled, selectedTracks])

    const handleSelectedTrack = (e, track) => {
        let selected = e.target.checked
        if (selected) {
            setSelectedTracks((prev) => {
                let updatedSelection = { ...prev }
                updatedSelection[track.id] = track
                return updatedSelection
            })
        } else {
            setSelectedTracks((prev) => {
                let updatedSelection = { ...prev }
                delete updatedSelection[track.id]
                return updatedSelection
            })
        }
    }

    const handleAddTracks = () => {
        dispatch(thunkAddTracksToCard(cardId, selectedTracks)).then(() => closeModal())
    }

    if (loadedTracks) return (
        <div id="trackmodal-content">
            <div id="tracksmodal-search-column">
                <span>Search</span>
                <input type="search"/>
            </div>
            <div id="tracksmodal-tracks-colum">
                <p>Select the tracks you want to add or upload new ones:</p>
                <div id="tracksmodal-track-list">
                {
                    catalog?.map(track => (
                        <div key={track.id} id="tracksmodal-track-row">
                            <input type="checkbox" onChange={(e) => handleSelectedTrack(e, track)} />
                            <p>{track.title}</p>
                        </div>
                    ))
                }
                </div>
                <button
                    className="add-tracks-button"
                    onClick={handleAddTracks}
                    disabled={disabled}
                >
                    ADD { multipleTracks ? 'TRACKS' : 'TRACK'}
                    <BsPlusSquareDotted size={30}/>
                </button>
                <TrackUploadButton />
            </div>
        </div>
    )
}
