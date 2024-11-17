import { NavLink } from "react-router-dom"
import { TbCards } from "react-icons/tb";
import { GiMusicalScore } from "react-icons/gi";
import { CgMusicNote } from "react-icons/cg";
import { logout } from "../store/session";
import { useDispatch } from "react-redux";
import { PiImageSquareFill } from "react-icons/pi";
import {Power} from 'lucide-react'


export default function Navigation({ isLoaded }) {
    const dispatch = useDispatch()
    return (
        <div className="navigation-container">
            <ul className="navigation-ul">
                <li className="logo">
                    <NavLink to='/dashboard' style={{textDecoration:'none'}}>
                    <span className="link-icon"><CgMusicNote /></span>
                    <span className="link-text">SCORE SYNC</span></NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to='/cards' className={({ isActive }) => isActive ? 'nav-link active-nav-link' : "nav-link" }>
                        <span className="link-icon"><TbCards /></span>
                        <span className="link-text">Cards</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to='/catalog' className={({ isActive }) => isActive ? 'nav-link active-nav-link' : "nav-link" }>
                        <span className="link-icon"><GiMusicalScore /></span>
                        <span className="link-text">Catalog</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to='/images' className={({ isActive }) => isActive ? 'nav-link active-nav-link' : "nav-link" }>
                        <span className="link-icon"><PiImageSquareFill /></span>
                        <span className="link-text">Images</span>
                    </NavLink>
                </li>
            </ul>
                {isLoaded &&
                    <li className="nav-item">
                        <NavLink to='/' className="nav-link" style={{fontWeight:'bold'}} onClick={()=>dispatch(logout())}>
                            <span className="link-icon"><Power size={30} color="red"/></span>
                            <span className="link-text">Log Out</span>
                        </NavLink>
                    </li>
                }
        </div>
    );
}
