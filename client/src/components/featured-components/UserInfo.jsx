import React, {useState, useContext} from 'react';
import axios from 'axios'
import { CgProfile } from 'react-icons/cg'

import {useStateContext} from '../../utilities/StateContext'

const UserInfo = () => {
    const [open, setOpen] = useState(false)
    const { userInfo } = useStateContext()

    const {images, display_name, id} = userInfo

    const toggleOpen = () => {
        setOpen(open => !open)
    }
 
    const logout = () => {
        axios('http://localhost:4000/logout', {withCredentials: true})
            .then(response => {
                window.location.reload()
            })
            .catch(error => console.log(error))
    }

    return (
        <div style={divStyle}>
            <button className='UserInfoButton no-outline' onClick={toggleOpen}>

                <figure style={figureStyle}>
                    {images && images.length > 0? 
                        (<img loading='eager' src={images[0].url} style={imgStyle} alt=''></img>)
                    :   (<CgProfile style={{ height: '28px', width: '20px' }} />)
                    }
                </figure>

                <span className='UserInfoSpan mediaNoneXL'>
                    {display_name}
                </span>
                <span style={spanStyle} className='mediaNoneXL'> 
                    {open? <p>&#9650;</p>:<p>&#9660;</p>}
                </span>
            </button>
            <ul className='UserInfoOptions' style={{display: open?'block':'none'}}>
                <li>
                    <a href="https://www.spotify.com/account/?utm_source=play&amp;utm_campaign=wwwredirect" target="_blank" rel="noopener noreferrer">Account</a>
                </li>
                <li>
                    <a href={`/user/${id}`}>Profile</a>
                </li>
                <li>
                    <button onClick={logout}>Log out</button>
                </li>
            </ul>
        </div>
    );
}

const divStyle = {
    position: 'relative',
    whiteSpace: 'nowrap'
}

const figureStyle = {
    width: '28px',
    height: '28px',
    overflow: 'hidden',
    position: 'relative',
    display: 'inline-block'
}

const imgStyle = {
    borderRadius: '50%',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center center'
}


const spanStyle = {
    marginRight: '6px',
    marginLeft: '8px',
    fontSize: '10px'
}


export default UserInfo;
