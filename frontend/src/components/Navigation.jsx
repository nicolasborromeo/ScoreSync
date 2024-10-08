import { NavLink } from "react-router-dom"
import { TbCards } from "react-icons/tb";
import { GiMusicalScore } from "react-icons/gi";
import { CiUser } from "react-icons/ci";
import { logout } from "../store/session";
import { useDispatch } from "react-redux";

export default function Navigation({isLoaded}) {
    const dispatch = useDispatch()
    return (
        <div className="navigation-container">
            <ul className="navigation-ul">
                <li>
                    <NavLink to='/portfolios'><TbCards />Portfolios</NavLink>
                </li>
                <li>
                    <NavLink to='/catalog'><GiMusicalScore />Catalog</NavLink>
                </li>
                {isLoaded &&
                <li>
                   <NavLink to='/' onClick={dispatch(logout)}><CiUser />Log Out</NavLink>
                </li>
                }
            </ul>
        </div>
    );
}
