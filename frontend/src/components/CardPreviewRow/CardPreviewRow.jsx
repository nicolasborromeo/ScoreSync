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
                    .slice(0,6) //limiting the previews to 6 cards
                    .map((card) => (
                        <div
                            key={card.id}
                            className="card-preview-container"
                            onClick={() => navigate(`/cards/${card.id}`)}
                        >
                            <iframe
                                src={`${card.publicUrl}`}
                                title={`Preview of ${card.title}`}
                                className="card-preview-iframe"
                            />
                        </div>
                    ))}

            </div>
        </div>
    );
}
