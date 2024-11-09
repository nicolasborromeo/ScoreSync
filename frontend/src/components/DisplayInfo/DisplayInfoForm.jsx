import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './DisplayInfoForm.css'
import { thunkGetUsersDisplayInfo, thunkSaveDisplayInfo } from '../../store/displayInfo';
import { IoIosSave } from "react-icons/io";
import { useModal } from '../../context/Modal';


export default function DisplayInfoForm() {
    const { closeModal, setModalContent } = useModal()
    const dispatch = useDispatch()
    const displayInfo = useSelector(state => state.displayInfo)
    const [name, setName] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [email, setEmail] = useState('')
    const [website, setWebsite] = useState('')
    const [phone, setPhone] = useState('')
    const [bio, setBio] = useState('')
    const [fetched, setFetched] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)

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
            .then(() => closeModal())
            .then(() => setHasChanged(false))
    }

    useEffect(() => {

    }, [name, jobTitle, email, phone, bio])

    return (
        <div id="display-information-container">
            <h3>Display Information</h3>
            <div className="text-and-button">
                <p>Below are your personal details that will appear by default in all the cards. Any changes made here will affect all other cards (existing and future), unless you&apos;ve modified the field directly in the card. The modifiable fields are: Job Title and Biographhy.</p>
                {/* <button className="dashboard-button" onClick={handleSaveDisplayInfo}>Save</button> */}
                <span><IoIosSave id="save-button" className={hasChanged ? 'active-button' : 'grayed'} size={40} onClick={() => setModalContent(<AreYouSure handleSaveDisplayInfo={handleSaveDisplayInfo} closeModal={closeModal} />)} /></span>
            </div>

            <div className="personal-info-from-container">
                <form>
                    <div>
                        <fieldset>
                            <legend>Name</legend>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                    setHasChanged(true)
                                }
                                }
                            />
                        </fieldset>
                        <fieldset>
                            <legend>Job Title</legend>
                            <input
                                type="text"
                                value={jobTitle}
                                onChange={(e) => {
                                    setJobTitle(e.target.value)
                                    setHasChanged(true)
                                }
                                }
                            />
                        </fieldset>
                        <fieldset>
                            <legend>Email Address</legend>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setHasChanged(true)
                                }
                                }
                            />
                        </fieldset>
                        <fieldset>
                            <legend>Website Url</legend>
                            <input
                                type="text"
                                value={website}
                                onChange={(e) => {
                                    setWebsite(e.target.value)
                                    setHasChanged(true)
                                }
                                }
                            />
                        </fieldset>
                        <fieldset>
                            <legend>Phone</legend>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value)
                                    setHasChanged(true)
                                }
                                }
                            />
                        </fieldset>
                    </div>
                    <div>
                        <fieldset id="bio-fieldset">
                            <legend>Biography</legend>
                            <textarea
                                rows="15"
                                value={bio}
                                onChange={(e) => {
                                    setBio(e.target.value)
                                    setHasChanged(true)
                                }
                                }
                            />
                        </fieldset>
                    </div>
                </form>

            </div>
        </div>

    )
}


function AreYouSure({ handleSaveDisplayInfo, closeModal }) {
    return (
        <div className='are-you-sure-container'>
            <h3>Warning:</h3>
            <p>This change will affect all your cards that have this information displayed.</p>
            <p>Are you sure you want to continue?</p>
            <div className='are-you-sure-buttons'>
                <button id="cancel-button" onClick={() => closeModal()}>CANCEL</button>
                <button id="ok-button" onClick={handleSaveDisplayInfo} >SAVE</button>
            </div>
        </div>
    )
}
