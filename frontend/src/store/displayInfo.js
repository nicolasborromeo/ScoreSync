import { csrfFetch } from './csrf';

const SET_DISPLAY_INFO = "displayInfo/setDisplayInfo"
const UPDATE_INFO = "displayInfo/updateInfo"

const setDisplayInfo = (displayInfo) => {
    return {
        type: SET_DISPLAY_INFO,
        displayInfo
    }
}

const updateDisplayInfo = (updatedInfo) => {
    return {
        type: UPDATE_INFO,
        updatedInfo
    }
}

export const thunkGetUsersDisplayInfo = () => async dispatch => {
    const response = await csrfFetch(`/api/displayinfo/current`)
    if(response.ok) {
        const data = await response.json()
        dispatch(setDisplayInfo(data))
    }
}

export const thunkSaveDisplayInfo = (data) => async dispatch => {
    const response = await csrfFetch(`/api/displayinfo/current`, {
        method: "POST",
        body: JSON.stringify({data})
    })
    if(response.ok) {
        const data = await response.json()
        dispatch(updateDisplayInfo(data))
    }
}


const initialSate ={}

const displayInfoReducer = (state = initialSate, action) =>{
    switch(action.type) {
        case SET_DISPLAY_INFO: {
            return {...state, ...action.displayInfo}
        }
        case UPDATE_INFO: {
            return {
                ...action.updatedInfo
            }
        }
        default:
            return state
    }
}

export default displayInfoReducer
