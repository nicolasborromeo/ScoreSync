import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { thunkGetCurrentCard, thunkUpdateCard } from "../../store/cards"
import CardAudioPlayer from "./CardAudioPlayer"
import CardTrackList from "./CardTrackList"
import ImagesModal from "./ImagesModal"
import ToolBox from "../ToolBox"
import './CardDetails.css'
import { useModal } from "../../context/Modal"
import TracksModal from "./TracksModal"
import { BsPlusSquareDotted } from "react-icons/bs";
import { isEmpty } from "../../utils/utils"


export default function CardDetails() {
    const dispatch = useDispatch()
    let { cardId } = useParams()
    const { setModalContent, closeModal } = useModal()
    const card = useSelector(state => state.cards.currentCard)

    const [displayInfo, setDisplayInfo] = useState({})
    const [externalLinks, setExternalLinks] = useState({})
    const [trackList, setTrackList] = useState([])
    const [userLoaded, setUserLoaded] = useState(false)
    const [audioUrl, setAudioUrl] = useState('')
    const [trackTitle, setTrackTitle] = useState()

    //getting the current card:
    useEffect(() => {
        dispatch(thunkGetCurrentCard(cardId))
    }, [dispatch, cardId])
    //setting up users data:
    useEffect(() => {
        if (card && card.User) {
            setDisplayInfo(card.User.UserDisplayInfo)
            setExternalLinks(card.User.ExternalLinks)
            setUserLoaded(true)
        } else {
            console.log('NO USER', card)
        }
    }, [dispatch, card, setDisplayInfo, setExternalLinks, userLoaded])
    //setting up tracks data:
    useEffect(() => {
        if (card && card.Tracks.length) {
            setTrackList(card.Tracks)
            setAudioUrl(card.Tracks[0].filePath)
            setTrackTitle(card.Tracks[0].title)
        }
    }, [card, trackList])

    const handlePreview = () => {
        //Redirect to preview page
    }

    //State variables for card colors:
    const [primaryBackground, setPrimaryBackground] = useState('#141418')
    const [secondaryBackground, setSecondaryBackground] = useState(null)
    const [primaryTextColor, setPrimaryTextColor] = useState()
    const [secondaryTextColor, setSecondaryTextColor] = useState()
    const [waveformColor, setWaveformColor] = useState()


    if (userLoaded) return (
        <div id="background-for-app-in-card-details" style={{ backgroundColor: primaryBackground }}>

            <div id="card-details-container">
                <section id="card-banner">
                    <div className="image-container" onClick={() => setModalContent(<ImagesModal cardId={cardId} type={'banner'} closeModal={closeModal} />)}>
                        <img src={card.Banner.url || `/defaultBanner.jpg`} />
                        <i className="pencil-icon">✏️</i>
                    </div>
                </section>
                <section id="card-user-info" >
                    <div id="name-and-title">
                        <h2 id="users-name">{displayInfo.name}</h2>
                        <EditableField
                            cssId={'job-title'}
                            value={card.customJobTitle ? card.customJobTitle : displayInfo.jobTitle}
                            column={'customJobTitle'}
                        />
                    </div>
                    <div id="contact-info">
                        <p id="email">{displayInfo.email}</p>
                        <p id="phone">{displayInfo.phone}</p>
                        <p id="website">{displayInfo.website?.split('//')[1]}</p>
                    </div>
                </section>
                <section id="card-audioplayer">
                    <div>
                        <EditableField
                            cssId={'card-title'}
                            value={card.title ? card.title : 'Your Playlist Title...'}
                            column={'title'}
                        />

                        <EditableField
                            cssId={'card-description'}
                            value={card.description ? card.description : 'Your Playlist Description...'}
                            column={'description'}
                        />
                    </div>
                    <div>
                        {card.Tracks.length ? (<p>Now playing: {trackTitle}</p>) : (<p id="card-detail-no-tracks-warning">No Tracks<br></br>Get started by adding tracks</p>)}

                        <CardAudioPlayer audioUrl={audioUrl} />

                        <CardTrackList trackList={trackList} setTrackList={setTrackList} cardId={cardId} setAudioUrl={setAudioUrl} setTrackTitle={setTrackTitle} />

                        <button className="add-tracks-button" onClick={() => setModalContent(<TracksModal cardId={cardId} />)}>ADD TRACKS <BsPlusSquareDotted size={30} /></button>

                    </div>
                    <div id="card-download-option"></div>
                </section>
                <section style={{ backgroundColor: secondaryBackground }}>
                    <div id="card-bio">
                        <div id="card-headshot-container">
                            <div className="image-container" onClick={() => setModalContent(<ImagesModal cardId={cardId} type={'headshot'} closeModal={closeModal} />)}>
                                <img src={card.Headshot.url || '/defaultHeadshot.jpg'} />
                                <i className="pencil-icon">✏️</i>
                            </div>
                        </div>

                        <EditableField
                            cssId={`card-bio-text`}
                            value={card.customBio ? card.customBio : displayInfo.bio}
                            column={'customBio'}
                            type="textarea"
                        />
                    </div>
                    <div id="card-contact-info">
                        <p>{externalLinks[0].url}</p>
                    </div>

                    <button onClick={handlePreview}>PREVIEW & PUBLISH</button>
                </section>

            </div>

            <ToolBox
                primaryBackground={primaryBackground}
                setPrimaryBackground={setPrimaryBackground}

                secondaryBackground={secondaryBackground}
                setSecondaryBackground={setSecondaryBackground}

                primaryTextColor={primaryTextColor}
                setPrimaryTextColor={setPrimaryTextColor}

                secondaryTextColor={secondaryTextColor}
                setSecondaryTextColor={setSecondaryTextColor}

                waveformColor={waveformColor}
                setWaveformColor={setWaveformColor}

            />
        </div>
    )
}



//EDITABLE FIELD COMPONENT

function EditableField({ value, cssId, column, type = 'p' }) {
    const dispatch = useDispatch()
    const cardId = useSelector(state => state.cards.currentCard.id)
    const [editEnabled, setEditEnabled] = useState(false)
    const [editValue, setEditValue] = useState(value)

    const handleSave = () => {
        if (!isEmpty(editValue)) dispatch(thunkUpdateCard(cardId, column, editValue))
        setEditEnabled(false)
    }

    //reset the value on the input field to the one clicked
    useEffect(() => {
        setEditValue(value)
    }, [editEnabled, value])

    //switch return and behaviour depending on the type (p, textarea)
    if (type === 'p') return editEnabled ?
        (
            <input
                className="editable-field-input"
                value={editValue}
                autoFocus
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => setEditEnabled(false)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave()
                }}
            />
        )
        :
        (
            <div className="editable-field-container">
                <p id={`${cssId}`} className="editable-field" onClick={() => setEditEnabled(true)}>
                    {value}
                </p>
                <i onClick={() => setEditEnabled(true)} className="pencil-icon-on-field">✏️</i>
            </div>

        )

    if (type === 'textarea') return editEnabled ?
        (
            <>
                <textarea
                    className="editable-field-textarea"
                    value={editValue}
                    autoFocus
                    onChange={(e) => setEditValue(e.target.value)}
                />
                <button onClick={handleSave}>Confirm</button>
                <button onClick={() => setEditEnabled(false)}>Cancel</button>

            </>
        ) : (
            <>
                <div id={`${cssId}`} className="editable-field" onClick={() => setEditEnabled(true)}>
                    {value.split('\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                    ))}
                </div>
            </>
        )

}
