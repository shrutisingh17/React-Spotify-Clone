import React, {useEffect, useState} from 'react'

import makeAxiosRequest from '../../utilities/makeAxiosRequest'

import PlayCard from './PlayCard'

//RESULT ROWS(SEARCH PAGE)
export default function SearchRow({title, type, query}) {
    const [result, setResult] = useState([])
    const [formatedQuery, setformatedQuery] = useState('')

    useEffect(() => {
        const formatedQuery = query.toLowerCase().split().join('+')
        setformatedQuery(formatedQuery)
    }, [query])


    useEffect(() => {
        const [source, makeRequest] = makeAxiosRequest(`https://api.spotify.com/v1/search?q=${formatedQuery}&type=${type}&limit=9`)
        if (formatedQuery.length > 0){
            makeRequest()
                .then((data) => {
                    const key = Object.keys(data)[0]
                    const result = data[key].items
                    setResult(result)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        return () => source.cancel()
    }, [formatedQuery, type])


    return (
        <div className='CollectionRow' style={{display: result.length===0? 'none':'grid'}}>

            <div className="RowTitle">
                <h1 style={{fontSize:'24px',
                            lineHeight:'28px',
                            letterSpacing: '-0.04em',
                            fontWeight: '700',
                            color:'white'}}>{title}</h1>
                {/* {id? <a href={`/genre/${id}`} className='seeAll'>see all</a>:null} */}
            </div>

            <div className="RowGrid">
                {result.map((item) => {
                    return <PlayCard key={item.id} info={item} type={type}/> 
                })}
            </div>
        </div>
    )
}
