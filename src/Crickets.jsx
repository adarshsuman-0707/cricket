import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Cricket from './Cricket'
import Playing from './Playing'
const Crickets = () => {
  return (
    <Routes>

    <Route path='/' element={<Cricket/>} />
    <Route path='/playing' element={<Playing/>} />

</Routes>
  )
}

export default Crickets