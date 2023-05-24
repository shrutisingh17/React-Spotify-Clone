import React, {useContext} from 'react'
import {useStateContext, PlayContext} from '../../utilities/StateContext'
import {AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiPlay } from 'react-icons/bi';

export default function PlayListFunctions({type, follow, onFollow, setMessage, playContext}) {
    
    switch (type) {
        case 'playOnly':
            return (
                <div className="playListFunctions">
                    <PlayButtonLarge  playContext={playContext}/>
                </div>
            )
        case 'none':
            return (
                <div className="playListFunctions">
                    <MoreButton onClick={() => setMessage('Oops, it look like I chose not to implement this feature :)')}/>
                </div>
            )
        case 'user':
            return (
                <div className="playListFunctions">
                    <FollowButton follow={follow} onFollow={onFollow} />
                    <MoreButton onClick={() => setMessage('Oops, it look like I chose not to implement this feature :)')}/>
                </div>
                    
            )
        case 'artist':
            return (
                <div className="playListFunctions">
                    <PlayButtonLarge  playContext={playContext}/>
                    <FollowButton follow={follow} onFollow={onFollow} />
                    <MoreButton onClick={() => setMessage('Oops, it look like I chose not to implement this feature :)')}/>
                </div>
            )
        default:
            return (
                <div className="playListFunctions">
                    <PlayButtonLarge playContext={playContext}/>
                    <LikeButton follow={follow} onFollow={onFollow} />
                    <MoreButton onClick={() => setMessage('Oops, it look like I chose not to implement this feature :)')}/>
                </div>
            )
    }
}


function PlayButtonLarge({playContext}){

    const {loggedIn } = useStateContext();
    const updatePlayer = useContext(PlayContext)

    if (loggedIn){
        return (
            <button className="playButton no-outline" title="Play" onClick={() => {
                playContext()
                setTimeout(() => updatePlayer(), 500)
            }}>
                <BiPlay style={{height:'40px', width:'40px'}} />
            </button>
        )
    }else{
        return (
            <button className="playButton no-outline" title="Play" data-tip='play' data-for='tooltipMain' data-event='click' >
                <BiPlay style={{height:'40px', width:'40px'}} />
            </button>
        )
    }
    
}

function LikeButton({follow, onFollow}){
    const {loggedIn } = useStateContext();

    if (loggedIn){
        return (
            <button className={`likeButton ${follow? 'noHover':''} no-outline`} style={{color: follow? 'var(--spotify-green)':null}} title={follow? 'Remove from Library':"Save to Your Library"} onClick={onFollow}>
                {follow ? <AiFillHeart style={{ width: '35px',height: '35px' }} /> : <AiOutlineHeart style={{ width: '35px',height: '35px' }} />}
            </button>
        ) 
    }else{
        return (
            <button className="likeButton no-outline" title="Save to Your Library" data-tip='like' data-for='tooltipMain' data-event='click'>
                <AiOutlineHeart style={{ width: '35px',height: '35px' }} />
            </button>
        )
    }
}

function FollowButton({follow, onFollow}){
    const {loggedIn } = useStateContext();

    if (loggedIn){
        return (
            <button className="followButton no-outline" onClick={onFollow}>{follow? 'following':'follow'}</button>
        )
    }else{
        return (
            <button className="followButton no-outline" data-tip='follow' data-for='tooltipMain' data-event='click' onClick={() => console.log('hi')}>{follow? 'following':'follow'}</button>
        )
    }
    
}

function MoreButton({onClick}){
    return (
        <button className="moreButton no-outline" title="More" onClick={onClick}>• • •</button>
    )
}