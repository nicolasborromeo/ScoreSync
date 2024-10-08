import { csrfFetch } from './csrf';

const SET_USER_TRACKS = "tracks/setUserTracks"
const RECEIVE_TRACKS = "tracks/receiveTracks"
const DELETE_TRACK = 'tracks/deleteTrack'

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

const deleteTrack = (trackId) => {
    return {
        type: DELETE_TRACK,
        trackId: trackId
    }
}

export const thunkGetUserTracks = () => async (dispatch) => {
    const response = await csrfFetch("/api/tracks/current")
    const userTracks = await response.json()
    dispatch(setUserTacks(userTracks));
    return userTracks
}

export const thunkUploadTracks = (tracks) => async dispatch => {
    const formData = new FormData();
    Array.from(tracks).forEach(track => formData.append("tracks", track))
    const response = await csrfFetch(`/api/tracks/`, {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(receiveTracks(data));
      }
      return response;
}

export const thunkDeleteTrack = (trackId) => async dispatch => {
    const response = await csrfFetch(`/api/tracks/${trackId}`, {
        method: "DELETE"
    })
    if(response.ok) dispatch(deleteTrack(trackId))
}

const initialState = {}

const catalogReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_TRACKS:{
            return {...state, userTracks: action.payload.userTracks}
        }
        case RECEIVE_TRACKS:
            return {...state, userTracks: [...state.userTracks, ...action.newlyUploadedTracks]};
        case DELETE_TRACK: {
            let newState = {...state}
            let newTracksArray = newState.userTracks.filter(track => track.id !== action.trackId)
            delete newState.userTracks
            newState.userTracks = newTracksArray
            return newState
        }
        default:
            return state
    }
}

export default catalogReducer
