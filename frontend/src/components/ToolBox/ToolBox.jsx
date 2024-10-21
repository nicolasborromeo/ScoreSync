import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import { RiDragMoveFill } from "react-icons/ri";
import { TbTools } from "react-icons/tb";

import { thunkSaveCardColors } from "../../store/cards";



//COMPONENT
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
    secondaryEnabled,
    setSecondaryEnabled,
    cardId
}) {

    const dispatch = useDispatch()
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

    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        }
    }, [isDragging, offset])

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
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove]);
    //....end of draggin functionality....


    //Tools function and state:
    const [originalSecondaryBackground, setOriginalSecondaryBackground] = useState(secondaryBackground)
    const [minimized, setMinimized] = useState(true)

    useEffect(() => {
        if (secondaryEnabled) {
            setSecondaryBackground(originalSecondaryBackground)
        } else {
            setSecondaryBackground(primaryBackground)
        }
    }, [secondaryEnabled, originalSecondaryBackground, primaryBackground])

    //thunks API calls
    const handleSaveCardColors = () => {
        const colors = {
            primaryBackground,
            secondaryBackground,
            primaryTextColor,
            secondaryTextColor,
            waveformColor
        }
        dispatch(thunkSaveCardColors(cardId, colors)).then(()=> {
            window.alert('You color scheme has been saved')
        })
    }
    const toggleMinimize = () => {
        setMinimized((prev)=> !prev)
    }

    //RETURN
    if(minimized) return (
        <div id="toolbox-minimized-button">
            <TbTools
            onClick={toggleMinimize}
            size={30}
            />
        </div>
    )
    if(!minimized) return (
        <div id="toolbox-container" style={style}>
            <div id="toolbox-top-bar" onMouseDown={handleMouseDown}  style={{ cursor: isDragging ? 'grabbing' : 'all-scroll' }}>
                <span onClick={toggleMinimize}>-</span>

            </div>
            <div>
                <input
                    type="color"
                    value={primaryBackground}
                    onChange={(e) => setPrimaryBackground(e.target.value)}
                    />
                <p>Primary Background</p>
            </div>
            <div>
                <input type="color"
                    value={secondaryEnabled ? secondaryBackground : primaryBackground}
                    onChange={(e) => {
                        setSecondaryBackground(e.target.value)
                        setOriginalSecondaryBackground(e.target.value)
                    }}
                    />
                <p>Secondary Background</p>
                <input
                    type="checkbox"
                    defaultChecked={true}
                    onChange={() => setSecondaryEnabled((prev) => !prev)}
                    />
            </div>
            <div>
                <input
                    type="color"
                    value={primaryTextColor}
                    onChange={(e) => setPrimaryTextColor(e.target.value)}
                    />
                <p>Primary Text Color</p>
            </div>
            <div>
                <input
                    type="color"
                    value={secondaryTextColor}
                    onChange={(e) => setSecondaryTextColor(e.target.value)}
                    />
                <p>Secondary Text Color</p>
            </div>
            <div>
                <input
                    type="color"
                    value={waveformColor}
                    onChange={(e) => setWaveformColor(e.target.value)}
                    />
                <p>Waveform Color</p>
            </div>
            <div id="toolbox-button-container">
                <button
                onClick={handleSaveCardColors}
                >Save
                </button>
            </div>
        </div>
    );
}
