import React from 'react'
import Manage from './Manage'
import Nework from './Nework'
const NAVBAR=()=>{

    return (
        <>
        <h1> ME kuch to kr rha hu </h1>
        </>
    )
}

function VALUE(){
let arr=[1,2,3,5];
return (
    <div>
        {
            arr.map((s)=>{
                return (
                    <h1><li>{s}</li></h1>
                )
            })
        }
    </div>
)

}

function TRY(){
    let obj={name:"Sonu",Branch : "CSE", Clg : "Truba"};
    return(<>
        <h1>{obj.name}</h1>
        <h1>{obj.Branch}</h1>
        <h1>{obj.Clg}</h1>
        </>
    )
}
const Home = (s) => {
  return (
<>
<h3>{s.data}</h3>
<NAVBAR/>
<VALUE/>
<TRY/>
<Manage/>
<Nework/>


</>
  )
}

export default Home