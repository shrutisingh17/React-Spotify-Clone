import React from 'react';
import ReactToolTip from 'react-tooltip'
import {NavLink} from 'react-router-dom'

import generateContent from '../../utilities/TipContent'
import Icon from '../icons'
import { ImSpotify } from 'react-icons/im'
import NavItem from './NavItem.jsx'

import CreatePLaylist from './CreatePlaylist.jsx'
import { useStateContext} from '../../utilities/StateContext';

function Sidebar({ playlists }) {
    const { loggedIn } = useStateContext();

    return (
        <>
        <div className="sidebar">
            <div className='top'>
                <a href="/">
                    <div className='logo'>
                        <ImSpotify style={{width:"36px", height:"36px", marginBottom:"-8px"}}/>
                        <span>Spotify</span>
                    </div>
                </a>
                {/* This is the main nav link list with 3 items - Home, Search and Library */}
                <ul className="nav-list">
                  <NavItem to='/' exact={true} name='Home' label='Home' />
                  <NavItem to='/search' exact={true} name='Search' label='Search' />
                  <NavItem to='/collection' exact={false} name='Library' label='Your Library' data_tip='library' data_for='tooltip' data_event='click' style={{ pointerEvents: loggedIn? 'auto':'none'}}/>
                </ul>
            </div>
            <div className='bottom'>
                {/* PLAYLISTS */}
                <div className='playlists'>
                  {/* TOP */}
                    <h1 className='play-title'>playlists</h1>
                      <div className="featured-playlists">
                          <CreatePLaylist />

                          {/* LIKED SONGS */}
                          <div className='featured-item' style={{cursor: 'pointer'}} data-tip='list' data-for='tooltip' data-event='click'>
                                <NavLink exact to="/tracks" className='featured-item-link' style={{ pointerEvents: loggedIn? 'auto':'none'}} activeStyle={{opacity:'1'}}>
                                    <div className="playlist-icon">
                                        <Icon name='Like' />
                                    </div>
                                    <span className="featured-label">Liked Songs</span>
                                </NavLink>
                            </div> 
                      </div>

                    <hr className="list-separator"/>

                    {/* BOTTOM- OtherPlaylists */}
                      <div className="other-playlist-container">
                          <ul className="other-list">
                              {playlists.map((playlist) => (

                                  <li className='side-list' key={playlist.id}>
                                      <NavLink to={`/playlist/${playlist.id}`} className='list-link' activeStyle={{ color: '#fff' }}>
    
                                      <div className="list-wrapper">
                                          <img src={playlist.images[0].url} alt="Playlist Image" style={{height:"38px", marginRight:"8px", borderRadius:"4px"}}/>
                                          {playlist.name}
                                      </div>
                                      </NavLink>
                                  </li>  
                              ))}
                          </ul>
                      </div>
                </div>
            </div>
        </div>
        <ReactToolTip className='toolTip' id='tooltip' disable={loggedIn} place='right' effect='solid' globalEventOff='click' backgroundColor= '#2e77d0' getContent={dataTip => generateContent(dataTip)} clickable={true}/>
        </>
    );
}

export default Sidebar;
