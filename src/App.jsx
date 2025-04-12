import { useState, useEffect, useCallback } from 'react'
import './App.css'

function debounce(callback, delay){
  let timer;
  return(value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(value)
    },delay)
  }
}

function App() {
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState([])
  const [error, setError] = useState(null)

  //ritardare la chiamata API fino a quando 
  //l’utente smette di digitare per un breve periodo (es. 300ms)

  const getQuery =   useCallback(debounce( 
    async (query) => {//Senza questo controllo, una query con soli spazi (" ") triggererebbe una fetch inutile.
     //VALIDAZIONE INPUT
      if (!query.trim()) return; // Blocca ricerche inutili con query vuote o solo spazi.
      //Prima di ogni fetch basata su input utente
      // setOptions([])

    try {
      console.log("query:", query)
      const resp = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${query}`)
      const data = await resp.json()
      console.log(data)
      setOptions(data)

    } catch (error) {//Se il fetch fallisce: errori rete/API
      console.error("no data available")
    }
  }, 300), []) 

  //al cambio di query prelevo i film che rispondono alla query(value= query)
  useEffect(() => {
    getQuery(query)
  }, [query])


  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  return (
    <>
      <div>
        <input
          type="text"
          placeholder='Search for the item'
          value={query}
          onChange={handleChange}
        />
      </div>
      <div>

        <ul>
          {options.length > 0 && query && (//poiche ho questo quando cancello query si cancellano anche risultati setOptions([])
            options.map((item) => (
              //checks query once before mapping (more efficient)
              // query && like this is less efficient map still runs even when query is empty (wasted computation)
              //map still runs even when query is empty (wasted computation)
              <li key={item.id}>{item.name}</li>
            ))
          )}
        </ul>
        {/* Show "no match found" when there's a query but no results */}
        {query && options.length === 0 && (//quando cerco qualcosa e non c e risultato array vuoto []
          <div>
            <p>No match found for {query}</p>
            <button onClick={() => setQuery('')}>Reset</button>
          </div>
        )}

        {error && (
          <p>Error loading results</p>
        )}

        {/* <ul>
          {query ? (
            options.length > 0 ? (
              options.map(item => <li key={item.id}>{item.name}</li>)
            ) : (
              <p>No match found</p>
            )
          ) : null}
        </ul> */}

      </div>

    </>
  )
}

export default App
