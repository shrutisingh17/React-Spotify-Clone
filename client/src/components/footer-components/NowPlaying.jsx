import React, {useContext} from 'react'
import { AiOutlineHeart } from 'react-icons/ai';
import { SlMusicToneAlt } from 'react-icons/sl'
 
import { MessageContext } from '../../utilities/StateContext';


export default function NowPlaying({playInfo}) {
    
    const setMessage = useContext(MessageContext)
    const {album, artists, name, id} = playInfo

    let imageUrl
    if (album.images && album.images.length !== 0){
        imageUrl = album.images[album.images.length - 1].url
    }

    return (
        <div className="now-playing">

            <div className="player-cover">
                {imageUrl ? 
                    <img draggable="false" loading="eager" src={imageUrl} alt=""></img>
                    :
                    <div>
                        <SlMusicToneAlt style={{width:"18px", height:"21px"}} />
                    </div>
                }
            </div>

            <div className="player-info" style={{display: name === ''? 'none':null}}>

                <div className="player-info-track ellipsis-one-line">
                    <a href={`/album/${album.id}?highlight=${id}`}>{name}</a>
                </div>

                <div className="player-info-artist ellipsis-one-line">
                    {artists.map((artist, index) => {  
                        return <a href={`/artist/${artist.id}`} key={index}>{artist.name}</a>
                    })} 
                </div>

            </div>

            <div className="player-like" style={{display: name === ''? 'none':null}}>
                <button title='Save to your Liked Songs' className="player-like-button no-outline" onClick={() => setMessage('Oops, it look like I chose not to implement this feature :)')}>
                    <AiOutlineHeart style={{width:'30px', height:'30px'}} />
                </button>
            </div>
        
        </div>
    )
}
