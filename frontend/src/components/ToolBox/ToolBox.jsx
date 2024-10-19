import { useState, useEffect } from "react";
import { RiDragMoveFill } from "react-icons/ri";

export default function ToolBox({
    primaryBackground,
    setPrimaryBackground,
    secondaryBackground,
    setSecondaryBackground,
    primaryTextColor,
    setPrimaryTextColor,
    secondaryTextColor,
    setSecondaryTextColor,
    waveformColor,
    setWaveformColor,
}) {
    //Draggable functions and state:
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const style = {
        position: 'absolute',
        left: position.x,
        top: position.y,
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);

    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        // Cleanup function to remove listeners on unmount
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove]); // Run effect when isDragging changes

    //Tools function and state:
    const [changed, setChanged] = useState()

    useEffect(() => {

    }, [])


    return (
        <div id="toolbox-container" style={style}>
            <div>
                <p>Primary Background</p>
                <input type="color" value={primaryBackground} onChange={(e) => setPrimaryBackground(e.target.value)} />
                <button disabled={changed}>Set</button>
            </div>
            <div>
                <p>Secondary Background</p>
                <input type="color" value={secondaryBackground} onChange={(e) => setSecondaryBackground(e.target.value)} />
                <button disabled={changed}>Set</button>
            </div>
        <div>
            <p>Primary Text Color</p>
             <input type="color" value={primaryTextColor} onChange={(e) => setPrimaryTextColor(e.target.value)}/>
             <button disabled={changed}>Set</button>
        </div>
        <div>
            <p>Secondary Text Color</p>
            <input type="color" value={secondaryTextColor} onChange={(e) => setSecondaryTextColor(e.target.value)}/>
            <button disabled={changed}>Set</button>
        </div>
        <div>
            <p>Waveform Color</p>
            <input type="color" value={waveformColor} onChange={(e) => setWaveformColor(e.target.value)}/>
            <button disabled={changed}>Set</button>
        </div>
            <RiDragMoveFill
                size={50}
                id="toolbox-drag-icon"
                onMouseDown={handleMouseDown}
                style={{ cursor: 'pointer' }}
            />
        </div>
    );
}
