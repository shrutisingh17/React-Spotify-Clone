import React from "react";
import TrackList from "./TrackList";
import Icon from '../icons'

//ARTIST PAGE COMPONENT
const ArtistRow = ({ title, display, list, playContextTrack }) => {
  if (list?.length) {
    return (
      <div>
        <div className="ArtistRowTitle">
            <h1 style={{fontSize: '28px', lineHeight: '1.6',fontWeight: '600',letterSpacing: '-.36px',color: '#fff',margin: '16px 0'}}>
              {title}
            </h1>
        </div>
        {
            display === "list" ? (
            <TrackList
                tracks={list}
                styleName="simplify"
                playContextTrack={playContextTrack}
            />
            ) : (
            <div className="ArtistRowGrid">

                {list.map((item, index) => (
                    <div className='artistRowItem' key={index}>
                    <a href={`/${item.type}/${item.id}`}>
                        <div className='artistRowThumb'>
                        {item.images?.[0]?.url ? (
                            <img loading='lazy' src={item.images?.[0]?.url} style={{ width: '100%', height: '100%' }} alt='' />
                        ) : (
                            <div>
                            <Icon name='CD' />
                            </div>
                        )}
                        </div>
                    </a>
                    <div className='artistRowName ellipsis-one-line'>
                        <a href={`/${item.type}/${item.id}`}>{item.name}</a>
                    </div>
                    </div>
            ))}
            </div>
            )
        }
      </div>
    );
  } else {
    return null;
  }
};

export default ArtistRow;
