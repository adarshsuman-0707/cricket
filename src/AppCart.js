import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Cart from './Cart'
import View from './View'
const AppCart = () => {
  return (
 <>
<Routes>

    <Route path='/' element={<Cart/>} />
    <Route path='/view' element={<View/>} />

</Routes>

 </>
  )
}

export default AppCart