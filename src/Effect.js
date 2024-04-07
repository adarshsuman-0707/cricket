import {React,useEffect,useState} from 'react'

const Effect = () => {
    const [count,setCount]=useState(0)

    function add(){
setCount(count+1)
    }

    let [titles,setTitle]=useState([])

    useEffect(()=>{
      
        fetch('https://jsonplaceholder.typicode.com/todos')
        .then(response => response.json())
        .then(json => setTitle(json))


      },[count])
  return (
   <>

   <h1>{count}</h1>
   <button onClick={add}>Add</button>
   <div>
    {
 titles.map((val)=>{
    return(

        <>
    <h1>{val.title}</h1>
    
    </>
    )
 })
    }
   </div>
   
   
   </>
  )
}

export default Effect