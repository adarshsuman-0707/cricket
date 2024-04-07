import React from 'react'
import './Navbar.css'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
<>
<div id="target">
  <NavLink to="/" class="navlink">  <p>Homes</p></NavLink>
  <NavLink to="/About" class="navlink"><p>About</p></NavLink>
  <NavLink to="/Conatct" class="navlink"> <p>Contact</p></NavLink>
    </div></>
  )
}

export default Navbar