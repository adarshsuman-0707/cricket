import React from 'react'
// import './Manage.css'

const Fo=()=>{
    return (<>
        <div id="form">
         <h1 id="hadding">Fill form</h1>
         <input type="text" placeholder="Fullname" spellCheck="true"/><br></br>
         <input type="text" placeholder="Branch" spellCheck="true"/><br></br>
      
         <input type="text" placeholder="College" spellCheck="true"/>
         <button type="submit">Submit</button>
      </div>
        </>
        )
}
const Manage = () => {
return(
<>
<Fo/>

</>
)
}

export default Manage