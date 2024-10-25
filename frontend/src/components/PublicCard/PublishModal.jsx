import { FaCopy } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoMdCheckboxOutline } from "react-icons/io";
import { useState } from "react";

import './PublishModal.css'

export default function PublishModal({ publicUrl, closeModal, navigate }) {
    const [copied, setCopied] = useState(false)

    const handleCopyToClipboard = async () => {
        await navigator.clipboard.writeText(publicUrl)
        setCopied(true)
    }

    const handleViewCard = () => {
        window.open(`${publicUrl}`, '_blank')
    }

    return (
        <>
            <div id="decoration-top-line"></div>
            <div id="close-modal-x"><IoMdClose onClick={() => closeModal()} /></div>
            <div id="publish-modal">
                <h3 id="publish-modal-title">Congratulations</h3>
                <h5 id="publish-modal-title-subtitle">Your card is published and live online</h5>
                <div id="copy-to-clipboard-and-address">
                    <span id="publish-modal-icon-container">
                    {copied ? (<IoMdCheckboxOutline size={20} />) : (<FaCopy onClick={handleCopyToClipboard} style={{ cursor: 'pointer' }} />)}
                    </span>
                    <p>{publicUrl}</p>
                </div>
                <div id="publish-modal-buttons">
                    <button id="done-button" onClick={() => closeModal()}>Done</button>
                    <button id="view-card-button" onClick={handleViewCard}>View Card</button>
                </div>

            </div>
        </>
    )
}
