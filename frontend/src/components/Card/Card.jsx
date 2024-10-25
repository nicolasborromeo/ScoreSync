import './Card.css'
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { formatUploaded } from "../../utils/utils";
import { thunkCheckUserDisplayInfo, thunkGetUserCards } from '../../store/cards'
import { useModal } from '../../context/Modal';
import CardTitleModal from './CardTitleModal';
import CardMenu from './CardMenu';
//icons
import { CiMenuKebab } from "react-icons/ci";
import { IoMdSettings } from "react-icons/io";
import { GoLink } from "react-icons/go";
import { IoMdCloudDone } from "react-icons/io";
import { MdOutlineCloudOff } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
// import { BsPlusSquareDotted } from "react-icons/bs";
//



export default function Card() {
    const navigate = useNavigate()
    const { setModalContent } = useModal()
    const user = useSelector(state => state.session.user)
    const cards = useSelector(state => state.cards.userCards)
    const dispatch = useDispatch()

    const [stateUpdated, setStateUpdated] = useState()

    //Card Option Menu States Variables
    const [cardId, setCardId] = useState()
    const [cardTitle, setCardTitle] = useState()
    const [x, setX] = useState()
    const [y, setY] = useState()
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef()


    //Card Options Menu
    const openCardMenu = (e, cardId, cardTitle) => {
        e.stopPropagation()
        setX(e.clientX - 80)
        setY(e.clientY)
        setCardId(cardId)
        setCardTitle(cardTitle)
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
        dispatch(thunkGetUserCards()).then(() => {
            setStateUpdated(true)
        })
    }, [user, dispatch])

    const handleCreateCard = async () => {
        const usersInfo = await dispatch(thunkCheckUserDisplayInfo())
        if(usersInfo.name) {
            setModalContent(<CardTitleModal navigate={navigate} action={'create'}/>)
        } else {
            setModalContent(<p style={{color: 'red', textAlign:'center'}}>You need to complete your Display Information on the Dashboard first</p>)
        }
    }

    return (
        <div id="cards-container">

            <div className="page-title-container">
                <p>Cards</p>
            </div>

            <table className="cards-table">
                <thead>
                    <tr>
                        <th>Active</th>
                        <th>Title</th>
                        <th>Live Link</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th>Settings</th>
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
                                        <td>{card.isActive ? <IoMdCloudDone /> : <MdOutlineCloudOff />
                                        }</td>
                                        <td><NavLink className='card-link' id="navlink-to-card-details" to={`/cards/${card.id}`}>{card.title || 'Untitled'}</NavLink></td>
                                        <td><NavLink className='card-link' id="navlink-to-public-url" to={card.publicUrl}><GoLink /></NavLink></td>
                                        <td>{formatUploaded(card.createdAt)}</td>
                                        <td>{formatUploaded(card.updatedAt)}</td>
                                        <td><IoMdSettings /></td>
                                        <td><CiMenuKebab id="track-menu-icon"
                                        onClick={(e) => openCardMenu(e, card.id, card.title)}
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
                        <p className="no-items-message-container">You don&apos;t have any Cards created yet. Click the icon <CiCirclePlus /> to start.</p>
                    </>
            }
            <div >
                <CiCirclePlus
                    id="add-card-button"
                    size={60}
                    onClick={handleCreateCard}
                />
            </div>



            {/* OPTIONS MENU hidden component */}
            <CardMenu
                cardId={cardId}
                cardTitle={cardTitle}
                setShowMenu={setShowMenu}
                showMenu={showMenu}
                menuRef={menuRef}
                x={x}
                y={y}
            />

        </div>
    )
}
