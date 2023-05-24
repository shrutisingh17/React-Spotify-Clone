import { useState, useRef, useCallback } from 'react';
import axios from 'axios';

function useTokenScroll(setList, token, source){
    const [next, setNext] = useState(null) 

    const observer = useRef()
    const lastRef = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && next){
                console.log('hi')
                 axios
                    .get(next, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': 'Bearer ' + token
                        },
                        cancelToken: source.token
                    })
                    .then(response => {
                        const data = response.data
                        const resultList = data.items.map(track => track.track)
                        const next = data.next || data.playlists.next
                        setList(tracks => [...tracks, ...resultList])
                        setNext(next)
                    })
                    .catch(error => console.log(error))
                    source.cancel("Request canceled");
            }
        })
        if (node) observer.current.observe(node)
    }, [next])

    return [setNext, lastRef]
}

export default useTokenScroll