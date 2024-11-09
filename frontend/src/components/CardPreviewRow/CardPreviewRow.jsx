import './CardPreviewRow.css'



import { useNavigate } from 'react-router-dom';



export default function CardPreviewRow({ cards }) {
    const navigate = useNavigate();

    return (
        <div className="card-preview-row-container">
            <p id="card-preview-row-title">Active Cards:</p>
            <div className="card-preview-row">

                {cards
                    .filter((card) => card.isActive)
                    .map((card) => (
                        <div
                            key={card.id}
                            className="card-preview-container"
                            onClick={() => navigate(`/cards/${card.id}`)}
                        >
                            <iframe
                                src={`http://localhost:5173/${card.privateToken}`} // URL based on the card's ID
                                title={`Preview of ${card.title}`}
                                className="card-preview-iframe"
                            />
                        </div>
                    ))}
                
            </div>
        </div>
    );
}
