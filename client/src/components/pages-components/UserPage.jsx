import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'

import PageBanner from '../featured-components/PageBanner'
import PlayListFunctions from '../featured-components/PlayListFunctions'
import CollectionRow from '../featured-components/CollectionRow'
import Loading from '../featured-components/Loading'

import useId from '../../utilities/hooks/useId'
import useInfiScroll from '../../utilities/hooks/useInfiScroll'
import {useStateContext, MessageContext} from '../../utilities/StateContext'
  
import putWithToken from '../../utilities/putWithToken'
import makeAxiosRequest from '../../utilities/makeAxiosRequest'

export default function UserPage({query, setMessage}) {
    const id = useId()
    console.log(id)

    const { loggedIn, token, userInfo, } = useStateContext();

    const setStatusMessage = useContext(MessageContext)
    const [loading, setLoading] = useState(true)

    const [bannerInfo, setbannerInfo] = useState({
        name: '',
        description: '',
        user: [],
        followers: 0,
        primary_color: 'rgb(83, 83, 83)',
        images: [],
        total: 0
    })

    const [playLists, setplayLists] = useState([])
    const [setNext, lastRef] = useInfiScroll(setplayLists)
    const [follow, setFollow] = useState(false)
    const source = axios.CancelToken.source()
    useEffect(() => {
        setbannerInfo({
            name: '',
            description: '',
            user: [],
            followers: 0,
            primary_color: 'rgb(83, 83, 83)',
            images: [],
            total: 0
        })
        setFollow(false)
        setplayLists([])
        setLoading(true)
        
        const [userSource, requestUser] = makeAxiosRequest(`https://api.spotify.com/v1/users/${id}`)
        const [listSource, requestList] = makeAxiosRequest(`https://api.spotify.com/v1/users/${id}/playlists`)

        const makeRequest = async ()=> {
            try{
                const [userData, listData] = await Promise.all([requestUser(), requestList()])

                const {display_name, owner, followers, primary_color, images} = userData
                const {items, total, next} = listData
                setbannerInfo(bannerInfo => ({...bannerInfo, name:display_name, user:[owner], followers, primary_color, images, total}))
                setplayLists(items)
                setNext(next)
                setLoading(false)
            }catch(error){ 
                setStatusMessage(`ERROR: ${error}`)
                setLoading(false)
            }   
        }
 
        if(id){
            makeRequest()
        } 
    
        if (loggedIn && id) {
            const fetchData = async () => {
              try {
                const response = await axios.get(`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${id}`, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                });
          
                setFollow(response.data[0]);
                console.log(response)
              } catch (error) {
                console.log(error);
              }
            };
          
            fetchData();
        }
          

        return () => {
            userSource.cancel()
            listSource.cancel()
            source.cancel()
        }
     
    }, [id])

    const followUser = () => {
        if (loggedIn) { 
            const request = putWithToken(`https://api.spotify.com/v1/me/following?type=user&ids=${id}`, token, source, {}, follow? 'DELETE':'PUT')
            request()
                .then(response => {
                    if (response.status === 204){
                        if (follow){
                            setStatusMessage(`Unsaved from your collection`)
                        }else{
                            setStatusMessage(`Saved to your collection`)
                        }
                        setFollow(!follow)
                    }else{
                        setStatusMessage(`ERROR: Something went wrong! Server response: ${response.status}`)
                    }
                })
                .catch(error => setStatusMessage(`ERROR: ${error}`))
        }
    }
    console.log(playLists)

    return (
        loading?  
        <Loading /> 
        :
        <div className='listPage' style={{display: playLists.length===0? 'none':'block'}}>
            <PageBanner pageTitle='profile' bannerInfo={bannerInfo}/>
            <div className="playListContent">
                <div className="playListOverlay" style={{backgroundColor: `${bannerInfo.primary_color}`}}></div>
                <PlayListFunctions type={id === userInfo.id? 'none':'userInfo'} follow={follow} onFollow={followUser} setMessage={setStatusMessage}/>
                <div className="page-content" style={{marginTop: '40px'}}>
                    <CollectionRow ref={lastRef} name='Public Playlists' id={null} playlists={playLists}/>
                </div>
            </div>
        </div>
    )
}



