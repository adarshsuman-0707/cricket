import React, { useEffect, useState } from 'react'

const Forms = () => {
// const [input,setInput]=useState({
//     firstname: ""
//     , lastname : ""
// })
// function fun1(e){
//     const {name,value}=e.target;
//     setInput({...input,[name]:value})
//     // console.log(name,value);
// }

// const done = (e) =>{
//     e.preventDefault()

//     let info={firstname:input.firstname,lastname:input.lastname};
//     let information= JSON.stringify(info);
//     localStorage.setItem("TEXT",information);

//     console.log(localStorage.getItem("TEXT"));

//     // console.log(input);
// }
//   return (
//     <div><>
//    < form onSubmit={done}>
// <input type="text" name="firstname"  value={input.firstname } placeholder="ENter name first " onInput={fun1} />
// <input type="text" name="lastname"  value={input.lastname } placeholder="ENter name last " onInput={fun1} />
// <button  > Submit</button>
// </form>
//     </></div>
//   )

let [input,setInput]=useState({
  firstname:"",
  lastname:""
})
localStorage.getItem("INformation")

function Done(e){
e.preventDefault();
// console.log(input);
localStorage.setItem("INformation",JSON.stringify(input))
}


let [display,setDisplay]=useState(null)
useEffect(()=>{
let data=localStorage.getItem("INformation")
console.log(data);
const newdata=JSON.parse(data);
setDisplay(newdata);
},[])
function fun1(e){
  let {name,value}=e.target;
  setInput({...input,[name]:value})
}
function fun3(){
  localStorage.clear('INformation');
setDisplay(null)
}
return (<>
<form onSubmit={Done}>
  <input type="text" placeholder="Enter your name " onInput={fun1} value={input.firstname} name="firstname"/>
  <input type="text" placeholder="Enter your class " onInput={fun1} value={input.lastname} name="lastname"/>

<button>Submit</button>
</form>
<div>
  {
    display?(<><h1>{display.firstname}</h1>
    <h1>{display.lastname}</h1></>):(<><h1>nhi mila</h1></>)
  }

  {
    display?(<button onClick={fun3}>Remove</button>):" "
  }
</div>

</>)
}

export default Forms