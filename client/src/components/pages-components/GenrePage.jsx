import React from 'react'
import {useEffect, useState, useContext} from 'react'
import makeAxiosRequest from '../../utilities/makeAxiosRequest'

import PlayCard from '../featured-components/PlayCard'

import useId from '../../utilities/hooks/useId'
import useInfiScroll from '../../utilities/hooks/useInfiScroll'
import {MessageContext} from '../../utilities/StateContext'

//SEE ALL Page
export default function GenrePage() {
    const id = useId()
    console.log(id)
    const setMessage = useContext(MessageContext)

    const [playLists, setPlayLists] = useState([])
    const [name, setName] = useState('')

    const [setNext, lastRef] = useInfiScroll(setPlayLists)

    useEffect(() => {
        const [nameSource, requestName] = makeAxiosRequest(`https://api.spotify.com/v1/browse/categories/${id}`)
        const [listSource, requestList] = makeAxiosRequest(`https://api.spotify.com/v1/browse/categories/${id}/playlists?limit=50`)

        const makeRequest = async () => {
            try{
                const [nameData, listData] = await Promise.all([requestName(), requestList()])
                setName(nameData.name)
                setPlayLists(listData.playlists.items)
                setNext(listData.playlists.next)
            }catch(error){
                setMessage(error)
            }
        }

        if(id){
            makeRequest()
        }
        
        return () => {
            nameSource.cancel()
            listSource.cancel()
        }
    }, [id])
    
    return (
        <div className='GenrePage page-content'>
            <div className='PageTitle'>
                <h1 style={style}>{name}</h1>
            </div>
            <div className="browseGrid">
                {playLists.map(playlist => (
                    <PlayCard ref={lastRef} key={playlist?.id} info={playlist} type="playlist"/>
                ))}
            </div>
        </div>
    )
}

const style = {
    fontSize: '24px',
    fontSeight: '700',
    lineHeight: '28px',
    letterSpacing: '-.04em',
    textTransform: 'none',
    color: '#fff'
}