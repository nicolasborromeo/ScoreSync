import { csrfFetch } from './csrf';

const SET_USER_CARDS = "cards/setUserCards"
const SET_CURRENT_CARD = "cards/setCurrentCard"
const DELETE_CARD = "card/deleteCard"
const UPDATE_CARD = "cards/updateCard"
const UPDATE_CARD_IMAGE = "cards/updateCardImage"
const REMOVE_CARD_TRACK = "cards/removeCardTrack"
const ADD_TRACKS_TO_CARD = "cards/addTracksToCard"
const RENAME_CARD = "cards/renameCard"
const UPDATE_CARD_STYLES = "cards/updateCardStyles"
const UPDATE_TRACKLIST_ORDER = "cards/updateTracklistOrder"

const setUserCards = (userCards) => {
    return {
        type: SET_USER_CARDS,
        payload: userCards
    }
}

const setCurrentCard = (card) => {
    return {
        type: SET_CURRENT_CARD,
        card
    }
}

const updateCard = (updatedCard) => {
    return {
        type: UPDATE_CARD,
        updatedCard
    }
}

const updateCardImage = (newImage, imgType) => {
    return {
        type: UPDATE_CARD_IMAGE,
        newImage, imgType
    }
}

const removeCardTrack = (trackId) => {
    return {
        type: REMOVE_CARD_TRACK,
        trackId
    }
}

const addTracksToCard = (selectedTracks) => {
    return {
        type: ADD_TRACKS_TO_CARD,
        selectedTracks
    }
}

const deleteCard = (cardId) => {
    return {
        type: DELETE_CARD,
        cardId
    }
}

const renameCard = (cardId, title) => {
    return {
        type: RENAME_CARD,
        payload: {
            cardId, title
        }
    }
}

const updateCardStyles = (colors, font) => {
    return {
        type: UPDATE_CARD_STYLES,
        colors, font
    }
}

const updateTracklistOrder = (tracklist) => {
    return {
        type: UPDATE_TRACKLIST_ORDER,
        tracklist
    }
}

export const thunkGetUserCards = () => async (dispatch) => {
    const response = await csrfFetch("/api/cards/current")
    const userCards = await response.json()
    dispatch(setUserCards(userCards))
    return userCards
}

export const thunkGetCurrentCard = (cardId) => async dispatch => {
    const response = await csrfFetch(`/api/cards/${cardId}`)
    if (response.ok) {
        const card = await response.json()
        dispatch(setCurrentCard(card))
        return card
    }
}

export const thunkUpdateCardTracklistOrder = (cardId, tracklist) => async dispatch => {
    const response = await csrfFetch(`/api/cards/tracklist/${cardId}`, {
        method: 'PUT',
        body: JSON.stringify({ tracklist })
    })
    // if(response.ok) {
    //     dispatch(updateTracklistOrder(tracklist))
    // }
    if (!response.ok) {
        const error = await response.json()
        console.error(error)
    }
}

export const thunkUpdateCard = (cardId, column, editValue) => async dispatch => {
    const body = {
        column: column,
        editValue: editValue
    }
    const response = await csrfFetch(`/api/cards/${cardId}`, {
        method: "PUT",
        body: JSON.stringify(body)
    })
    if (response.ok) {
        const data = await response.json()
        dispatch(updateCard(data))
    }
}

export const thunkUpdateCardImage = (cardId, imgType, imgId) => async dispatch => {

    const response = await csrfFetch(`/api/cards/${cardId}/images`, {
        method: "PUT",
        body: JSON.stringify({ imgType, imgId })
    })
    if (response.ok) {
        const data = await response.json()
        const { newImage, imgType } = data
        dispatch(updateCardImage(newImage, imgType))
    }
}

export const thunkRemoveCardTrack = (cardId, trackId) => async dispatch => {
    const response = await csrfFetch(`/api/cards/${cardId}/${trackId}`, {
        method: "DELETE"
    })
    const data = await response.json()
    dispatch(removeCardTrack(data.trackId))
}

export const thunkAddTracksToCard = (cardId, selectedTracks) => async dispatch => {
    const response = await csrfFetch(`/api/cards/${cardId}/tracklist`, {
        method: "POST",
        body: JSON.stringify({ selectedTracks })
    })
    if (response.ok) {
        dispatch(addTracksToCard(selectedTracks))
    }
}

