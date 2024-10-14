import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { thunkGetCurrentCard } from "../../store/cards"
import './CardDetails.css'

export default function CardDetails() {
    const dispatch = useDispatch()
    let { cardId } = useParams()
    const [card, setCard] = useState({})
    const [displayInfo, setDisplayInfo] = useState({})
    const [externalLinks, setExternalLinks] = useState({})
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        dispatch(thunkGetCurrentCard(cardId)).then((data) => setCard(data))
    }, [dispatch, setCard, cardId])

    useEffect(() => {
        if (card.User) {
            setDisplayInfo(card.User.UserDisplayInfo)
            setExternalLinks(card.User.ExternalLinks)
            setLoaded(true)
        } else {
            console.log('NO USER', card)
        }
    }, [dispatch, card, setDisplayInfo, setExternalLinks, loaded])

    if(loaded) return (
        <div id="card-details-container">
            <section id="card-banner">
                <img src={card.Banner.url} />
            </section>
            <section id="card-user-info">
                <div>
                    <p id="card-title">{card.title}</p>
                    <p id="card-job-title">{card.customJobTitle}</p>
                </div>
                <div>
                    <p id="email">{displayInfo.email}</p>
                    <p id="phone">{displayInfo.phone}</p>
                    <p id="website">{displayInfo.website?.split('//')[1]}</p>
                </div>
                <p id="card-description">{card.description}</p>
            </section>
            <section id="card-audioplayer">
                <div>
                    <div id="card-waveform"></div>
                    <div id="card-playlist"></div>
                </div>
                <div id="card-download-option"></div>
            </section>
            <section id="card-bio">
                <div id="card-headshot-container"><img src={card.Headshot.url} /></div>
                <div id="card-bio-text">
                    {displayInfo?.bio.split('\n').map(paragraph => (
                        <p>{paragraph}</p>
                    ))}

                </div>
                <div id="card-contact-info"></div>
            </section>


        </div>


    )
}
