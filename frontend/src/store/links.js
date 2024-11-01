import { csrfFetch } from './csrf';

const SET_EXTERNAL_LINKS = "externalLinks/setExternalLinks"
const ADD_EXTERNAL_LINK = 'externalLinks/addExternalLink'
const DELETE_EXTERNAL_LINK = 'externalLinks/deleteExternalLink'

const setExternalLinks = (links) => {
    return {
        type: SET_EXTERNAL_LINKS,
        links
    }
}

const addExternalLink = (newLink) => {
    return {
        type: ADD_EXTERNAL_LINK,
        newLink
    }
}

const deleteExternalLink = (linkId) => {
    return {
        type: DELETE_EXTERNAL_LINK,
        linkId
    }
}

export const thunkGetExternalLinks = () => async dispatch => {
    const response = await csrfFetch(`/api/links`)
    if(response.ok) {
        const data = await response.json()
        dispatch(setExternalLinks(data))
    }
}

export const thunkAddExternalLink = (url) => async dispatch => {
    const response = await csrfFetch(`/api/links/`, {
        method: "POST",
        body: JSON.stringify({url})
    })
    if(response.ok) {
    const newLink = await response.json()
        dispatch(addExternalLink(newLink.newExternalLink))
    } else {
        const error = response.json()
        return error
    }

}

export const thunkDeleteExternalLink = (linkId) => async dispatch => {
    const response = await csrfFetch(`/api/links/${linkId}`, {
        method: "DELETE",
    })
    if(response.ok) {
        dispatch(deleteExternalLink(linkId))
    } else {
        const error = response.json()
        return error
    }
}

const initialSate = {}

const externalLinksReducer = (state = initialSate, action) =>{
    switch(action.type) {
        case SET_EXTERNAL_LINKS: {
            return {...state, linksArray: [...action.links]}
        }
        case ADD_EXTERNAL_LINK: {
            return {
                ...state,
                linksArray: [...state.linksArray, action.newLink]
            }
        }
        case DELETE_EXTERNAL_LINK: {
            return {
                ...state,
                linksArray: state.linksArray.filter(link => link.id !== action.linkId)
            }
        }
        default:
            return state
    }
}

export default externalLinksReducer
