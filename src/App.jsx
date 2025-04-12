import { useState, useEffect, useCallback } from 'react'
import './App.css'
//import {debaounce} from "lodash"   //nmp install lodash
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
  const [selectedProduct, setSelectedProduct] = useState(null)//devo stampare questo prodotto da API grab it so state
//all inizio non ho selezionato nulla

  //ritardare la chiamata API fino a quando 
  //l’utente smette di digitare per un breve periodo (es. 300ms)

  const getQuery =   useCallback(debounce( 
    async (query) => {//Senza questo controllo, una query con soli spazi (" ") triggererebbe una fetch inutile.
     //VALIDAZIONE INPUT
      if (!query.trim())  // Blocca ricerche inutili con query vuote o solo spazi.
      //Prima di ogni fetch basata su input utente
      {// setOptions([])//uguale a dire query.trim()===0
        return;
      }//non fare fetch
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

  //questa chiamata verra fatta solo quando non la ripetiamo per 500 sec di fila
  //const debouncedGetQuery = useCallback(debounce(getQuery, 300), [])//funzione da salvare ritornata da debounce, dipendeza vuota, creare funzione una volta sola
  
  1.
  //al cambio di query quindi ogni volta che scrivo..prelevo i prodotti che rispondono alla query(value= query)
  //una funziona aggiorna l array di options > 
  // fai un operazione ad ogni cambio dello stato => USEEFFET
  useEffect(() => {//in useEffect mai mettere async await
    getQuery(query)
  }, [query])//controllo se query e vuota(non e stato cercato nessuno prodotto) perche altrimenti non ha senso fare chiamata
// fetch(..)
//.then(res => res.json())
//.then(data => setOptions(data))
//.catch(error => console.error(error))

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

//raccogliere dettagli complati - debounce not needed
   const fetchProductDetails = async (id) => {
    try {
      //salviamo il resolve di questa promise
      const res = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/products/${id}`)
      const result = await res.json()
      setSelectedProduct(result)
      setQuery("")
      setOptions([])//quando chiamata a buon fine nascondere tendina(svuoto)
    }catch(error){
      console.error(error)
    }
 
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
          {options.length > 0 && // query && 
          //poiche ho questo quando cancello query si cancellano anche risultati > setOptions([])
            (<div className='dropdown'>
           { options.map((item) => (
              //checks query once before mapping (more efficient)
              // query && like this is less efficient map still runs even when query is empty (wasted computation)
              //map still runs even when query is empty (wasted computation)
              <li onClick={() => fetchProductDetails(item.id)}   key={item.id}>{item.name}</li>
            ))}
            </div>)}
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

        {selectedProduct && (
          <div className='card'>
            <h2>{selectedProduct.name}</h2>
            <img src={selectedProduct.image} alt="" />
            <p>{selectedProduct.description}</p>
            <p><strong>Prezzo:</strong>{selectedProduct.price}$</p>
          </div>
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
