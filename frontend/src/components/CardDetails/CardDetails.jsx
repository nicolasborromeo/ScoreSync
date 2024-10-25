import './CardDetails.css'
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { thunkGetCurrentCard, thunkUpdateCard } from "../../store/cards"
import { useModal } from "../../context/Modal"

import CardAudioPlayer from "./CardAudioPlayer"
import CardTrackList from "./CardTrackList"
import ImagesModal from "./ImagesModal"
import ToolBox from "../ToolBox"
import TracksModal from "./TracksModal"
import ExternalLinkBar from './ExternalLinkBar'
import ContactInfo from './ContactInfo'


import { MdOutlinePlaylistAdd } from "react-icons/md";

import { CiEdit } from "react-icons/ci";


import { isEmpty } from "../../utils/utils"


export default function CardDetails() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let { cardId } = useParams()
    const { setModalContent, closeModal } = useModal()
    const card = useSelector(state => state.cards.currentCard)
    const [displayInfo, setDisplayInfo] = useState({})
    const [externalLinks, setExternalLinks] = useState({})
    const [trackList, setTrackList] = useState([])
    const [userLoaded, setUserLoaded] = useState(false)
    const [tracksLoaded, setTracksLoaded] = useState(false)
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
            return
        }
    }, [dispatch, card, setDisplayInfo, setExternalLinks, userLoaded])

    //setting up tracks data:
    useEffect(() => {
        if (cardId && card && card.Tracks?.length) {
            setTrackList(card.Tracks)
            setAudioUrl(card.Tracks[0].filePath)
            setTrackTitle(card.Tracks[0].title)
        }
        setTracksLoaded(true)
    }, [card, cardId])

    const handlePreview = () => {
        navigate(`/preview/${card.privateToken}`)
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


    if (userLoaded
        &&
        tracksLoaded
    ) return (

        <div
            id="background-for-app-in-card-details"
            style={
                secondaryEnabled ?
                    { background: `linear-gradient(${primaryBackground} , ${secondaryBackground})` }
                    :
                    { backgroundColor: primaryBackground }
            }>

            <div id="card-details-container"
                style={{ fontFamily: fontFamily, fontSize: `${fontSize}px` }}>

                <section id="card-banner">
                    <div className='image-container'
                        onClick={() => setModalContent(<ImagesModal cardId={cardId} type={'banner'} closeModal={closeModal} />)}>
                        <img src={card.Banner.url || `/defaultBanner.jpg`} />
                        <i className="pencil-icon"><CiEdit /></i>
                    </div>
                </section>


                <section id="card-user-info" >

                    <div id="card-profilepic-container">
                        <div className='image-container'
                            onClick={() => setModalContent(<ImagesModal cardId={cardId} type={'profile'} closeModal={closeModal} />)}
                        >
                            <img style={{ border: `4px ridge ${waveformColor}` }} src={card?.ProfilePic?.url || `/defaultProfile.webp`} />
                            <i className="pencil-icon"><CiEdit /></i>
                        </div>
                    </div>


                    {/* name and jobtitle */}
                    <div id="top-info-container">
                        <div id="name-title-links-container">
                            <div id="name-and-title" style={{ color: primaryTextColor }}>
                                <h2 id="users-name">{displayInfo.name}</h2>
                                <div>
                                    <EditableField
                                        cssId={'job-title'}
                                        value={card.customJobTitle ? card.customJobTitle : displayInfo.jobTitle}
                                        column={'customJobTitle'}
                                        primaryTextColor={primaryTextColor}
                                    />
                                </div>
                            </div>
                            {externalLinks && <ExternalLinkBar externalLinks={externalLinks} waveformColor={waveformColor} />}
                        </div>


                        <div style={{ color: primaryTextColor }} id="card-title-and-description-container">
                            <div>
                                <EditableField
                                    cssId={'card-title'}
                                    value={card.title ? `${card.title}:` : 'Your Playlist Title...'}
                                    column={'title'}
                                    primaryTextColor={primaryTextColor}
                                />
                            </div>

                            <div>
                                <EditableField
                                    cssId={'card-description'}
                                    value={card.description ? card.description : 'Your Playlist Description...'}
                                    column={'description'}
                                    primaryTextColor={primaryTextColor}
                                />
                            </div>
                        </div>


                        {/* contact info email phone website */}

                        <div id="contact-info" style={{ color: waveformColor }}>
                            {displayInfo?.website &&
                                <>
                                    <Link
                                        to={`${displayInfo.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer external"
                                        style={{ color: waveformColor, textDecoration: 'none' }} // Here, we remove textDecoration
                                        className="contact-link"
                                        id="website"
                                    >
                                        {displayInfo.website?.split('//')[1]}
                                    </Link>
                                    <p>·</p>
                                </>
                            }
                            {displayInfo?.email &&
                                <>
                                    <Link
                                        href={`mailto:${displayInfo.email}`}
                                        style={{ color: waveformColor, textDecoration: 'none' }}
                                        id="email"
                                        className="contact-link"
                                    >
                                        {displayInfo.email}
                                    </Link>
                                    <p>·</p>
                                </>
                            }
                            {displayInfo?.phone &&
                                <Link
                                    href={`tel:${displayInfo.phone}`}
                                    style={{ color: waveformColor, textDecoration: 'none' }}
                                    id="phone"
                                    className="contact-link"
                                >
                                    {displayInfo.phone}
                                </Link>}
                        </div>


                    </div>
                </section>

                {/* audioplayer */}

                <section id="card-audioplayer" >
                    <div
                        id="audioplayer-and-tracklist-container"
                        style={{ color: waveformColor }}
                    >
                        {/* {card.Tracks.length ? (<p id="now-playing" style={{ color: primaryTextColor }}>Now playing: {trackTitle}</p>) : (<p id="card-detail-no-tracks-warning">No Tracks<br></br>Get started by adding tracks</p>)} */}
                        <CardAudioPlayer audioUrl={audioUrl} waveformColor={waveformColor} />
                        <CardTrackList trackList={trackList} setTrackList={setTrackList} cardId={cardId} setAudioUrl={setAudioUrl} setTrackTitle={setTrackTitle} waveformColor={waveformColor} />
                    </div>

                    <div
                        id="add-tracks-button-container">
                        <button
                            className="add-tracks-button"
                            onClick={() => setModalContent(<TracksModal cardId={cardId} />)}>
                            ADD TRACKS
                            <MdOutlinePlaylistAdd size={25} />
                        </button>
                    </div>

                </section>



                {/* bio and links */}

                <section style={{ color: primaryTextColor }}>

                    <div id="card-bio">
                        <div id="card-headshot-container">
                            <div className="image-container" onClick={() => setModalContent(<ImagesModal cardId={cardId} type={'headshot'} closeModal={closeModal} />)}>
                                <img src={card.Headshot.url || '/defaultHeadshot.jpg'} />
                                <i className="pencil-icon"><CiEdit /></i>
                            </div>
                        </div>
                        <div id="bio-container">
                            <h2 id="biography-title">Biography</h2>
                            <EditableField
                                cssId={`card-bio-text`}
                                value={card.customBio ? card.customBio : displayInfo.bio || '...'}
                                column={'customBio'}
                                type="textarea"
                                primaryTextColor={primaryTextColor}
                            />
                            <div id="contact-info-container">
                                <ContactInfo displayInfo={displayInfo} waveformColor={waveformColor} />
                            </div>

                        </div>
                    </div>

                    {/* <div id="footer-externallinks-container">
                        <ExternalLinkBar externalLinks={externalLinks} waveformColor={waveformColor} />
                    </div> */}

                    <div id="preview-button-container">
                        <button id="preview-publish-button"
                            onClick={handlePreview}>
                            PREVIEW & PUBLISH
                        </button>
                    </div>

                    <div id="card-details-footer">
                        Privacy Policy | Cookie Policy | © Oct 2024 ScoreSync - All right reserved.
                    </div>
                </section>

            </div>

            {/* pallete toolbox */}

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

                cardId={cardId}

                fontFamily={fontFamily}
                setFontFamily={setFontFamily}

                fontSize={fontSize}
                setFontSize={setFontSize}
            />
        </div>
    )
}



//EDITABLE FIELD COMPONENT

function EditableField({ value, cssId, column, type = 'p', primaryTextColor }) {
    const dispatch = useDispatch()
    const cardId = useSelector(state => state.cards.currentCard.id)
    const defaultBio = useSelector(state => state.cards?.currentCard?.User?.UserDisplayInfo?.bio)
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
                style={{ color: primaryTextColor }}
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
                <i onClick={() => setEditEnabled(true)} className="pencil-icon-on-field"><CiEdit /></i>
            </div>

        )

    if (type === 'textarea') return editEnabled ?
        (
            <div>
                <textarea
                    className="editable-field-textarea"
                    style={{ color: primaryTextColor }}
                    value={editValue}
                    autoFocus
                    onChange={(e) => setEditValue(e.target.value)}
                />
                <div id="editable-textarea-buttons">
                    <button onClick={handleSave}>Confirm</button>
                    <button onClick={() => setEditEnabled(false)}>Cancel</button>
                    <button disabled={!defaultBioEnabled} onClick={handleUseDefault}>Use Default</button>
                </div>

            </div>
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
