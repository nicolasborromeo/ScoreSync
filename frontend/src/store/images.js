import { csrfFetch } from './csrf';

const SET_USER_IMAGES = "images/setUserImages"
const UPDATE_IMAGE_NAME = "images/updateImageName"
const DELETE_IMAGE = "images/deleteImage"
const RECEIVE_IMAGES = "images/receiveImages"

const setUserImages = userImages => {
    return {
        type: SET_USER_IMAGES,
        userImages
    }
}

const updateImageName = (imageId, name) => {
    console.log(name)
    return {
        type: UPDATE_IMAGE_NAME,
        payload: {
            imageId,
            name
        }
    }
}

const deleteImage = (imageId) => {
    return {
        type: DELETE_IMAGE,
        imageId: imageId
    }
}

const receiveImages = (newlyUploadedImages) => {
    return {
        type: RECEIVE_IMAGES,
        newlyUploadedImages
    }
}

export const thunkGetUserImages = () => async (dispatch) => {
    const response = await csrfFetch("/api/images/current")
    const userImages = await response.json()
    dispatch(setUserImages(userImages));
    return userImages
}

export const thunkUpdateImageName = (imageId, name) => async dispatch => {
    const response = await csrfFetch(`/api/images/${imageId}`, {
        method: "PUT",
        body: JSON.stringify({name})
    })
    if(response.ok) {
        const data = await response.json()
        dispatch(updateImageName(imageId, data.newName))
    }else {
        const errors = await response.json()
        return errors
    }
}

export const thunkDeleteImage = (imageId) => async dispatch => {
    const response = await csrfFetch(`/api/images/${imageId}`, {
        method: "DELETE"
    })
    if(response.ok) dispatch(deleteImage(imageId))
}

export const thunkUploadImages = (images) => async dispatch => {
    const formData = new FormData();
    Array.from(images).forEach(image => formData.append("images", image))

    const response = await csrfFetch(`/api/images/`, {
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

const imagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_IMAGES:{
            return {...state, userImages: [...action.userImages.userImages]}
        }
        case RECEIVE_IMAGES:
            return {...state, userImages: [...state.userImages, ...action.newlyUploadedImages]};
        case DELETE_IMAGE: {
            let newState = {...state}
            let newImagesArray = newState.userImages.filter(image => image.id !== action.imageId)
            delete newState.userImages
            newState.userImages = newImagesArray
            return newState
        }
        case UPDATE_IMAGE_NAME:{
            let newState = {...state}
            let newImagesArray = newState.userImages.map(image => {
                if(image.id === action.payload.imageId) {
                    image.name = action.payload.name
                    return image
                }
                return image
            })
            delete newState.userImages
            newState.userImages = newImagesArray
            return newState
        }
        default:
            return state
    }
}

export default imagesReducer
