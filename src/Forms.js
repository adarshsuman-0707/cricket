import React, { useState } from 'react'

const Forms = () => {
const [input,setInput]=useState({
    firstname: ""
    , lastname : ""
})
function fun1(e){
    const {name,value}=e.target;
    setInput({...input,[name]:value})
    // console.log(name,value);
}

const done = (e) =>{
    e.preventDefault()

    let info={firstname:input.firstname,lastname:input.lastname};
    let information= JSON.stringify(info);
    localStorage.setItem("TEXT",information);


    console.log(input);
}
  return (
    <div><>
   < form onSubmit={done}>
<input type="text" name="firstname"  value={input.firstname } placeholder="ENter name first " onInput={fun1} />
<input type="text" name="lastname"  value={input.lastname } placeholder="ENter name last " onInput={fun1} />
<button  > Submit</button>
</form>
    </></div>
  )
}

export default Forms