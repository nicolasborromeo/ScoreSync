import { csrfFetch } from './csrf';

const SET_USER_TRACKS = "tracks/setUserTracks"

const setUserTacks = (userTracks) => {
    return {
        type: SET_USER_TRACKS,
        payload: userTracks
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
    const response = await csrfFetch(`/api/tracks/${userId}`, {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(receiveImages(data));
      }
      return response;
}


const initialState = {}

const catalogReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_TRACKS:
            return {...state, userTracks: action.payload.userTracks}
        default:
            return state
    }
}

export default catalogReducer
