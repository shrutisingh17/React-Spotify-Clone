import React from 'react'
import RowGrid from './RowGrid'
  
 const CollectionRow = React.forwardRef(({name, playlists, id}, ref) => {
    return (
        <div className="CollectionRow">
 
            <div className="RowTitle">
                <h1 style={{fontSize:'24px',
                            lineHeight:'28px',
                            letterSpacing: '-0.04em',
                            fontWeight: '700',
                            color:'white'}}>{name}</h1>
                            
                {id? <a href={`/genre/${id}`} className='seeAll'>show all</a>:null}
            </div>
            <RowGrid ref={ref} playlists={playlists}/>
        </div>
    )
})

export default CollectionRow