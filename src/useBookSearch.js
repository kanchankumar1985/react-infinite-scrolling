import { useEffect , useState } from 'react'
import axios from 'axios';

export default function useBookSearch(query , pageNumber) {

    const [isLoading , setIsLoading] = useState(true);
    const [books , setBooks] = useState([]);
    const [error , setError] = useState(false);
    const [hasMore , setHasMore] = useState(false);

    useEffect(() => {
        setBooks([]);
    } , [query]);

    useEffect(() => {
        setIsLoading(true);
        setError(false);
        let cancel;
        axios({
            method : 'GET',
            url : 'http://openlibrary.org/search.json',
            params : {q : query , page : pageNumber },
            cancelToken : new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setBooks(prevBooks => [...new Set([...prevBooks , ...res.data.docs.map(book => book.title)])]);
            setHasMore(res.data.docs.length > 0);
            setIsLoading(false);
        }).catch(e => {
            if(axios.isCancel(e)) {
                console.log(`error => ` , e);
                return
            };
        }) 
    
      return () => cancel();
    }, [query , pageNumber])
    
  return {books , isLoading , hasMore , error};
}