export const thunkCreateNewCard = (title) => async dispatch => {
    const response = await csrfFetch(`/api/cards`, {
        method: "POST",
        body: JSON.stringify({ title })
    })
    if (response.ok) {
        const data = await response.json()
        dispatch(setCurrentCard(data))
        return data
    }
}

export const thunkDeleteCard = (cardId) => async dispatch => {
    const response = await csrfFetch(`/api/cards/${cardId}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        dispatch(deleteCard(cardId))
    }
}

export const thunkRenameCard = (cardId, title) => async dispatch => {
    const response = await csrfFetch(`/api/cards/${cardId}/rename`, {
        method: "PUT",
        body: JSON.stringify({title})
    })
    if (response.ok) {
        dispatch(renameCard(cardId, title))
    }
}

export const thunkSaveCardStyles = (cardId, colors, font) => async dispatch => {
    const response = await csrfFetch(`/api/cardstyles/${cardId}`, {
        method: "PUT",
        body: JSON.stringify({colors, font})
    })
    if(response.ok) {
        dispatch(updateCardStyles(colors, font))
    }
}

export const thunkGetPreviewCard = (privateToken) => async dispatch => {
    const response = await csrfFetch(`/api/cards/preview/${privateToken}`)
    if(response.ok) {
        const cardData = await response.json()
        dispatch(setCurrentCard(cardData))
        return(cardData)
    }
}

export const thunkCheckUserDisplayInfo = () => async () => {
    const response = await csrfFetch(`/api/displayinfo/current`)
    const data = await response.json()
    return data
}

const initialState = { userCards: [] }

const cardsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_CARDS: {
            return { ...state, userCards: action.payload.userCards }
        }
        case SET_CURRENT_CARD: {
            return { ...state, currentCard: action.card }
        }
        case UPDATE_CARD: {
            const { updatedCard } = action
            let newState = { ...state }
            let newCurrentCard = { ...newState.currentCard, ...updatedCard }
            delete newState.currentCard
            newState.currentCard = newCurrentCard
            return newState
        }
        case UPDATE_CARD_IMAGE: {
            const { imgType, newImage } = action
            let newState = { ...state }
            if (imgType === 'banner') {
                delete newState.currentCard.Banner
                newState.currentCard.Banner = newImage
            }
            if (imgType === 'headshot') {
                delete newState.currentCard.Headshot
                newState.currentCard.Headshot = newImage
            }
            if (imgType === 'profile') {
                delete newState.currentCard.ProfilePic
                newState.currentCard.ProfilePic = newImage
            }
            return newState
        }
        case REMOVE_CARD_TRACK: {
            const { trackId } = action
            let newState = { ...state }
            let newTracklist = newState.currentCard.Tracks.filter(track => track.id !== Number(trackId))
            delete newState.currentCard.Tracks
            newState.currentCard.Tracks = newTracklist
            return newState
        }
        case ADD_TRACKS_TO_CARD: {
            const { selectedTracks } = action
            const tracksArray = Object.values(selectedTracks)
            let newState = {
                ...state,
                currentCard: {
                    ...state.currentCard,
                    Tracks: [...state.currentCard.Tracks, ...tracksArray]
                }
            }
            return newState
        }
        case DELETE_CARD: {
            const { cardId } = action
            return {
                ...state,
                userCards: state.userCards.filter(card=> card.id !== Number(cardId))
            }
        }
        case RENAME_CARD: {
            const {cardId, title} = action.payload
            return {
                ...state,
                userCards: state.userCards.map(card=> {
                    if(card.id === cardId) {
                        card.title = title
                    }
                    return card
                })
            }
        }
        case UPDATE_CARD_STYLES: {
            const {colors, font} = action
            return {
                ...state,
                currentCard: {
                    ...state.currentCard,
                    CardColor: colors,
                    CardFont: font
                }
            }
        }
        case UPDATE_TRACKLIST_ORDER: {
            const {tracklist} = action
            return {
                ...state,
                currentCard: {
                    ...state.currentCard,
                    Tracks: [...tracklist]
                }
            }
        }
        default:
            return state
    }
}

export default cardsReducer
