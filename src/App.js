
import React from 'react'
import Home from './Home'
const App = (e) => {
  return (<>
  <h1>{e.data}</h1>
  <Home data={e.data}/>
  
  </>

  )
}

export default App