import React, {useState, useEffect} from 'react'
import makeAxiosRequest from '../../utilities/makeAxiosRequest'
import axios from 'axios';

 
//SEARCH PAGE
export default function BrowsePage() {
    const [genre, setGenre] = useState([])

    useEffect(() => {
        const [source, makeRequest] = makeAxiosRequest('https://api.spotify.com/v1/browse/categories?limit=50')

        makeRequest()
            .then((data) => {  
                setGenre(data?.categories?.items)
            })
            .catch((error) => console.log(error))
        
        return () => source.cancel()
    }, [])

    return (
        <div className="page-content">
            <div className='browsePage'>
                <div className='PageTitle'>
                    <h1 style={style}>Browse All</h1>
                </div>
                <div className="browseGrid">
                    {genre?.map((genre) => (
                        <div className="browseLinkContainer" key={genre.id}>
                            <a href={`/genre/${genre.id}`} className="browseLink">
                            <h3 style={titleStyle}>{genre.name}</h3>
                            <div style={overlayStyle}></div>
                            <img loading="lazy" src={genre.icons[0].url} alt="" style={{ width: '100%' }} />
                            </a>
                        </div>
                    ))}
                </div>
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

const titleStyle = {
    fontSize: '24px',
    padding: '16px',
    lineHeight: '1.3em',
    letterSpacing: '-.04em',
    overflowWrap: 'break-word',
    position: 'absolute',
    zIndex: '1',
    bottom:'0',
    textAlign: 'left',
    margin: 'auto',
    hyphens: 'auto'
}

const overlayStyle = {
    background: 'linear-gradient(0deg,rgba(0,0,0,0),rgba(0,0,0,.4))',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height:'100%'    
}