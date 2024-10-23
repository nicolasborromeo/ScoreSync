import { Link } from "react-router-dom"

export default function ContactInfo({ secondaryTextColor, waveformColor, displayInfo }) {
    return (
        <>
            <h2>Contact</h2>
            <div id="contact-info-component" style={{ color: waveformColor }}>
                {displayInfo?.website &&
                    <Link
                        to={`${displayInfo.website}`}
                        target="_blank"
                        rel="noopener noreferrer external"
                        style={{ color: waveformColor, textDecoration: 'none' }} // Here, we remove textDecoration
                        className="contact-link"
                        id="website"
                    >
                        {displayInfo.website?.split('//')[1]}
                    </Link>}
                {displayInfo?.email &&
                    <a
                        href={`mailto:${displayInfo.email}`}
                        style={{ color: waveformColor, textDecoration: 'none' }}
                        id="email"
                        className="contact-link"
                    >
                        {displayInfo.email}
                    </a>}
                {displayInfo?.phone &&
                    <Link
                        href={`tel:${displayInfo.phone}`}
                        style={{ color: waveformColor, textDecoration: 'none' }}
                        id="phone"
                        className="contact-link"
                    >
                        {displayInfo.phone}
                    </Link>}
            </div>
        </>
    )


}
