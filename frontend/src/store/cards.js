import { csrfFetch } from './csrf';

const SET_USER_CARDS = "portfolios/setUserCards"

const setUserCards = (userCards) => {
    return {
        type: SET_USER_CARDS,
        payload: userCards
    }
}
export const thunkGetUserCards = () => async (dispatch) => {
    const response = await csrfFetch("/api/cards/current")
    const userCards = await response.json()
    console.log('--------userCARDS:', userCards)
    dispatch(setUserCards(userCards));
    return userCards
}

const initialState = {userCards: []}

const cardsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_CARDS:{
            return {...state, userCards: action.payload.userCards}
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
