import { useEffect, useState } from 'react'
import './ExternalLinksForm.css'
import { useSelector, useDispatch } from 'react-redux'
import { thunkGetExternalLinks, thunkAddExternalLink, thunkDeleteExternalLink } from '../../store/links'
import { ExternalLink } from '../CardDetails/ExternalLinkBar'
import { Plus, Trash } from 'lucide-react'

export default function ExternalLinksForm() {
    const links = useSelector(state => state.links.linksArray)
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')
    const [errors, setErrors] = useState({})

    useEffect(() => {
        dispatch(thunkGetExternalLinks())
    }, [dispatch])

    const handleAddLink = () => {
        dispatch(thunkAddExternalLink(url))
            .then(() => setUrl(''))
            .catch(async (err) => {
                setErrors({})
                const error = await err.json()
                setErrors({ ...error.errors })
            })

    }

    const handleDeleteLink = (linkId) => {
        dispatch(thunkDeleteExternalLink(linkId)).then(() => setUrl('')).then(setErrors({}))
    }
    return (
        <div className='external-links-form-container'>
            <h3>Social Media Links</h3>
            <div className='subtitle-text'>
                <p>Add your socials to be displayed by default in all the cards. Currently supported links: Instagram, Imdb, Facebook, Twitter, and Linkedin</p>

            </div>
            <div className='form-and-button-container'>

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
                <Plus onClick={handleAddLink}/>
            </div>

            <div className='external-links-list'>
                {links?.length > 0 && links?.map(link => (

                    <div key={link.id} className='external-link-row'>
                        <div>
                            <ExternalLink url={link.url} waveformColor={'#BD1792'} />
                            <p>{link.url}</p>
                        </div>
                        <Trash size={15} style={{ cursor: 'pointer', color: 'red', filter: 'grayscale(50%)' }} onClick={() => handleDeleteLink(link.id)} />
                    </div>
                ))}
            </div>

            {
                !links?.length
                &&
                <div className='no-items-message-container'>
                    <p className='no-items-message'>You don&apos;t have any links yet</p>
                </div>

            }
        </div>
    )
}
