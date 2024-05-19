import React from 'react'
// import Cart from './Cart'
import {useLocation} from 'react-router-dom'
const ViewCart = () => {
  const location = useLocation();
  const { cart } = location.state;
  console.log(cart,"dddd");

  return (
    <div>
      <h2>View Cart</h2>
      <ul>
        <h4>
        {cart.map((item, index) => (
          <li key={index}>
            {item.name} - Quantity: {item.quantity}
          </li>
        ))}
        </h4>
      </ul>

    </div>
  );
};
export default ViewCart;