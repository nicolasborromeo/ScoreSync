import { useSelector } from "react-redux"
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaImdb } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";


export default function ExternalLinkBar({ externalLinks, waveformColor }) {

    return (
        <div id="external-links-bar">
            {externalLinks?.map(link => (
                <ExternalLink url={link.url} key={link.id} waveformColor={waveformColor} />
            ))}
        </div>
    )
}



const ExternalLink = ({ url, waveformColor }) => {
    console.log('url', url)
    if (url.includes('imdb')) {
        return <Link to={url}
                target="_blank"
                rel="noopener noreferrer external">
                    <FaImdb color={waveformColor}/>
                </Link>;
    } else if (url.includes('instagram')) {
        return <Link
                to={url}
                target="_blank"
                rel="noopener noreferrer external"
                 >
                    <FaInstagram color={waveformColor} />
                 </Link>;
    } else if (url.includes('facebook')) {
        return <Link
                to={url}
                target="_blank"
                rel="noopener noreferrer external"
                >
                    <FaFacebook color={waveformColor} />
                </Link>;
    } else if (url.includes('linkedin')) {
        return <Link
                    to={url}
                    target="_blank"
                    rel="noopener noreferrer external"
                >
                    <FaLinkedin color={waveformColor} />
                </Link>;
    } else if (url.includes('x')) {
        return <Link
                    to={url}
                    target="_blank"
                    rel="noopener noreferrer external"
                >
                        <FaXTwitter color={waveformColor} />
                </Link>;
    }
    return <p>PPPPP</p>;
};
