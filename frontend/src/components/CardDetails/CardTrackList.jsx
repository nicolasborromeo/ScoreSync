import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { FaPlay } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { useState } from 'react'
import { thunkUpdateCardTracklistOrder } from '../../store/cards';

export default function CardTrackList({ trackList, setTrackList, cardId, setAudioUrl, setTrackTitle }) {
    const dispatch = useDispatch()

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

    const handleTrackPlay = (url, title) => {
        setTrackTitle(title)
        setAudioUrl(url)
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tracks">
                {(provided) => (
                    <div id="card-playlist" {...provided.droppableProps} ref={provided.innerRef}>
                        {trackList?.map((track, i) => (
                            <Draggable key={track.id.toString()} draggableId={track.id.toString()} index={i}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <span> <FaPlay style={{ cursor: 'pointer' }} onClick={() => handleTrackPlay(track.filePath, track.title)} /></span>
                                        <span>{track.title}</span>
                                        <span>{track.duration}</span>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
