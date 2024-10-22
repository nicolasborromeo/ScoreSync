//  {
//     //preview returns boolean

//     return <h1>this will be your public card</h1>
// }

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { thunkGetPreviewCard, thunkUpdateCard } from "../../store/cards"
import CardAudioPlayer from "../CardDetails/CardAudioPlayer"
import CardTrackList from "../CardDetails/CardTrackList"
import ImagesModal from "../CardDetails/ImagesModal"
import ToolBox from "../ToolBox"
import '../CardDetails/CardDetails.css'
import { useModal } from "../../context/Modal"
import TracksModal from "../CardDetails/TracksModal"
import { BsPlusSquareDotted } from "react-icons/bs";
import { isEmpty } from "../../utils/utils"


export default function PublicCard({ preview }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let { privateToken } = useParams()
    const card = useSelector(state => state.cards.currentCard)
    const [displayInfo, setDisplayInfo] = useState({})
    const [externalLinks, setExternalLinks] = useState({})
    const [trackList, setTrackList] = useState([])
    const [userLoaded, setUserLoaded] = useState(false)
    const [audioUrl, setAudioUrl] = useState('')
    const [trackTitle, setTrackTitle] = useState()
    const [bio, setBio] = useState()


    //getting the current card:
    useEffect(() => {
        dispatch(thunkGetPreviewCard(privateToken))
    }, [dispatch, privateToken])
    //setting up users data:
    useEffect(() => {
        if (card && card.User) {
            setDisplayInfo(card.User.UserDisplayInfo)
            setExternalLinks(card.User.ExternalLinks)
            card.customBio ? setBio(card.customBio) : setBio(displayInfo.bio || '')
            setUserLoaded(true)
        } else {
            console.log('NO USER', card)
        }
    }, [dispatch, card, setDisplayInfo, setExternalLinks, userLoaded])

    //setting up tracks data:
    useEffect(() => {
        if (card && card?.Tracks?.length) {
            setTrackList(card.Tracks)
            setAudioUrl(card.Tracks[0].filePath)
            setTrackTitle(card.Tracks[0].title)
        }
    }, [card])

    const handleBackToEditing = () => {
        navigate(`/cards/${card.id}`)
    }

    //State variables for card colors and font:
    const [primaryBackground, setPrimaryBackground] = useState('#141418')
    const [secondaryBackground, setSecondaryBackground] = useState('#141418')
    const [primaryTextColor, setPrimaryTextColor] = useState('#ececec')
    const [secondaryTextColor, setSecondaryTextColor] = useState('#b6b6b6')
    const [waveformColor, setWaveformColor] = useState('#eb3578')
    const [secondaryEnabled, setSecondaryEnabled] = useState(true)
    const [fontFamily, setFontFamily] = useState("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif")
    const [fontSize, setFontSize] = useState(16)


    if (userLoaded) return (
        <div id="background-for-app-in-card-details" style={
            secondaryEnabled ?
                { background: `linear-gradient(${primaryBackground} , ${secondaryBackground})` }
                :
                { backgroundColor: primaryBackground }
        }>

            <div id="card-details-container" style={{ fontFamily: fontFamily, fontSize: `${fontSize}px` }}>
                <section id="card-banner">
                    <img src={card.Banner.url || `/defaultBanner.jpg`} />
                    {/* <div className="image-container" onClick={() => setModalContent(<ImagesModal cardId={cardId} type={'banner'} closeModal={closeModal} />)}>
                        <i className="pencil-icon">✏️</i>
                    </div> */}
                </section>

                <section id="card-user-info" >

                    {/* name and jobtitle */}

                    <div id="name-and-title" style={{ color: primaryTextColor }}>
                        <h2 id="users-name">{displayInfo.name}</h2>
                        <EditableField
                            cssId={'job-title'}
                            value={card.customJobTitle ? card.customJobTitle : displayInfo.jobTitle}
                            column={'customJobTitle'}
                        />
                    </div>

                    {/* contact info email phone website */}

                    <div id="contact-info" style={{ color: secondaryTextColor }}>
                        <p id="email">{displayInfo.email}</p>
                        <p id="phone">{displayInfo.phone}</p>
                        <p id="website">{displayInfo.website?.split('//')[1]}</p>
                    </div>
                </section>

                {/* audioplayer */}

                <section id="card-audioplayer" >
                    <div style={{ color: primaryTextColor }}>
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
                    <div style={{ color: primaryTextColor }} >
                        {card?.Tracks?.length ? (<p style={{ color: waveformColor }}>Now playing: {trackTitle}</p>) : (<p id="card-detail-no-tracks-warning">No Tracks<br></br>Get started by adding tracks</p>)}

                        <CardAudioPlayer audioUrl={audioUrl} waveformColor={waveformColor} />
                        <div>
                            <CardTrackList trackList={trackList} setTrackList={setTrackList} cardId={card.id} setAudioUrl={setAudioUrl} setTrackTitle={setTrackTitle} />
                        </div>



                    </div>
                    <div id="card-download-option"></div>
                </section>

                {/* bio and links */}

                <section style={{ color: primaryTextColor }}>
                    <div id="card-bio">
                        <div id="card-headshot-container">
                            <div className="image-container" >
                                <img src={card.Headshot.url || '/defaultHeadshot.jpg'} />
                            </div>
                        </div>


                        <div id="card-bio-text" className="editable-field" onClick={() => setEditEnabled(true)}>
                            {bio.split('\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                    <div id="card-contact-info" style={{ display: 'none' }}>
                        <p>{externalLinks[0].url}</p>
                    </div>

                    <button onClick={handleBackToEditing}>BACK TO EDITING</button>
                </section>

            </div>
            <div id="preview-hidden-toolbox-container" style={{ display: 'none' }}>
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

                    secondaryEnabled={secondaryEnabled}
                    setSecondaryEnabled={setSecondaryEnabled}

                    cardId={card.id}

                    fontFamily={fontFamily}
                    setFontFamily={setFontFamily}

                    fontSize={fontSize}
                    setFontSize={setFontSize}
                />
            </div>
        </div>
    )
}



//EDITABLE FIELD COMPONENT

function EditableField({ value, cssId, column, type = 'p' }) {
    const dispatch = useDispatch()
    const cardId = useSelector(state => state.cards.currentCard.id)
    const defaultBio = useSelector(state => state.cards.currentCard.User.UserDisplayInfo.bio)
    const [editEnabled, setEditEnabled] = useState(false)
    const [editValue, setEditValue] = useState(value)
    const [defaultBioEnabled, setDefaultBioEnabled] = useState(false)
    const handleSave = () => {
        if (!isEmpty(editValue)) dispatch(thunkUpdateCard(cardId, column, editValue))
        setEditEnabled(false)
    }
    useEffect(() => {
        if (defaultBio) setDefaultBioEnabled(true)
    }, [defaultBio])

    const handleUseDefault = () => {
        if (defaultBio) setEditValue(defaultBio)
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
                <button disabled={!defaultBioEnabled} onClick={handleUseDefault}>Use Default</button>

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
