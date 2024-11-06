import './ExpandedImage.css'
import {XIcon} from "lucide-react";

export default function ExpandedImage({ img, closeModal }) {
    return (
        <div className="expanded-image-container">
            <span className='expanded-image-close' onClick={()=> closeModal()}><XIcon/></span>
            <img src={img.url} alt={img.name} />
        </div>
    )
}
