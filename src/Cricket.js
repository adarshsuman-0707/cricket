import React from 'react'
import {  useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import './Cricket.css'
import {Link} from 'react-router-dom'
const Cricket = () => {


    // const [counting, setCounting] = useState(0)

let [check,setCheck]=useState(false);
let [input,setInput]=useState({
    Firstname:""
   ,over:"",
   player:""
})
  
function Done(event){
event.preventDefault();
setCheck(!check);
const information = JSON.stringify(input)
localStorage.setItem("data ", information)
}
function getting(e){
    const {name,value}=e.target;
    setInput({...input,[name]:value})
}

  return (
    <div id="gradient" className='container-fluide'>
    <div className="container" id="mains">

  <div  className="container">
      
      <div className="mt-3 d-flex" id="fixNav"><h1 id="heading" align="center">Cricket Score board </h1> {check?(<Link  style={{textDecoration:"none"}} to='/playing'><button className='sbutton'>
  <span class="text">START</span>
</button></Link>):(<></>) }</div>
      <div className="container d-flex card " id="forms">
        <h1 id="heading">Fill Team information</h1>
        <form onSubmit={Done}>
    <p>Team Name:</p><input className="input" type="text" name="Firstname" onInput={getting} placeholder="Enter Team Name" value={input.Fistname} required></input>
    <p>Total Over :</p><input className="input" type="number" name="over" onInput={getting} placeholder="Enter Total over"  value={input.over}required></input>
    <p>Total player:</p><input className="input" type="number" onInput={getting} placeholder=" Enter Total player" name="player" value={input.player} required></input>
    <br>
    </br>
    <div className="d-flex" id="bottombuton"><button className="buttons"> submit</button></div>
</form>
      </div>
    </div>


</div>
</div>
  )
}

export default Cricket