import React,{useEffect, useState} from 'react'

import './Manage.css'
     
const Form = () => {
let [input,setInput]=useState({
    firstname:""
    ,lastname :""
   , email: ""
   , password :""
})
 
function fun1(e){
    const {name,value}=e.target;
    setInput({...input,[name]:value})
}
const done=(e)=>{
    // let data=localStorage.setItem(input,e.value);
let Format = {firstname : input.firstname,lastname:input.lastname , email : input.email , password : input.password}
const information = JSON.stringify(Format)
localStorage.setItem("FORM ", information)
e.preventDefault()
    console.log(input);
}
    return (<>

        <div class="Container">

            <form onSubmit={done}>
                <input  type='text' name="firstname"  onInput = {fun1} value={input.firstname} required placeholder='Enter first name' />
                <br/>
                <input type='text' name="lastname" onInput = {fun1} value={input.lastname} required placeholder='Enter last name' />
<br/>
                <input type='email'name="email" onInput = {fun1} value={input.email} required placeholder='Enter email ' />
                <br/><br/>
                <input type='password'onInput = {fun1} name="password" value={input.password}  required placeholder='Enter password ' />
                <br/>
                <button > add </button>
                {/* <input type='text '/> */}

            </form>



        </div>

     </> )

}

export default Form