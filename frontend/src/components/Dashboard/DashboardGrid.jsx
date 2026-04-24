import CircularProgress from './CircularProgress'
import { FaMusic, FaFileAlt, FaImages } from 'react-icons/fa';
import { thunkGetUserImages } from '../../store/images';
import { thunkGetUserCards } from '../../store/cards'
import { thunkGetUserTracks } from '../../store/tracks'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './DashboardGrid.css'

export default function DashboardGrid() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(state => state.session.user)
    const tracks = useSelector(state => state.catalog.userTracks) || []
    const images = useSelector(state => state.images.userImages) || []
    const cards = useSelector(state => state.cards.userCards) || []

    useEffect(() => {
        if (!user) return
        Promise.all([
            dispatch(thunkGetUserImages()),
            dispatch(thunkGetUserCards()),
            dispatch(thunkGetUserTracks())
        ])
    }, [user, dispatch])

    const cardCount = cards.length
    const activeCards = cards.reduce((acc, card) => acc + (card.isActive ? 1 : 0), 0)
    const trackCount = tracks.length
    const imageCount = images.length

    const metrics = [
        {
            title: 'Active cards',
            subtitle: 'Live and ready to share',
            statA: activeCards,
            statB: Math.max(cardCount, 1),
            icon: <FaFileAlt size={28} className="icon" />,
            onClick: () => navigate('/cards'),
        },
        {
            title: 'Tracks',
            subtitle: 'Your playable music library',
            statA: trackCount,
            statB: Math.max(trackCount, 1),
            icon: <FaMusic size={28} className="icon" />,
            onClick: () => navigate('/catalog'),
        },
        {
            title: 'Images',
            subtitle: 'Artwork, banners, and headshots',
            statA: imageCount,
            statB: Math.max(imageCount, 1),
            icon: <FaImages size={28} className="icon" />,
            onClick: () => navigate('/images'),
        },
    ]

    return (
        <div className="dashboard-grid">
            {metrics.map((metric) => (
                <button className="dashboard-card" onClick={metric.onClick} key={metric.title} type="button">
                    <CircularProgress a={metric.statA} b={metric.statB} label={metric.title} />
                    <div className="card-content">
                        {metric.icon}
                        <div>
                            <h3>{metric.title}</h3>
                            <p>{metric.subtitle}</p>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    )
}
