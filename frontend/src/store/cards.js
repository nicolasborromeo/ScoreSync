import { csrfFetch } from './csrf';

const SET_USER_CARDS = "cards/setUserCards"
const SET_CURRENT_CARD = "cards/setCurrentCard"

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

export const thunkGetUserCards = () => async (dispatch) => {
    const response = await csrfFetch("/api/cards/current");
    const userCards = await response.json();
    dispatch(setUserCards(userCards));
    return userCards;
}

export const thunkGetCurrentCard = (cardId) => async dispatch => {
    const response = await csrfFetch(`/api/cards/${cardId}`);
    if (response.ok) {
        const card = await response.json();
        console.log('---------card after getting from thunk:', card)
        dispatch(setCurrentCard(card));
        return card;
    };
}

const initialState = {userCards: []}

const cardsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_CARDS:{
            return {...state, userCards: action.payload.userCards}
        }
        case SET_CURRENT_CARD: {
            return {...state, currentCard: action.card}
        }
        // case RECEIVE_TRACKS:
        //     return {...state, userTracks: [...state.userTracks, ...action.newlyUploadedTracks]};
        // case DELETE_TRACK: {
        //     let newState = {...state}
        //     let newTracksArray = newState.userTracks.filter(track => track.id !== action.trackId)
        //     delete newState.userTracks
        //     newState.userTracks = newTracksArray
        //     return newState
        // }
        // case UPDATE_TRACK_TITLE:{
        //     let newState = {...state}
        //     let newTracksArray = newState.userTracks.map(track => {
        //         if(track.id === action.payload.trackId) {
        //             track.title = action.payload.title
        //             return track
        //         }
        //         return track
        //     })
        //     delete newState.userTracks
        //     newState.userTracks = newTracksArray
        //     return newState
        // }
        default:
            return state
    }
}

export default cardsReducer
