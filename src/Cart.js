import { useState, React, useEffect } from 'react'
import Cartdata from './Cartdata'
import { useNavigate } from 'react-router-dom'
import './cart.css'


function Cart() {
  let [data, setData] = useState([])
  let [cart,setCart]=useState([])

  // Hera add on quantity in dataset with the help of useEffect

  useEffect(() => {
    setData(
      Cartdata.map((item) => ({ ...item, quantity: 0 }))
    )
    console.log(Cartdata);
  }, [])

  // Here navigate the page which is help to directly navigate the View page 
  let navigate = useNavigate()
  function Vsiew() {
    navigate("/view",{state:{cart}})
  }
  
  // Here add the quantity :1 initially  
  function handleaddtocart(id) {
    let update = data.map(item => (item.id === id ? ({ ...item, quantity: 1 }) : item))
    setData(update)
    const productToAdd = { ...Cartdata.find(item => item.id === id), quantity: 1 };
    setCart([...cart, productToAdd]);

  }
// Here increase the quantity + and this function is run when is click (+)
  function handleadds(id) {
    console.log(id);
    const updateCart = data.map(item => (item.id === id ? ({ ...item, quantity: item.quantity + 1 }) : item))
    setData(updateCart)
    const productToAdd = { ...Cartdata.find(item => item.id === id) };
    setCart([...cart, productToAdd]);
  
  }

// Here decrease the quantity + and this function is run when is click (-)

  function handleremove(id) {
    const updateCart = data.map(item => (item.id === id ? ({ ...item, quantity: item.quantity - 1 }) : item))
    setData(updateCart)
    let updated={...Cartdata.find(item=>item.id===id?item.quantity=item.quantity-1:item.quantity ),quantity:1}
    console.log(updated);
    setCart([...cart,updated])
  }
  // Here total the price allover item and multiply the quantity and store in total 
  function gettotal() {
    let total = data.reduce((total, item) => total + item.price * item.quantity, 0)
    return total
  }
  return (

    <div class="cart-container">

      <h2>Cart</h2>
      <button class="shows" onClick={() => Vsiew()}> View Cart</button>

      <p>Total price:{gettotal()}</p>
      <ul className='cart-items'>

        {
          data.map((item => <li key={item.id} class="list">
            <div class="image">
              <img src={item.image} alt={item.name} height={200} />
            </div>
            <div class="items">
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <p>price : ${item.price}</p>
              <p>quantity : {item.quantity}</p>

{/* it wuantity is one so show Add to cart one otherwise show + ana - button  */}
              {
                item.quantity === 0 ? (<><button className="shows" onClick={() => { handleaddtocart(item.id) }}> Add to cart</button></>) :
                  (<><div>
                    <button onClick={() => { handleremove(item.id) }} class="show1"> - </button>  <span>
                      {item.quantity}
                    </span><span> </span>
                    <button class="show1" onClick={() => { handleadds(item.id) }}> +</button>

                  </div></>)

              }


              <hr />
            </div>
          </li>

          )

          )
        }
        <hr />

      </ul>
    </div>
  )
}

export default Cart