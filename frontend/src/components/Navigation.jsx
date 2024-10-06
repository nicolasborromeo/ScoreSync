import { NavLink } from "react-router-dom"
import { TbCards } from "react-icons/tb";
import { GiMusicalScore } from "react-icons/gi";


export default function Navigation() {

    return (
        <div className="navigation-container">
            <ul className="navigation-ul">
                <li>
                    <NavLink to='/portfolios'><TbCards />Portfolios</NavLink>
                </li>
                <li>
                    <NavLink to='/catalog'><GiMusicalScore />Catalog</NavLink>
                </li>
            </ul>
        </div>
    );
}
