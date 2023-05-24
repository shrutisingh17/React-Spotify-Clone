import React, {useEffect} from 'react'
import { CiSearch } from 'react-icons/ci'

export default function SearchBar({query, setQuery, resetQuery}) {
    useEffect(() => {
        return () => resetQuery()
         
    }, [])
 
    return (
        <div className="SearchContainer">
            <div className='SearchBar'>
                <div style={iconStyle}>
                    <CiSearch style = {{height:"26px", width:"26px"}} />
                </div>
                <input className= 'SearchInput no-outline' 
                        maxLength='80' 
                        autoCorrect='off' 
                        autoCapitalize='off' 
                        spellCheck='false'
                        autoFocus={true}
                        placeholder='Search for Artists, Songs, or Podcasts'
                        value={query}
                        onChange={e => setQuery(e.target.value)}/>
            </div>
        </div>
    )
}


const iconStyle = {
    position:'absolute',
    top: '0',
    bottom: '0',
    left: '12px',
    display: 'flex',
    alignItems: 'center',
    cursor:'text'
}

