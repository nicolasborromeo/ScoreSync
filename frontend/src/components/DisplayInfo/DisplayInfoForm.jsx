import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './DisplayInfoForm.css'
import { thunkGetUsersDisplayInfo, thunkSaveDisplayInfo } from '../../store/displayInfo';

export default function DisplayInfoForm() {
    const dispatch = useDispatch()
    const displayInfo = useSelector(state => state.displayInfo)
    const [name, setName] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [email, setEmail] = useState('')
    const [website, setWebsite] = useState('')
    const [phone, setPhone] = useState('')
    const [bio, setBio] = useState('')
    const [fetched, setFetched] = useState(false)

    useEffect(() => {
        dispatch(thunkGetUsersDisplayInfo()).then(() => setFetched(true))
    }, [dispatch])

    useEffect(() => {
        if (displayInfo && fetched) {
            const { name, jobTitle, email, website, phone, bio } = displayInfo
            if (name) setName(name || '')
            if (jobTitle) setJobTitle(jobTitle || '')
            if (email) setEmail(email || '')
            if (website) setWebsite(website || '')
            if (phone) setPhone(phone || '')
            if (bio) setBio(bio || '')
        }
    }, [displayInfo, fetched])

    const handleSaveDisplayInfo = (e) => {
        e.preventDefault();
        const data = {
            name, jobTitle, email, website, phone, bio
        }
        dispatch(thunkSaveDisplayInfo(data))
    }
    return (
        <div id="display-information-container">
            <h2>Display Information</h2>
            <div className="text-and-button">
                <p>Below are your personal details that will appear by default in all the cards. Any changes made here will affect all other cards (existing and future), unless you&apos;ve modified the field directly in the card. The modifiable fields are: Job Title and Biographhy.</p>
                <button className="dashboard-button" onClick={handleSaveDisplayInfo}>Save</button>
            </div>

            <div className="personal-info-from-container">
                <form>
                    <div>
                        <fieldset>
                            <legend>Name</legend>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </fieldset>
                        <fieldset>
                            <legend>Job Title</legend>
                            <input
                                type="text"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </fieldset>
                        <fieldset>
                            <legend>Email Address</legend>
                            <input
                                // required
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </fieldset>
                        <fieldset>
                            <legend>Website Url</legend>
                            <input
                                type="text"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                            />
                        </fieldset>
                        <fieldset>
                            <legend>Phone</legend>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </fieldset>
                    </div>
                    <div>
                        <fieldset id="bio-fieldset">
                            <legend>Biography</legend>
                            <textarea
                                rows="18"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </fieldset>
                    </div>
                </form>

            </div>
        </div>

    )
}
