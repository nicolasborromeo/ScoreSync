import './Card.css'
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { formatUploaded } from "../../utils/utils";
import { thunkGetUserCards } from '../../store/cards'
import { thunkGetUsersDisplayInfo } from '../../store/displayInfo'
import { useModal } from '../../context/Modal';


//components
import CardTitleModal from './CardTitleModal';
import CardMenu from './CardMenu';
import CardPreviewRow from '../CardPreviewRow';


//icons
import { CiMenuKebab } from "react-icons/ci";
import { GoLink } from "react-icons/go";
import { IoMdCloudDone } from "react-icons/io";
import { MdOutlineCloudOff } from "react-icons/md";
import { Plus } from 'lucide-react'



export default function Card() {
    const navigate = useNavigate()
    const { setModalContent, closeModal } = useModal()
    const user = useSelector(state => state.session.user)
    const cards = useSelector(state => state.cards.userCards)
    const displayInfo = useSelector(state => state.displayInfo)
    const dispatch = useDispatch()
    const [stateUpdated, setStateUpdated] = useState()

    //Card Option Menu States Variables
    const [cardId, setCardId] = useState()
    const [cardTitle, setCardTitle] = useState()
    const [isActive, setIsActive] = useState()
    const [x, setX] = useState()
    const [y, setY] = useState()
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef()


    //Card Options Menu
    const openCardMenu = (e, cardId, cardTitle, isActive) => {
        e.stopPropagation()
        setX(e.clientX - 80)
        setY(e.clientY)
        setCardId(cardId)
        setCardTitle(cardTitle)
        setIsActive(isActive)
        setShowMenu(true)
    }
    useEffect(() => {
        const closeMenu = e => {
            if (!menuRef.current.contains(e.target)) setShowMenu(false)
        }
        if (showMenu) document.addEventListener('click', closeMenu)
        return () => document.removeEventListener('click', closeMenu)
    }, [showMenu])

    //Thunk operations
    useEffect(() => {
        dispatch(thunkGetUserCards())
            .then(dispatch(thunkGetUsersDisplayInfo()))
            .then(() => {
                setStateUpdated(true)
            })
    }, [user, dispatch])

    const handleCreateCard = async () => {
        if (displayInfo?.name) {
            setModalContent(<CardTitleModal navigate={navigate} action={'create'} />)
        } else {
            setModalContent(<PleaseCompleteInfo navigate={navigate} closeModal={closeModal} />)
        }
    }

    return (
        <div id="cards-container">

            <div className="page-title-container">
                <div className='page-title-content'>

                    <p id="page-title">Cards</p>
                    <div className='gradient-button-background'>
                        <button className='upload-icon' onClick={handleCreateCard}>
                            <Plus />
                            <span >NEW CARD</span>
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <table className="cards-table">
                    <thead>
                        <tr>
                            <th>Active</th>
                            <th>Title</th>
                            <th>Live Link</th>
                            <th>Created</th>
                            <th>Updated</th>
                            {/* <th>Settings</th> */}
                            <th></th>
                        </tr>
                    </thead>
                    {
                        cards?.length >= 1
                        &&
                        Array.isArray(cards)
                        &&
                        <tbody>
                            {stateUpdated
                                &&
                                cards.map(
                                    card => (
                                        <tr key={card.id}>
                                            <td>{card.isActive ? <IoMdCloudDone /> : <MdOutlineCloudOff />}</td>
                                            <td><NavLink className='card-link' id="navlink-to-card-details" to={`/cards/${card.id}`}>{card.title || 'Untitled'}</NavLink></td>
                                            <td><a className='card-link' id="navlink-to-public-url" href={card.publicUrl} target="_blank" rel="noopener noreferrer"><GoLink /></a></td>
                                            <td>{formatUploaded(card.createdAt)}</td>
                                            <td>{formatUploaded(card.updatedAt)}</td>
                                            {/* <td><IoMdSettings /></td> */}
                                            <td><CiMenuKebab id="track-menu-icon"
                                                onClick={(e) => openCardMenu(e, card.id, card.title, card.isActive)}
                                            /></td>
                                        </tr>
                                    ))}
                        </tbody>
                    }
                </table>
                {
                    !cards.length
                    &&
                    <>
                        <p className="no-items-message-container">You don&apos;t have any Cards created yet. Click the icon <Plus /> to start creating.</p>
                    </>
                }
            </div>


            {/* Card Preview Row */}

            <CardPreviewRow cards={cards} />



            {/* OPTIONS MENU hidden component */}
            <CardMenu
                cardId={cardId}
                cardTitle={cardTitle}
                isActive={isActive}
                setShowMenu={setShowMenu}
                showMenu={showMenu}
                menuRef={menuRef}
                x={x}
                y={y}
            />
            {/* <Footer /> */}
        </div>
    )
}


function PleaseCompleteInfo({ navigate, closeModal }) {

    const navigateDashboard = () => {
        navigate('/dashboard')
        closeModal()
    }

    return (
        <p style={{ color: 'white', textAlign: 'center', padding: '20px', filter: 'grayscale(20%)' }}>Please complete your <br /><em>Display Information </em><br />on the <span onClick={navigateDashboard} style={{ cursor: 'pointer' }}><u><strong>Dashboard</strong></u></span> first</p>
    )
}
