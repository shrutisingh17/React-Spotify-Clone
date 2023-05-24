import React, {useContext} from 'react'
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios'
import { BiPlay } from 'react-icons/bi';

import putWithToken from '../../utilities/putWithToken'
import {useStateContext, PlayContext, MessageContext} from '../../utilities/StateContext'

const PlayCard = React.forwardRef(({info, type}, ref) => {
    const history = useHistory()
    const description = returnDescription(type, info)
    
    const setMessage = useContext(MessageContext)
    const {token, loggedIn } = useStateContext();
    const updatePlayer = useContext(PlayContext);

    const source = axios.CancelToken.source()
 
    let images
    if (type === 'track'){
        images = info?.album.images
    }else{
        images = info?.images
    }
    let image_url
    try{
        image_url = images[0].url
    }catch{
        image_url = null 
    }
    
    const playContext = () => {
        if (info?.uri){
            var body
            if (type === 'track'){
                body = {
                    uris: [info?.uri]
                }
            }else{
                body = {
                    context_uri: info?.uri
                }
            }
            const request = putWithToken(`https://api.spotify.com/v1/me/player/play`, token, source, body)
            request()
                .then(response => {
                    if (response.status === 204){
                        setTimeout(() => updatePlayer(), 1000)
                    }else{
                        setMessage(`ERROR: ${response}`)
                    }
                })
                .catch(error => setMessage(`ERROR: ${error}`))
        }else{
            history.push(`/tracks`)
        }
    }

    return (
        <div className='pcWrapper'>
            <Link to={info?.to || (type === 'track' ? `/album/${info?.album?.id}?highlight=${info?.id}` : `/${type}/${info?.id}`)} style={{textDecoration:'none', color:'var(--main-text)', zIndex:'3'}}>

                <div ref={ref} className="PlayCard">
                    <div className="CardDisplay" style={{borderRadius: type ==='artist'?'50%':'0'}}>
                        <img src={image_url} loading='lazy' className='previewImg' style={{borderRadius: type ==='artist'?'50%':'0'}} alt=''></img>
                    </div>
                   
                    <div className="CardInfo">
                        <h2 style={titleStyle}>{info?.name}</h2>
                        <p style={descriptionStyle}>{description}</p>
                    </div>
                </div>
            </Link>
            {loggedIn? 
            <button className="smallButton no-outline" title="Play" onClick={() => {
                playContext()
                updatePlayer()
            }}>
                <BiPlay style = {{height:"28px", width:"28px"}} />

            </button>
            :
            <button className="smallButton no-outline" title="Play" data-tip='play' data-for='tooltipMain' data-event='click'>                <BiPlay style = {{height:"28px", width:"28px"}} />

            </button>
            }
            
        </div>
    )
})


function returnDescription(type, info){
    
    let artists
    switch (type){
        case 'playlist':
           return info?.description || `By ${info?.owner?.display_name}`
        case 'album':
            artists = info?.artists?.map((object) => object.name)
            return artists.length === 1 ? artists[0]:artists.join(', ')
        case 'artist':
            return 'artist'
        case 'track':
            artists = info?.artists?.map((object) => object.name)
            return artists.length === 1 ? artists[0]:artists.join(', ')
        default:
            return null
    }
}

export default PlayCard

const titleStyle = {
    fontSize: '16px',
    fontWeight: '700',
    lineHeight: '24px',
    letterSpacing: 'normal',
    textTransform: 'none',
    textOverflow: 'ellipsis',
    overflow:'hidden',
    color:'white',
    whiteSpace: 'nowrap'
}

const descriptionStyle = {
    fontSize: '11px',
    fontWeight: '400',
    lineHeight: '16px',
    letterSpacing: 'normal',
    textTransform: 'none',
    textOverflow: 'ellipsis',
    overflow:'hidden',
    marginTop: '4px',
    whiteSpace: 'normal',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical'
}