import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import Cart from './Cart';
// import Apps from './Apps';
// import App from './App';
// import Forms from './Forms';
// import Navboot from './Navboot'
// import Effect from './Effect'
// import Todo from './Todo';
// import Recipie from './Recipie';
// import Form from './Form';
// import Reducer from './Reducer';
import Crickets from './Crickets';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom'
// import AppCart from './AppCart';
// var name="Adarsh"
// import Trying from './Trying';
// import Cart from './Cart';
import SPLoader from './Spinner';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   
//   <React.StrictMode>
//     {/* <Navboot/>
//     <App data={name}/> */}
//     <Effect/>
//  </React.StrictMode>
 <BrowserRouter>
{/* <Recipie/> */}
{/* <Apps/>  */}
{/* <Crickets/> */}
<SPLoader/>
{/* <Todo/> */}
{/* <Forms/> */}
{/* <Trying/> */}
{/* <AppCart/> */}
{/* <Reducer/> */}
</BrowserRouter> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
