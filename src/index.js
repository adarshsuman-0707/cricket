import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Apps from './Apps';
import App from './App';
import Forms from './Forms';
import Navboot from './Navboot'
import Effect from './Effect'
import Todo from './Todo';
import Form from './Form';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom'
var name="Adarsh"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
//   <React.StrictMode>
//     {/* <Navboot/>
//     <App data={name}/> */}
//     <Effect/>
//  </React.StrictMode>
 <BrowserRouter>

<Apps/> 
{/* <Effect/> */}
{/* <Todo/> */}
<Form/>
</BrowserRouter> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
