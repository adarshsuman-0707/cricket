import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Cricket from './Cricket'
import Playing from './Playing'
import Nextteam from './Nextteam'
const Crickets = () => {
  return (
    <Routes>

    <Route path='/' element={<Cricket/>} />
    <Route path='/playing' element={<Playing/>} />
    <Route path='/opposeteam' element={<Nextteam/>} />
</Routes>
  )
}

export default Crickets