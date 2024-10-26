import './InactiveCard.css'
import './InactiveCard.css';
import { IoCloudOffline } from "react-icons/io5";

export default function InactiveCard() {
    return (
        <div className="inactive-card-container">
            <IoCloudOffline className="inactive-icon" />
            <h2 className="inactive-title">Oops! This Card is Inactive</h2>
            <p className="inactive-message">
                The card you&apos;re trying to view is currently inactive. Please check back later or contact support for more information.
            </p>
        </div>
    );
}
