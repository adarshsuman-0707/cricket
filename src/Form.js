import {React,useState,useEffect} from 'react'

// import './Manage.css'
     
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
    e.preventDefault()
    // let data=localStorage.setItem(input,e.value);
// let Format = {firstname : input.firstname,lastname:input.lastname , email : input.email , password : input.password}
const information = JSON.stringify(input)
localStorage.setItem("data ", information)
setData(input)
    // console.log(input);

}
const [data,setData]=useState(null);



console.log(localStorage.getItem("data "))
useEffect(()=>{
let a =localStorage.getItem("data ")
  let newdata=JSON.parse(a);
  console.log(newdata);
  setData(newdata)
   
},[])
  
const remove=()=>{
    // setData('  ')
    localStorage.clear('data ')
    setData(null)
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
            


            </form>
            <br/>
            <br/>
      
{/* // nhi mila kuch bhi show nhi hoga  */}

             <div>{
             
             data?(<><h1>{data.firstname}</h1>
             <h1>{data.lastname}</h1>
             <h1>{data.email}</h1>
             <h1>{data.password}</h1></>):(<><h2>nhi mila kuch bhi</h2></>)
             }</div>

{data ? (<button onClick={remove}>Remove</button>) : " "}
        </div>

     </> )

}

export default Form