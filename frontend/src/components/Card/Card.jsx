import './Card.css'
import { NavLink } from 'react-router-dom';
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useModal } from "../../context/Modal";
import { formatUploaded } from "../../utils/utils";

import { thunkGetUserCards } from '../../store/cards'

import { MdOutlineDone } from "react-icons/md";

import { CiMenuKebab } from "react-icons/ci";
import { IoMdSettings } from "react-icons/io";
import { GoLink } from "react-icons/go";
import { IoMdCloudDone } from "react-icons/io";
import { MdOutlineCloudOff } from "react-icons/md";




export default function Card() {
    const user = useSelector(state => state.session.user)
    const cards = useSelector(state => state.cards.userCards)
    const dispatch = useDispatch()

    const [stateUpdated, setStateUpdated] = useState()


    //Thunk operations
    useEffect(() => {
        dispatch(thunkGetUserCards()).then(() => {
            setStateUpdated(true)
        })
    }, [user, dispatch])


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
                            card =>(
                                <tr key={card.id}>
                                    <td>{card.isActive? <IoMdCloudDone /> : <MdOutlineCloudOff />
                                    }</td>
                                    <td><NavLink className='card-link' id="navlink-to-card-details" to={`/cards/${card.id}`}>{card.title}</NavLink></td>
                                    <td><NavLink className='card-link' id="navlink-to-public-url" to={card.publicUrl}><GoLink/></NavLink></td>
                                    <td>{formatUploaded(card.updatedAt)}</td>
                                    <td>{formatUploaded(card.createdAt)}</td>
                                    <td><IoMdSettings /></td>
                                    <td><CiMenuKebab id="track-menu-icon"
                                    // onClick={(e) => openTrackMenu(e, track.id, track.title)}
                                    /></td>
                                </tr>
                        ))}
                    </tbody>
                }
            </table>
        </div>
    )
}
