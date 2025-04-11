import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState([])
  const [error, setError] = useState(null)

  const getQuery = async (query) => {
    try {
      console.log("query:", query)
      const resp = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${query}`)
      const data = await resp.json()
      console.log(data)
      setOptions(data)

    } catch (error) {
      console.error("no data available")
    }
  }


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
            {options.length > 0 && (
              options.map((item) => (
                query &&
                <li key={item.id}>{item.name}</li> 
              ))
            )}
          </ul>

      </div>

    </>
  )
}

export default App
