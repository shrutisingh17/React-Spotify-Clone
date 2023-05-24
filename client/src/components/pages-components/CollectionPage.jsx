import React, {useState, useEffect, useContext} from 'react';
import {Route} from 'react-router-dom'
import axios from 'axios'

import CollectionRow from '../featured-components/CollectionRow'
import {useStateContext} from '../../utilities/StateContext'
  

const CollectionPage = ({playlists}) => {
    const [artists, setArtists] = useState([])
    const [albums, setAlbums] = useState([])

    const {token} = useStateContext()

    useEffect(() => {
        if (token) {
          const makeRequests = async () => {
            try {
              const artistsResponse = await axios.get('https://api.spotify.com/v1/me/following?type=artist', {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                  },
              });
      
              const albumsResponse = await axios.get('https://api.spotify.com/v1/me/albums', {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                  },
              });
      
              const artistsData = artistsResponse?.data?.artists?.items;
              const albumsData = albumsResponse?.data?.items;
      
              setArtists(artistsData);
              setAlbums(albumsData);
              console.log(albumsResponse.data.items.album);
            } catch (error) {
              console.log('An error occurred:', error);
            }
          };
      
          makeRequests();
        }
      }, []);
      
    return (
        <div className='page-content' style={{paddingTop:'16px'}}>
            <Route exact path='/collection/playlist'>
                <CollectionRow name='Playlists' playlists={playlists}/>
            </Route>
            <Route exact path='/collection/artist'>
                <CollectionRow name='Artists' playlists={artists}/>
            </Route>
            <Route exact path='/collection/album'>
                <CollectionRow name='Albums' playlists={albums}/>
            </Route>
        </div> 
    );
}


export default CollectionPage;
