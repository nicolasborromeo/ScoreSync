import { NavLink } from "react-router-dom"


export default function Navigation() {

    return (
        <div className="navigation-container">
            <ul className="navigation-ul">
                <li className="logos-container">
                    <NavLink to='/'><img className='navigation-logo' src="/Logo.png" /></NavLink>
                    <NavLink to='/'><img className='navigation-brand' src="/brand.png" /></NavLink>
                </li>
                <li className="user-menu-container">

                </li>
            </ul>
        </div>
    );
}
