import '../CardDetails/CardDetails.css'
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { thunkGetPreviewCard, thunkPublishCard, thunkGetPublishedCard } from "../../store/cards"
import { useNavigate, Link, useParams } from "react-router-dom"
import { useModal } from '../../context/Modal'

import CardAudioPlayer from "../CardDetails/CardAudioPlayer"
import CardTrackList from "../CardDetails/CardTrackList"
import PublishModal from './PublishModal'
import ToolBox from "../ToolBox"

import ExternalLinkBar from '../CardDetails/ExternalLinkBar'
import ContactInfo from '../CardDetails/ContactInfo'

import { IoMdArrowRoundBack } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { MdArrowBackIosNew } from "react-icons/md";




export default function PublicCard({ preview }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {closeModal, setModalContent} = useModal()
    const card = useSelector(state => state.cards.currentCard)
    const params = useParams()
    const privateToken = params.privateToken

    const [bio, setBio] = useState('')
    const [trackList, setTrackList] = useState([])
    const [displayInfo, setDisplayInfo] = useState({})
    const [externalLinks, setExternalLinks] = useState({})
    const [userLoaded, setUserLoaded] = useState(false)
    const [tracksLoaded, setTracksLoaded] = useState(false)
    const [audioUrl, setAudioUrl] = useState('')

    //State variables for card colors and font:
    const [secondaryBackground, setSecondaryBackground] = useState('#141418')
    const [secondaryTextColor, setSecondaryTextColor] = useState('#b6b6b6')
    const [primaryBackground, setPrimaryBackground] = useState('#141418')
    const [primaryTextColor, setPrimaryTextColor] = useState('#ececec')
    const [secondaryEnabled, setSecondaryEnabled] = useState(true)
    const [waveformColor, setWaveformColor] = useState('#eb3578')
    const [fontFamily, setFontFamily] = useState("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif")
    const [fontSize, setFontSize] = useState(16)
    const [cardId, setCardId] = useState('')


    useEffect(() => {
        if(preview) {
            dispatch(thunkGetPreviewCard(privateToken)).then(() => {
                // console.log('RESPONSE FOMR THUNK: ', res) this return the card object in case I need it
            })
        } else {
            dispatch(thunkGetPublishedCard(privateToken)).then(() => {
                // console.log('RESPONSE FOMR THUNK: ', res) this return the card object in case I need it
            })
        }
    }, [dispatch, privateToken, preview])



    //setting up users data:
    useEffect(() => {
        if (card && card.User) {
            if(!preview && !card.isActive) navigate('/inactive')
            setCardId(card.id)
            setDisplayInfo(card.User.UserDisplayInfo)
            setExternalLinks(card.User.ExternalLinks)
            setBio(card.customBio ||card.User.UserDisplayInfo?.bio)
            setUserLoaded(true)
        } else return
    }, [dispatch, card, setDisplayInfo, setExternalLinks, userLoaded, preview, navigate])

    //setting up tracks data:
    useEffect(() => {
        if (card && card.Tracks?.length) {
            setTrackList(card.Tracks)
            setAudioUrl(card.Tracks[0].filePath)

        }
        setTracksLoaded(true)
    }, [card, cardId])

    const handlePublishCard = () => {
        dispatch(thunkPublishCard(cardId, privateToken)).then((res)=> {
            const {publicUrl} = res
            setModalContent(<PublishModal publicUrl={publicUrl} closeModal={closeModal} navigate={navigate}/>)
        })
    }


    if (userLoaded
        &&
        tracksLoaded
    ) return (

        <div id="background-for-app-in-card-details" style={{ background: `linear-gradient(${primaryBackground} , ${secondaryBackground})` }}>

            {preview && <div id="preview-back-arrow-button"><MdArrowBackIosNew size={30} onClick={() => navigate(`/cards/${cardId}`)}/></div>}

            <div id="card-details-container" style={{ fontFamily: fontFamily, fontSize: `${fontSize}px` }}>

                {/* banner  */}

                <section id="card-banner">
                    <div className='public-image-container'>
                        <img src={card.Banner.url || `/defaultBanner.jpg`} />
                    </div>
                </section>

                <section id="card-user-info">

                    {/* profile picture */}

                    <div id="card-profilepic-container">
                        <div className='public-image-container'>
                            <img style={{ border: `4px ridge ${waveformColor}` }} src={card.ProfilePic.url || `/defaultProfile.webp`} />
                        </div>
                    </div>

                    {/* name and jobtitle */}

                    <div id="top-info-container">
                        <div id="name-title-links-container">
                            <div id="name-and-title" style={{ color: primaryTextColor }}>
                                <h2 id="users-name">{displayInfo.name}</h2>
                                <div>
                                    <div className="editable-field-container">
                                        <p id='job-title' >
                                            {card.customJobTitle || displayInfo.jobTitle}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {externalLinks && <ExternalLinkBar externalLinks={externalLinks} waveformColor={waveformColor} />}
                        </div>

                        {/* card title and description */}

                        <div id="card-title-and-description-container" style={{ color: primaryTextColor }}>
                            {card?.title && (
                                <div className="editable-field-container">
                                    <p id='card-title' >
                                        {card.title}
                                    </p>
                                </div>
                            )}
                            {card?.description && (
                                <div className="editable-field-container">
                                    <p id='card-description' >
                                        {card.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* contact info email phone website */}

                        <div id="contact-info" style={{ color: waveformColor }}>
                            {displayInfo?.website && (
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
                            )}
                            {displayInfo?.email && (
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
                            )}
                            {displayInfo?.phone && (
                                <Link
                                    href={`tel:${displayInfo.phone}`}
                                    style={{ color: waveformColor, textDecoration: 'none' }}
                                    id="phone"
                                    className="contact-link"
                                >
                                    {displayInfo.phone}
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* audioplayer */}

                <section id="card-audioplayer">
                    <div id="audioplayer-and-tracklist-container" style={{ color: waveformColor }}>
                        <CardAudioPlayer audioUrl={audioUrl} waveformColor={waveformColor} />
                        <CardTrackList trackList={trackList} setTrackList={setTrackList} cardId={cardId} setAudioUrl={setAudioUrl} waveformColor={waveformColor} isPublic={true}/>
                    </div>
                </section>



                {/* bio and links */}

                <section style={{ color: primaryTextColor }}>

                    <div id="card-bio">
                        <div id="card-headshot-container">
                            <div className="public-image-container">
                                <img src={card.Headshot.url || '/defaultHeadshot.jpg'} />
                            </div>
                        </div>
                        <div id="bio-container">
                            <h2 id="biography-title">Biography</h2>
                            <div id='card-bio-text'>
                                {bio?.split('\n').map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </div>
                            <div id="contact-info-container">
                                <ContactInfo displayInfo={displayInfo} waveformColor={waveformColor} />
                            </div>

                        </div>
                    </div>

                    {preview &&
                        <div className='preview-buttons-container'>
                            <div id="preview-button-container">
                                <button id="preview-publish-button"
                                    onClick={() => navigate(`/cards/${cardId}`)}
                                >
                                    <IoMdArrowRoundBack size={18}/>
                                    BACK TO EDITING
                                </button>
                            </div>
                            <div id="preview-publish-button-container">
                                <button id="publish-button"
                                    onClick={handlePublishCard}
                                >
                                    PUBLISH
                                    <FaCheck size={18}/>
                                </button>
                            </div>
                        </div>
                    }

                    <div id="card-details-footer">
                        Privacy Policy | Cookie Policy | © Oct 2024 ScoreSync - All right reserved.
                    </div>
                </section>

            </div>

            {/* HIDDEN pallete toolbox */}
            <div className='hidden'>
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
        </div>
    )
}
