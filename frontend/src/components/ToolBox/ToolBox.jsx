import './ToolBox.css'
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { GiPalette } from "react-icons/gi";

import { thunkSaveCardStyles } from "../../store/cards";



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
    cardId,
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize
}) {

    const dispatch = useDispatch()
    const card = useSelector(state => state.cards.currentCard)
    //Draggable functions and state:
    const [position, setPosition] = useState({ x: 200, y: 200 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const style = {
        position: 'fixed',
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

    //resetting the colors and fonts when clicking on new card
    useEffect(() => {
        if (cardId) {
            setPrimaryBackground(card?.CardColor?.primaryBackground);
            setSecondaryBackground(card?.CardColor?.secondaryBackground);
            setPrimaryTextColor(card?.CardColor?.primaryTextColor);
            setSecondaryTextColor(card?.CardColor?.secondaryTextColor);
            setWaveformColor(card?.CardColor?.waveformColor);

            setOriginalSecondaryBackground(card?.CardColor?.secondaryBackground);
            setSecondaryEnabled(true);

            setFontFamily(card?.CardFont?.fontFamily)
            setFontSize(card?.CardFont?.fontSize)
        }
    }, [cardId, card, setPrimaryBackground, setSecondaryBackground, setPrimaryTextColor, setSecondaryTextColor, setWaveformColor, setOriginalSecondaryBackground, setSecondaryEnabled, setFontFamily, setFontSize]);

    //logic to enable/disable secondary background
    useEffect(() => {
        if (secondaryEnabled) {
            setSecondaryBackground(originalSecondaryBackground);
        } else {
            setSecondaryBackground(primaryBackground);
        }
    }, [secondaryEnabled, originalSecondaryBackground, primaryBackground, setSecondaryBackground]);

    //thunks API calls
    const handleSaveCardStyles = () => {
        const colors = {
            primaryBackground,
            secondaryBackground: secondaryEnabled ? secondaryBackground : primaryBackground,
            primaryTextColor,
            secondaryTextColor,
            waveformColor
        }
        const font = {
            fontFamily, fontSize
        }
        setMinimized(true)
        dispatch(thunkSaveCardStyles(cardId, colors, font))
            .then(() => {
                window.alert('Theme saved')
            })
    }

    const handleRevertStyle = () => {
        setPrimaryBackground(card?.CardColor?.primaryBackground);
        setSecondaryBackground(card?.CardColor?.secondaryBackground);
        setPrimaryTextColor(card?.CardColor?.primaryTextColor);
        setSecondaryTextColor(card?.CardColor?.secondaryTextColor);
        setWaveformColor(card?.CardColor?.waveformColor);

        setOriginalSecondaryBackground(card?.CardColor?.secondaryBackground);
        setSecondaryEnabled(true);

        setFontFamily(card?.CardFont?.fontFamily)
        setFontSize(card?.CardFont?.fontSize)
        setMinimized(true)
    }

    const toggleMinimize = () => {
        setMinimized((prev) => !prev)
    }

    const openToolBox = (e) => {
        setPosition({
            x: e.pageX,
            y: e.pageY - 350
        })
        setMinimized(false)
    }

    //RETURN
    if (minimized) return (
        <>
            {/* <p id="toolbox-customize-text">Customize:</p> */}
            <div id="toolbox-minimized-button">
                <GiPalette
                    onClick={openToolBox}
                    size={30}
                />
            </div>
        </>
    )
    if (!minimized) return (
        <div id="toolbox-container" style={style}>
            <div id="toolbox-top-bar" onMouseDown={handleMouseDown} style={{ cursor: isDragging ? 'grabbing' : 'all-scroll' }}>
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
                        setSecondaryBackground(e.target.value);
                        setOriginalSecondaryBackground(e.target.value);
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
            {/* <div>
                <input
                    type="color"
                    value={secondaryTextColor}
                    onChange={(e) => setSecondaryTextColor(e.target.value)}
                />
                <p>Secondary Text Color</p>
            </div> */}
            <div>
                <input
                    type="color"
                    value={waveformColor}
                    onChange={(e) => setWaveformColor(e.target.value)}
                />
                <p>Waveform Color</p>
            </div>

            {/* fonts */}
            <div className="separator"></div>
            <div id="toolbox-font-container">
                <p>Font Style</p>
                <div>
                    <select id="font-selector" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                        <option value="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Default</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Raleway">Raleway</option>
                        <option value="Lora">Lora</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Futura">Futura</option>
                        <option value="Avenir">Avenir</option>
                        <option value="Bebas Neue">Bebas Neue</option>
                        <option value="Oswald">Oswald</option>
                        <option value="Josefin Sans">Josefin Sans</option>
                        <option value="Proxima Nova">Proxima Nova</option>
                        <option value="Merriweather">Merriweather</option>
                        <option value="Cabin">Cabin</option>
                        <option value="Fjalla One">Fjalla One</option>
                    </select>
                    <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
                </div>
            </div>
            <div className="separator"></div>
            <div id="toolbox-button-container">
                <button
                    className='add-tracks-button'
                    onClick={handleRevertStyle}
                >Cancel
                </button>
                <button
                    className='add-tracks-button'
                    onClick={handleSaveCardStyles}
                >Save
                </button>
            </div>
        </div>
    );
}
