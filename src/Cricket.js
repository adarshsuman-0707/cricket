import React from 'react'
import {  useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import './Cricket.css'
import {Link} from 'react-router-dom'
const Cricket = () => {


    // const [counting, setCounting] = useState(0)

let [check,setCheck]=useState(false);
let [formtoggle,setFormtoggle]=useState(true);

let [input,setInput]=useState({
    Firstname:""
   ,over:"",
   player:""
})
let [input1,setInput1]=useState({
  Firstname:""
 ,over:"",
 player:""
})
function Done(event){
event.preventDefault();
// setCheck(!check);
setFormtoggle(false)
const information = JSON.stringify(input)
localStorage.setItem("data ", information)
}
function getting(e){
    const {name,value}=e.target;
    setInput({...input,[name]:value})
}

function getting1(e){
  const {name,value}=e.target;
  setInput1({...input1,[name]:value})
}
function Newone( event){
    event.preventDefault();
    setCheck(!check);
    const information = JSON.stringify(input1)
    localStorage.setItem("team2", information)
    
}
  return (
    <div id="gradient" className='container-fluide'>
    <div className="container" id="mains">

  <div  className="container">
      
      <div className="mt-3 d-flex" id="fixNav"><h1 id="heading" align="center">Cricket Score board </h1> {check?(<Link  style={{textDecoration:"none"}} to='/playing'><button className='sbutton'>
  <span class="text">START</span>
</button></Link>):(<></>) }</div>

{formtoggle?(<> <div className="container d-flex card " id="forms">
        <h1 id="heading">Fill 1st Team information</h1>
        <form onSubmit={Done}>
    <p>Team Name:</p><input className="input" type="text" name="Firstname" onInput={getting} placeholder="Enter Team Name 1" value={input.Firstname} required></input>
    <p>Total Over :</p><input className="input" type="number" name="over" onInput={getting} placeholder="Enter Total over"  value={input.over}required></input>
    <p>Total player:</p><input className="input" type="number" onInput={getting} placeholder=" Enter Total player" name="player" value={input.player} required></input>
    <br>
    </br>
    <div className="d-flex" id="bottombuton"><button className="buttons"> submit</button></div>
</form>
      </div></>):(<> <div className="container d-flex card " id="forms">
        <h1 id="heading">Fill 2nd Team information</h1>
        <form onSubmit={Newone}>
    <p>Team Name:</p><input className="input" type="text" name="Firstname" onInput={getting1} placeholder="Enter Team Name 2" value={input1.Firstname} required></input>
    <p>Total Over :</p><input className="input" type="number" name="over" onInput={getting1} placeholder="Enter Total over"  value={input1.over}required></input>
    <p>Total player:</p><input className="input" type="number" onInput={getting1} placeholder=" Enter Total player" name="player" value={input1.player} required></input>
    <br>
    </br>
    <div className="d-flex" id="bottombuton"><button className="buttons"> submit</button></div>
</form>
      </div></>)}
     
    </div>


</div>
</div>
  )
}

export default Cricket