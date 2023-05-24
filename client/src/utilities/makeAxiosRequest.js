import axios from 'axios' 

export default function makeAxiosRequest(endpoint){
    let source = axios.CancelToken.source()
     
    const makeRequest = async () => {
        const cancelToken = source.token
        const config = {
            method: 'POST',
            url: 'http://localhost:4000',
            data: {endpoint},
            withCredentials: true,
            cancelToken
        }
        try{
            var result = await axios(config)
        }catch (error){
            if (axios.isCancel(error)) return
            return error
        }
        
        return result.data
    }
    
    return [source, makeRequest]
}