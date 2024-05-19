import { Currency } from 'lucide-react'
import { React, useEffect, useState, useReducer } from 'react'

const Effect = () => {
    const [count, setCount] = useState(0)
    const [counting, setCounting] = useState(0)
    let [titles, setTitle] = useState([])

    // useEffect(() => {

    //     fetch('https://jsonplaceholder.typicode.com/todos')
    //         .then(response => response.json())
    //         .then(json => setTitle(json))

    //     console.log(titles);

    // }, [count])
    function deletes(id) {
        setTitle(titles.filter((val) => {
            return val.id !== id
        }))
    }
    useEffect(() => {
        setInterval(() => {
            setCounting(precounting => precounting + 1)
        }, 1000)

        // return ()=>clearInterval(int)
    }, [])


    return (
        <>
            <h2>{counting}</h2>
            <h1>{count}</h1>
            <button onClick={add}>Add</button>
            <div>
                {
                    titles.map((val) => {
                        return (

                            <>
                                <ul>
                                    <li key={val.id}>
                                        <h1>{val.title}</h1>
                                        <h2>{val.id}</h2>
                                        <button onClick={() => deletes(val.id)}>delete</button>

                                    </li>
                                </ul>
                            </>
                        )
                    })
                }
</div>


                <Currency /> <h1>{ }</h1>
                


        </>
    )
}

export default Effect