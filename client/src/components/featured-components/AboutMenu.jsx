import React from 'react';
import {Route, Link} from 'react-router-dom'
  
import RowGrid from './RowGrid'
import ArtistRow from './ArtistRow'

const AboutMenu = ({id, related, tracks, album, single, appear, compilation, playContextTrack}) => {
    return (
        <>
            <nav className="menuNav">
                <ul className="menuNavList">

                    <li className='AboutNavItem'>
                        <Link exact to={`/artist/${id}`} className='aboutLink' activeClassName='aboutLink-active'>
                            <span style={customStyle}>Overview</span>
                        </Link>
                    </li>
                    <li className='AboutNavItem'>
                        <Link exact to={`/artist/${id}/related`} className='aboutLink' activeClassName='aboutLink-active'>
                            <span style={customStyle}>Related Artist</span>
                        </Link>
                    </li>

                </ul>
            </nav>
            
            <div style={{paddingTop: '1.5em', position:"relative"}}>
                <Route exact path={`/artist/${id}`}>
                    <ArtistRow title='Popular' display='list' list={tracks} playContextTrack={playContextTrack}/> 
                    <ArtistRow title='Albums' display='grid' list={album}/> 
                    <ArtistRow title='Singles and EPs' display='grid' list={single}/> 
                    <ArtistRow title='Compilations' display='grid' list={appear}/> 
                    <ArtistRow title='Appears On' display='grid' list={compilation}/> 
                </Route> 
                <Route exact path={`/artist/${id}/related`}>
                    <RowGrid playlists={related}/>
                </Route>
            </div>
        </>
    ); 
}
const customStyle = {
    fontSize: '14px',
    fontWeight: '700',
    lineHeight: '16px',
    letterSpacing: 'normal',
    textTransform: 'none'
}

export default AboutMenu;