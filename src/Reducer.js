import React from 'react'
import { useReducer } from 'react'
import './reducer.css'
const Reducer = () => {
    // let reducer=(state,action)=>{
    //     if(action.type==='incre'){
    //         return state+1
    //     }
    //     else if(action.type==='decre'){
    //         return state-1
    //     }
    //     else if (action.type==='reset'){
    //         return state=0
    //     }
    //     return state
    // }
    // let [state,dispatch]=useReducer(reducer,0)

    // let reducer1=(state,action)=>{
    // switch(action.type){
    //     case 'change':
    //        return !state
    // }
    // }

    // let [color1,dispatch1]=useReducer(reducer1,true)

let reducer=(state,action)=>{
    switch(action.type){
        case "INPUT":
            return { ...state, input: state.input + action.payload };
            case 'CLEAR':
              return { ...state, input: '', result: 0 };
            case 'CALCULATE':
              return { ...state, result: eval(state.input) };
            default:
              return state;
          }
    }
    const initialstate = {
        input: '',
        result: 0
      };
    const [state,dispatch]=useReducer(reducer,initialstate)
    
    const handleInput=(value)=>{dispatch({type:"INPUT",payload:value})}
    const clearInput=()=>{
        dispatch({type:"CLEAT"})
    }
  return (<> 
     {/* <div style={{backgroundColor:color1?"yellow":"Green"}}  > 
    
        {state}<br/>
   <p> <button onClick={()=>dispatch(({type:"incre"}))}> increment</button></p>
    <button onClick={()=>dispatch(({type:"decre"}))}> decrement</button>
    <br/>
    <button onClick={()=>dispatch(({type:"reset"}))}> reset</button>

    <button onClick={()=>dispatch1(({type:"change"}))}> tOGGLE</button>

    </div> */}

    <div>
      <h1>Simple Calculator</h1>
      <input type="text" value={state.input} readOnly />
      <br />
      <button onClick={() => handleInput('1')}>1</button>
      <button onClick={() => handleInput('2')}>2</button>
      <button onClick={() => handleInput('3')}>3</button>
      <button onClick={() => handleInput('+')}>+</button>
      <br />
      <button onClick={() => handleInput('4')}>4</button>
      <button onClick={() => handleInput('5')}>5</button>
      <button onClick={() => handleInput('6')}>6</button>
      <button onClick={() => handleInput('-')}>-</button>
      <br />
      <button onClick={() => handleInput('7')}>7</button>
      <button onClick={() => handleInput('8')}>8</button>
      <button onClick={() => handleInput('9')}>9</button>
      <button onClick={() => handleInput('*')}>*</button>
      <br />
      <button onClick={() => clearInput()}>C</button>
      <button onClick={() => handleInput('0')}>0</button>
      <button onClick={() =>dispatch({type:"CALCULATE"})}>=</button>
      <button onClick={() => handleInput('/')}>/</button>
      <br />
      <h2>Result: {state.result}</h2>
    </div></>

  )
}

export default Reducer