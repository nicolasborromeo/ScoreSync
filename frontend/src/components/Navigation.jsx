import { NavLink } from "react-router-dom"
import { TbCards } from "react-icons/tb";
import { GiMusicalScore } from "react-icons/gi";
import { CgMusicNote } from "react-icons/cg";
import { logout } from "../store/session";
import { useDispatch } from "react-redux";
import { PiImageSquareFill } from "react-icons/pi";
import { Power } from 'lucide-react'

const navItems = [
    { to: '/cards', label: 'Cards', icon: <TbCards /> },
    { to: '/catalog', label: 'Catalog', icon: <GiMusicalScore /> },
    { to: '/images', label: 'Images', icon: <PiImageSquareFill /> },
]

export default function Navigation({ isLoaded }) {
    const dispatch = useDispatch()

    return (
        <aside className="navigation-container">
            <NavLink to='/dashboard' className="logo" style={{ textDecoration: 'none' }}>
                <span className="brand-badge"><CgMusicNote /></span>
                <span className="brand-copy">
                    <strong>ScoreSync</strong>
                    <small>Pitch cards for music</small>
                </span>
            </NavLink>

            <ul className="navigation-ul">
                {navItems.map(({ to, label, icon }) => (
                    <li className="nav-item" key={to}>
                        <NavLink to={to} className={({ isActive }) => isActive ? 'nav-link active-nav-link' : 'nav-link'}>
                            <span className="link-icon">{icon}</span>
                            <span className="link-text">{label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>

            {isLoaded && (
                <div className="nav-footer">
                    <NavLink to='/' className="nav-link nav-link-logout" onClick={() => dispatch(logout())}>
                        <span className="link-icon"><Power size={22} /></span>
                        <span className="link-text">Log out</span>
                    </NavLink>
                </div>
            )}
        </aside>
    );
}
