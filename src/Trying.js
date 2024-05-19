import React  from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const Trying = () => {
    let [card,setCard]=useState([]);
    useEffect(()=>{
        fetch('https://dummyjson.com/recipes').then(data=>data.json()).then((res)=>{
          // console.log(res.recipes);
          setCard(res.recipes)
        }).catch((e)=>{
          console.log(e);
        })
    },[])

    function Delte(id) {
      let newData = card.filter((_value, index) => index !== id);
      setCard(newData);
  }

return (
    <>
        <h1>Data todo</h1>
        {card.map((a, index) => (
            <div key={index}>
              
                <p>{a.name}</p>
                <p>{a.id}</p>
                <img src={a.image} alt="dish" height={400} width={400} />
                <br/>
                <button onClick={() => Delte(index)}>Delete</button>
            </div>
        ))}
    </>
);
}

export default Trying

// const obj={a:"hello",b:"hey",a:"hellof"};
// console.log(obj);