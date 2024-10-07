import { csrfFetch } from './csrf';

const SET_USER_TRACKS = "tracks/setUserTracks"
const RECEIVE_TRACKS = "tracls/receiveTracks"

const setUserTacks = (userTracks) => {
    return {
        type: SET_USER_TRACKS,
        payload: userTracks
    }
}

const receiveTracks = (newlyUploadedTracks) => {
    return {
        type: RECEIVE_TRACKS,
        newlyUploadedTracks
    }
}

export const thunkGetUserTracks = () => async (dispatch) => {
    const response = await csrfFetch("/api/tracks/current")
    const userTracks = await response.json()
    dispatch(setUserTacks(userTracks));
    return userTracks
}

export const thunkUploadTracks = (tracks, userId) => async dispatch => {
    const formData = new FormData();
    Array.from(tracks).forEach(track => formData.append("tracks", track))
    const response = await csrfFetch(`/api/tracks/`, {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        console.log('RESPONSE OK. DATA: ', data)
        dispatch(receiveTracks(data));
      }
      return response;
}


const initialState = {}

const catalogReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_TRACKS:
            return {...state, userTracks: action.payload.userTracks}
        case RECEIVE_TRACKS:
            let newState = {...state}
            newState.userTracks = [...newState.userTracks, ...action.newlyUploadedTracks]
            return newState
        default:
            return state
    }
}

export default catalogReducer
