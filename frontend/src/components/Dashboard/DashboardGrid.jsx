import CircularProgress from './CircularProgress'
import { FaMusic, FaFileAlt, FaImages, FaCompactDisc } from 'react-icons/fa';
import { thunkGetUserImages} from '../../store/images';
import {thunkGetUserCards } from '../../store/cards'
import {thunkGetUserTracks } from '../../store/tracks'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './DashboardGrid.css'
export default function DashboardGrid() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(state => state.session.user)
    const tracks = useSelector(state => state.catalog.userTracks)
    const images = useSelector(state => state.images.userImages)
    const cards = useSelector(state => state.cards.userCards)

    const [stateUpdated, setStateUpdated] = useState(false )
    const [cardCount, setCardCount] = useState()
    const [activeCards, setActiveCards] = useState()
    const [trackCount, setTrackCount] = useState()
    const [imageCount, setImageCount] = useState()


    useEffect(() => {
        dispatch(thunkGetUserImages())
        dispatch(thunkGetUserCards())
        dispatch(thunkGetUserTracks())
        .then(() => {
            setStateUpdated(true)
        })
    }, [user, dispatch])

    useEffect(()=> {
        if(tracks && Array.isArray(tracks)) setTrackCount(tracks.length)
        if(images && Array.isArray(images)) setImageCount(images.length)
        if(cards && Array.isArray(cards)) {
            setCardCount(cards.length)
            let activeCount = cards.reduce((acc, card)=> {
                if(card.isActive) {
                    return acc += 1
                }
                return acc
            }, 0)
            setActiveCards(activeCount)
        }


    }, [tracks, images, cards])
    const cardPercentage = (activeCards / cardCount) * 100;

    return (
        <div className="dashboard-grid">
            <div className="dashboard-card" onClick={()=> navigate('/cards')}>
                <CircularProgress a={activeCards} b={cardCount} />
                <div className="card-content">
                    <FaFileAlt size={40} className="icon" />

                    <p>Active Cards</p>
                </div>
            </div>
            <div className="dashboard-card" onClick={()=> navigate('/catalog')}>
                <CircularProgress a={trackCount} b={100} />
                <div className="card-content">
                    <FaMusic size={40} className="icon" />
                    {/* <h3>{trackCount}/100</h3> */}
                    <p>Tracks</p>
                </div>
            </div>
            <div className="dashboard-card" onClick={()=> navigate('/images')}>
                <CircularProgress a={imageCount} b={100} />
                <div className="card-content">
                    <FaImages size={40} className="icon" />
                    {/* <h1 id="image-count">{imageCount}/100</h1> */}
                    <p>Images</p>
                </div>
            </div>
        </div>
    )
}
