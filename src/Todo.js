import React from 'react'
import { useState } from 'react'
const Todo = () => {
    const [input,setInput] =useState();
const[data,setData]=useState([]);
function fun1(e){
    setInput(e.target.value)
}

function add(){
    let news= []
    
setData([...data,input])
setInput('')
}                           
function deleteTodo(id){
let newData =data.filter((value,index)=>{
return index!=id
}

)
setData(newData)
 }

  return (
    <div><input onInput={fun1} type="text" placeholder='enter todo' value={input}/>
    <button onClick={add} >Add</button>
    {
        data.map((A,b)=>{
return ( <>
<li>{A}</li>
<button onClick={()=>deleteTodo(b)}> Delete</button>
</>)
        })
    }
    </div>
  )
}

export default Todo