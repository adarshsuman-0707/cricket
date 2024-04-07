import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Navbar from './Navbar'
import Conatct from './Conatct'
import Homes from './Homes'
import About  from './About'
const Apps = () => {
  return (
<>
<Navbar/>
<Routes>
    <Route path="/" element={<Homes/>}/>
    <Route path="/About" element={<About/>}/> 
    <Route path="/Conatct" element={<Conatct/>}/>

</Routes>


</>
  )
}

export default Apps