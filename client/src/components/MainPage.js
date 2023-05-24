import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Sidebar from './sidebar-components/Sidebar';
import CTAbanner from './footer-components/CTAbanner';
import Player from './footer-components/Player';
import Navbar from './featured-components/Navbar';
import Loading from './featured-components/Loading';

import { useStateContext, MessageContext, PlayContext } from '../utilities/StateContext';

function MainPage() {

  const {loggedIn, setloggedIn, token, setToken, setuserInfo } = useStateContext();

  const [loading, setLoading] = useState(true)
  const [playlists, setPlaylists] = useState([])

  const [status, setStatus] = useState(false) 
  const [message, setMessage] = useState('')

  const timerRef = useRef(null)

  useEffect(() => {
  
    const urlParams = new URLSearchParams(window.location.hash.substr(1));
    const access_token = urlParams.get('access_token');
    const error = urlParams.get('error');
  
    const cancelSource = axios.CancelToken.source();
  
    if (error) {
      setLoading(false);
      setStatusMessage(`ERROR: ${error}`);
    } else {
      if (access_token) {
        setToken(access_token);
        setloggedIn(true);
        window.location.hash = '';
      } else {
        axios("http://localhost:4000/refresh_token", { withCredentials: true })
          .then((response) => {
            const access_token = response.data.access_token;
            setToken(access_token);
            setloggedIn(true);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
            return;
          });
      }
    }
  
    return () => {
      cancelSource.cancel();
      clearTimeout(timerRef.current);
    };
  }, []);
  
  useEffect(() => {
    if (loggedIn) {
      const cancelSource = axios.CancelToken.source();

      const makeRequests = async () => {
        const requestUserInfo = () => {
          return axios.get("https://api.spotify.com/v1/me", {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            cancelToken: cancelSource.token,
          });
        };
    
        const requestPlayList = () => {
          return axios.get("https://api.spotify.com/v1/me/playlists", {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            cancelToken: cancelSource.token,
          });
        };
  
        try {
          const [_userInfo, _playlists] = await Promise.all([requestUserInfo(), requestPlayList()]);
          setuserInfo(_userInfo?.data);
          setPlaylists(_playlists?.data?.items);
        } catch (error) {
          setStatusMessage(`LOGIN ERROR: ${error}`);
        }
      }; 
  
      makeRequests();
      setLoading(false);

      return () => {
        cancelSource.cancel();
      };
    }
  }, [loggedIn, token]);
  
  const refreshPlaylist = () => {
    const cancelSource = axios.CancelToken.source();
    axios
      .get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          'Authorization': 'Bearer ' + token,
          "Content-Type": "application/json"
        },
        cancelToken: cancelSource.token
      })
      .then(response => {
        setPlaylists(response?.data?.items);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const setStatusMessage = (message) => {
      clearTimeout(timerRef.current)
      setStatus(true)
      setMessage(message)
      timerRef.current = setTimeout(() => {
          setStatus(false)
      }, 3000)
  }

  const playerRef = useRef(null)
  const updatePlayer = () => {
    playerRef.current.updateState()
  }
  
  return ( 
    <div className="App">
      {loading? 
        <Loading type='app'/> :
        <MessageContext.Provider value={setStatusMessage}>
          <Sidebar playlists={playlists} />
              
          <PlayContext.Provider value={updatePlayer}>
                  <Navbar playlists={playlists} refreshPlaylist={() => refreshPlaylist()} message={message} status={status} />
          </PlayContext.Provider>

          {/* FOOTER */}
          <div className="footer">
            {loggedIn? <Player ref={playerRef}/>: <CTAbanner/>}
          </div>

        </MessageContext.Provider>
      }
    </div>
  );
}

export default MainPage;