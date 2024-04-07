import React from 'react'
import { useState } from 'react' // iska use dynamic bananne ke liye krte hai 
import Form from './Form'
function Nework() {
  let [count, setCount] = useState(0);

  let [togglebtn, setTogglebtn] = useState(false);
  function call() {
    setCount(count + 1);

  }
  function call1() {
    setCount(count - 1);

  }
  function call3() {
    setCount(count = 0);

  }
  function toog() {
    setTogglebtn(!togglebtn);
  }


  return (
    <>
      <h1>{count}</h1>
      <button onClick={call} value="Increment ">  Increment</button>
      <button onClick={call1} value="Decrement">Decrement</button>
      <button onClick={call3} calue="reset">reset</button>


      <button onClick={toog}>Formfill</button>
      {togglebtn && <Form/>}

      <Naming />
      <Calling />
      <Task />
    </>
  );
}

const Naming =() =>{

let [name,setName]=useState("Manoj");

function call(){
    setName("Suman")
}
    return(
        <>
        <h1 style={{color:"red"}}>{name}</h1>
        <button onClick={call}>Click</button>



        </>
    )
}

const Calling=()=>{

let [city,setCity]=useState("pune");

function call(){
    setCity("delhi")
}
    return(
        <>
        <h1 style={{color:"red"}}>{city}</h1>
        <button onClick={call}>Click</button>



        </>
    )

}

const Task=()=>{
  let [branch,setBranch]=useState("CSE");
  function set(){
    setBranch("Computer")
  }
  function change(){


  }
  function none(){
    setBranch("Cse")
  }
  return(<><h1>
    {branch}
  </h1>
  <button onClick={set}>change</button>
  <button onClick={change}>other</button>
  <button onClick={none}>reset</button>
  
  </>)
}
export default Nework