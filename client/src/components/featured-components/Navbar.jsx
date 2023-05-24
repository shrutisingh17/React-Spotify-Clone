import React, { useState } from 'react';
import {Route, NavLink, useLocation} from 'react-router-dom'

import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import PageContent from './PageContent'
import SearchBar from './SearchBar'
import UserInfo from './UserInfo'
import PromptButton from './PromptButton'
import {useStateContext} from '../../utilities/StateContext';
import InstallCTA from '../sidebar-components/InstallCTA';

 //NAVBAR
function Navbar (props){
    const { loggedIn } = useStateContext();

    const [query, setQuery] = useState('')

    const resetQuery = ()=>{
        setQuery('')
    }
    const location = useLocation()

    return (
        <div className='featured'>
            <div className="header-bar" style={{background: location.pathname === '/'? null:'none'}}>

                {/* PAGE BACK AND FORTH */}
                <div className='HistoryNav'>
                    <button className='navButton no-outline' title=" Just for UI">
                        <AiOutlineLeft style = {{height:"22px", width:"22px"}} /> 
                    </button>
                    <button className='navButton mediaNone no-outline' title="Just for UI, use the browser Button">
                        <AiOutlineRight style = {{height:"22px", width:"22px"}} />
                    </button>
                </div>
 
                <Route exact path='/search'>
                    <SearchBar query={query} setQuery={setQuery} resetQuery={resetQuery}/>
                </Route>

                <Route path='/collection'>
                    {/* PLAYLIST, ARTIST ALBUMS */}
                    <div className='cNavWrapper'>
                        <nav className='cNav'>
                            <ul className='cNavList'>
                                <li>
                                    <NavLink to='/collection/playlist' activeStyle={activeStyle}>Playlists</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/collection/artist' activeStyle={activeStyle}>Artists</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/collection/album' activeStyle={activeStyle}>Albums</NavLink>
                                 </li>
                            </ul>
                        </nav>
                    </div>
                </Route>
                    
                
                {loggedIn ?
                    <div className='UserInfo-InstallWrapper'>
                    <InstallCTA />
                    <UserInfo />
                    </div>
                :
                    <div className='UserPrompt'>
                    <PromptButton to='https://spotify.com/signup' name='Sign Up' styleName='dark' />
                    <PromptButton to={'http://localhost:4000/login'} name='Log In' styleName='light' />
                    </div>
                }
                
            </div>
            <PageContent query={query} {...props}/>
        </div>
    );
}

const activeStyle = {
    backgroundColor: '#333'
}

export default Navbar;

