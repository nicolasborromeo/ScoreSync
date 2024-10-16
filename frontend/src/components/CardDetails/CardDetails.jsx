import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { thunkGetCurrentCard, thunkUpdateCard } from "../../store/cards"
import CardAudioPlayer from "./CardAudioPlayer"
import CardTrackList from "./CardTrackList"
import './CardDetails.css'

export default function CardDetails() {
    const card = useSelector(state => state.cards.currentCard)
    const dispatch = useDispatch()
    let { cardId } = useParams()
    const [displayInfo, setDisplayInfo] = useState({})
    const [externalLinks, setExternalLinks] = useState({})
    const [trackList, setTrackList] = useState([])
    const [userLoaded, setUserLoaded] = useState(false)
    const [tracksLoaded, setTracksLoaded] = useState(false)
    const [audioUrl, setAudioUrl] = useState('')
    const [trackTitle, setTrackTitle] = useState()


    useEffect(() => {
        dispatch(thunkGetCurrentCard(cardId))
    }, [dispatch, cardId])

    useEffect(() => {
        if (card && card.User) {
            setDisplayInfo(card.User.UserDisplayInfo)
            setExternalLinks(card.User.ExternalLinks)
            setUserLoaded(true)
        } else {
            console.log('NO USER', card)
        }
    }, [dispatch, card, setDisplayInfo, setExternalLinks, userLoaded])

    useEffect(()=> {
         if (card && card.Tracks) {
                setTrackList(card.Tracks)
                setAudioUrl(card.Tracks[0].filePath)
                setTrackTitle(card.Tracks[0].title)
                setTracksLoaded(true)
            }
    })

    if (userLoaded) return (
        <div id="background-for-app-in-card-details">

            <div id="card-details-container">
                <section id="card-banner">
                    <img src={card.Banner.url} />
                </section>
                <section id="card-user-info">
                    <div id="name-and-title">
                        <h2 id="users-name">{displayInfo.name}</h2>
                        <EditableField
                            cssId={'job-title'}
                            value={card.customJobTitle ? card.customJobTitle : displayInfo.jobTitle}
                            column={'customJobTitle'}
                            cardId={cardId}
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
                            cardId={cardId}
                        />
                        {/* <p id="card-title">{card.title}</p> */}
                        <EditableField
                            cssId={'card-description'}
                            value={card.description ? card.description : 'Your Playlist Description...'}
                            column={'description'}
                            cardId={cardId}
                        />
                    </div>
                    <div>
                        <p>Now playing: {trackTitle}</p>
                        <CardAudioPlayer audioUrl={audioUrl} />
                        <CardTrackList trackList={trackList} setTrackList={setTrackList} cardId={cardId} setAudioUrl={setAudioUrl} setTrackTitle={setTrackTitle} />
                    </div>
                    <div id="card-download-option"></div>
                </section>
                <section id="card-bio">
                    <div id="card-headshot-container"><img src={card.Headshot.url} /></div>
                    {/* <textarea></textarea> */}
                    <div id="card-bio-text">
                        {displayInfo?.bio.split('\n').map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </div>
                </section>
                <section id="external-links">
                    <div id="card-contact-info">
                        <p>{externalLinks[0].url}</p>
                    </div>
                </section>
            </div>
        </div>
    )
}


function EditableField({ value, cssId, column, cardId, type = 'p' }) {
    const dispatch = useDispatch()
    const [editEnabled, setEditEnabled] = useState(false)
    const [editValue, setEditValue] = useState(value)

    const handleSave = () => {
        dispatch(thunkUpdateCard(cardId, column, editValue))
        setEditEnabled(false)
    }

    //reset the value on the input field to the one clicked
    useEffect(()=> {
        setEditValue(value)
    }, [editEnabled])

    return editEnabled ?
        (
            <input
                value={editValue}
                autoFocus
                onChange={(e) => setEditValue(e.target.value)}
                // onBlur={handleSave}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave()
                }}
            />
        )
        :
        ( 
           <p id={`${cssId}`} onClick={() => setEditEnabled(true)}>{value}</p>
        )
}
