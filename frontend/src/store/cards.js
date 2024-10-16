import { csrfFetch } from './csrf';

const SET_USER_CARDS = "cards/setUserCards"
const SET_CURRENT_CARD = "cards/setCurrentCard"
const UPDATE_CARD = "cards/updateCard"


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

export const thunkUpdateCardTracklistOrder = (cardId, tracklist) => async () => {
    const response = await csrfFetch(`/api/cards/tracklist/${cardId}`, {
        method: 'PUT',
        body: JSON.stringify({ tracklist })
    })

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
        console.log('DATAAAAAAAA:', data)
        dispatch(updateCard(data))
    }
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
            const {updatedCard} = action
            let newState ={...state}
            let newCurrentCard = {...newState.currentCard, ...updatedCard}
            delete newState.currentCard
            newState.currentCard = newCurrentCard
            return newState
        }
        default:
            return state
    }
}

export default cardsReducer
