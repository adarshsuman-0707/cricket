import React, { useLayoutEffect } from 'react'
import { useState, useReducer } from 'react'
import {Link} from 'react-router-dom'
import './playing.css'
import 'bootstrap/dist/css/bootstrap.min.css'
// import { Check } from 'lucide-react'
const Playing = () => {
    let [score, setScore] = useState(0);
    let [over, setOver] = useState(0);
    let [run, setRun] = useState(0);
    let [wicket, setWicket] = useState(0)
    let [ball, setBall] = useState(0)
    let [counter,setCounter]=useState(0)
    let [check,setCheck]=useState(false)
    let reduce = (state, action) => {
  
          let newdar=localStorage.getItem("data ")
            let newdata=JSON.parse(newdar)
        let CheckOver=newdata.over;
        let ovrCom=newdata.player;
        console.log(ovrCom);
        if (action.type === "OVER") {
          
     
            if (ball === 6 && CheckOver>over && ovrCom>wicket) {
               setCounter(0);
                setOver(over + 1)
                setScore(0)
                setBall(0)
            }
        }

        else if (action.type === "wickets") {
            if (ball < 6  && CheckOver>over && ovrCom>wicket) {
                setCounter(counter+1)
                setWicket(wicket + 1)
                setBall(ball + 1)
          
            }
        }
        else if (action.type === "one" ) {
            if (ball < 6  && CheckOver>over && ovrCom>wicket) {
                setScore(score + 1)
                setRun(run + 1)
                setCounter(counter+1)
                setBall(ball + 1)
            }
        }
        else if (action.type === "two") {
            if (ball < 6  && CheckOver>over && ovrCom>wicket) {
                setScore(score + 2)
                setCounter(counter+1)
                setRun(run + 2)
                setBall(ball + 1)
            }
        }
        else if (action.type === "three") {
            if (ball < 6  && CheckOver>over && ovrCom>wicket) {
                setScore(score + 3)
                setCounter(counter+1)
                setRun(run + 3)
                setBall(ball + 1)
            }
        }
        else if (action.type === "four") {
            if (ball < 6  && CheckOver>over && ovrCom>wicket) {
                setScore(score + 4)
                setRun(run + 4)
                setCounter(counter+1)
                setBall(ball + 1)
            }

        } else if (action.type === "six") {
            if (ball < 6  && CheckOver>over && ovrCom>wicket) {
                setScore(score + 6)
                setCounter(counter+1)
                setRun(run + 6)
                setBall(ball + 1)
            }
        }
        else if (action.type === "wide") {
            if (ball < 6  && CheckOver>over && ovrCom>wicket) {
                setScore(score + 1)
                setRun(run + 1)
                setBall(ball)
            }
        }
        else if(action.type==="zero"){
            if(ball<6  && CheckOver>over && ovrCom>wicket){
            setBall(ball+1)
            setCounter(counter+1)

        }}
    }
    let [, dispatch] = useReducer(reduce, 0)
    let [name, setName] = useState("");

    useLayoutEffect(() => {
        let a = localStorage.getItem("data ");
        let newdata = JSON.parse(a)
        setName(newdata)
        

    }, [])
    return (
        <div className='Maincard'>

            <div className="container cardinner">
                <div className='head2'>
                <div class="head"> 
                <h1 align="center " id="demotxt">Welcome On Score Board</h1>
                   </div>
                   <div className="btnasd">
                 <Link to='/'>  <button class="Btn">

<div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>

<div class="texting">Home</div>
</button></Link>
                   </div> 
                   </div>
                <div className=''> </div>
                <div className='two_parts'>
                    <div className='part1'>
                        <span className='board'>
                            <table border="0">

                                <tr> <th>Team Name </th> <th> {name.Firstname}</th></tr>
                                <tr> <th>Total Player </th> <th>{name.player}</th></tr><tr>
                                    <th>Total Over </th> <th> {name.over}</th></tr>
                            </table>
                        </span>
                    </div>
                    <div className='part2'>
                        <h1 id="heading" align="center">Live Scoring</h1>
                        <div className='shows text-center'>
                            <p className='outside'>
                                Score <p class="insideptag"> {score}</p>

                            </p>
                            <p className='outside'>
                                Ball <p class="insideptag"> {ball}</p>

                            </p><p className='outside'>
                                Wicket <p class="insideptag"> {wicket}</p>

                            </p><p className='outside'>
                                Total Run <p class="insideptag"> {run}</p>

                            </p><p className='outside'>
                                Total over <p class="insideptag">{over}.{counter} </p>

                            </p>
                        </div>
                        <div className="buttonHandle">
                        <button className="btn-class-name" onClick={() => dispatch(({ type: "zero" }))}>
                                <span className="back"></span>
                                <span className="front">0</span>
                            </button>
                            <button className="btn-class-name" onClick={() => dispatch(({ type: "one" }))}>
                                <span className="back"></span>
                                <span className="front">1</span>
                            </button>

                            <button className="btn-class-name" onClick={() => dispatch(({ type: "two" }))}>
                                <span className="back"></span>
                                <span className="front">2</span>
                            </button>
                            <button className="btn-class-name" onClick={() => dispatch(({ type: "three" }))}>
                                <span className="back"></span>
                                <span className="front">3</span>
                            </button>
                            <button className="btn-class-name" onClick={() => dispatch(({ type: "four" }))}>
                                <span className="back"></span>
                                <span className="front">4</span>
                            </button>
                            <button className="btn-class-name" onClick={() => dispatch(({ type: "six" }))}>
                                <span className="back"></span>
                                <span className="front">6</span>
                            </button>
                            <button className="btn-class-name" onClick={() => dispatch(({ type: "wickets" }))}>
                                <span className="back"></span>
                                <span className="front">out</span>

                            </button>
                            <button className="btn-class-name" onClick={() => dispatch(({ type: "wide" }))}>
                                <span className="back"></span>
                                <span className="front">wide</span>
                            </button>
                            <button className="btn-class-name" onClick={() => dispatch(({ type: "OVER" }))}>
                                <span className="back"></span>
                                <span className="front">over</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Playing