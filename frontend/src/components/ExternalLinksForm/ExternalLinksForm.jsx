import { useEffect, useState } from 'react'
import './ExternalLinksForm.css'
import { useSelector, useDispatch } from 'react-redux'
import { thunkGetExternalLinks, thunkAddExternalLink, thunkDeleteExternalLink } from '../../store/links'
import { ExternalLink } from '../CardDetails/ExternalLinkBar'
import { RiDeleteBin6Line } from "react-icons/ri";

export default function ExternalLinksForm() {
    const links = useSelector(state => state.links.linksArray)
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')
    const [errors, setErrors] = useState({})

    useEffect(() => {
        dispatch(thunkGetExternalLinks())
    }, [dispatch])

    const handleAddLink = () => {
        dispatch(thunkAddExternalLink(url)).catch(async (err) => {
            const error = await err.json()
            console.log('error', error)
            setErrors({ ...error.errors })
        })
    }

    const handleDeleteLink = (linkId) => {
        dispatch(thunkDeleteExternalLink(linkId))
    }
    return (
        <div className='external-links-form-container'>
            <h3>External Links</h3>
            <div className='text-and-button'>
                <p>Add your socials to be displayed by default in all the cards. Currently supported links: Instagram, Imdb, Facebook, Twitter, and Linkedin</p>
                <button className='dashboard-button' onClick={handleAddLink}>Add</button>
            </div>
            <form>
                <fieldset>
                    <legend>External Url</legend>
                    <label htmlFor="external-url">
                        <input
                            type='url'
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </label>
                </fieldset>
                {errors.url && <p className='error-p'>{errors.url}</p>}
            </form>
            <div className='external-links-list'>
                {links?.length > 0 && links?.map(link => (

                    <div key={link.id} className='external-link-row'>
                        <div>
                            <ExternalLink url={link.url} waveformColor={'#EB3678'} />
                            <p>{link.url}</p>
                        </div>
                        <RiDeleteBin6Line style={{cursor:'pointer', color:'red', filter:'grayscale(50%)'}}onClick={() => handleDeleteLink(link.id)} />
                    </div>
                ))}
            </div>
            {
                !links?.length
                &&
                <p>You don&apos;t have any links yet</p>
            }
        </div>
    )
}
