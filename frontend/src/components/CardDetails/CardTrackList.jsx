import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { FaPlay } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { thunkUpdateCardTracklistOrder, thunkRemoveCardTrack } from '../../store/cards';
import { formatSecsToMins } from '../../utils/utils'

import { RiDeleteBin6Line } from "react-icons/ri";
import { useEffect } from 'react';


export default function CardTrackList({ trackList, setTrackList, cardId, setAudioUrl, waveformColor, isPublic=false }) {
    const dispatch = useDispatch()


    useEffect(() => {
        if (trackList) {
            setTrackList(trackList)
        }
    }, [trackList, setTrackList])

    //handle empty tracklist
    useEffect(() => {
        if (!trackList.length) {
            setTrackList([])
            setAudioUrl('')
        }
    }, [setTrackList, trackList.length, setAudioUrl])

    //Re-Ordering function
    const onDragEnd = (result) => {
        const { destination, source } = result
        if (!destination) return //in the result object if the destination value is null means the user dropped outside or canceled
        if (destination.droppableId === source.droppableId &&
            destination.index === source.index) return // if true means that the user dropped the item in the same place it was

        const reorderedTracks = [...trackList]
        const movedTrack = reorderedTracks[source.index]
        reorderedTracks.splice(source.index, 1);
        reorderedTracks.splice(destination.index, 0, movedTrack)

        setTrackList(reorderedTracks)
        dispatch(thunkUpdateCardTracklistOrder(cardId, reorderedTracks))
    }

    //Audioplayer functions
    const handleTrackPlay = (url) => {
        // setTrackTitle(title)
        setAudioUrl(url)
    }

    //Thunk Actions
    const handleRemoveCardTrack = (trackId) => {
        dispatch(thunkRemoveCardTrack(cardId, trackId))
        const updatedTrackList = trackList.filter(track => track.id !== trackId);
        setTrackList(updatedTrackList);
    }



    return (
        <div id="tracklist-container">
            <DragDropContext onDragEnd={ onDragEnd}>
                <Droppable droppableId="tracks">
                    {(provided) => (
                        <div id="card-playlist" {...provided.droppableProps} ref={provided.innerRef}
                            style={{
                                // color: primaryTextColor,
                                border:`1px solid ${waveformColor}44`,
                                borderRadius:'15px',
                                overflow:'scroll'}}
                        >
                            {trackList?.map((track, i) => (
                                <Draggable key={track.id.toString()} draggableId={track.id.toString()} index={i} isDragDisabled={isPublic}>
                                    {(provided) => (
                                        <div
                                            className="card-track-row"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <div className="track-row-play-and-title-container">
                                                <span id="trackrow-play-button"> <FaPlay style={{ cursor: 'pointer' }} onClick={() => handleTrackPlay(track.filePath, track.title)} /></span>
                                                <span>{track.title}</span>
                                            </div>
                                            <div className="track-row-duration-delete-container">
                                                <span>{formatSecsToMins(track.duration)}</span>
                                               { !isPublic && <span > <RiDeleteBin6Line style={{ cursor: 'pointer' }} onClick={() => handleRemoveCardTrack(track.id)} /></span>}
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
