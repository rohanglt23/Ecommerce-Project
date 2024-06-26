import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ZeroProduct from "./ZeroProduct.jsx";
import { FaTrashAlt } from "react-icons/fa";
import { add, remove, removeOne, clear } from "../redux/features/navbar/navbarSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import "../styles/ShoppingCart.css";

function ShoppingCart() {
  const productsInShoppingCart = useSelector((state) => state.navbarReducer.value); // productsInShoppingCart is an array

  let shoppingCartDetails = useMemo(() => {
    return productsInShoppingCart.map(product => ({
      reference_id: product.id,
      description: `${product.quantity}x ${product.brand} - ${product.title}`,
      amount: {
        value: +((product.price * product.quantity)/80).toFixed(2)
      }
    }))
  }, [ productsInShoppingCart ])

  useEffect(() => {
    if (shoppingCartDetails?.length) {
      window.paypal.Buttons({
        createOrder: (data,actions,err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: shoppingCartDetails
          })
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          if (order) {
            navigate("/");
            dispatch(clear());
            toast.success("Order Placed Successfully!")
          }
        },
      }).render("#paypal-btn")
    }
  },[shoppingCartDetails])
 
  function calculateTotalPrice() {
    let totalPrice = 0;
    for (let i = 0; i < productsInShoppingCart.length; i++) {
      totalPrice += productsInShoppingCart[i].price * productsInShoppingCart[i].quantity; 
    }
    return totalPrice;
  }

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const defaultStyle = {
    color: "#9d174d",
    cursor: "pointer"
  }

  const otherStyle = {
    color: "#dcd9d9",
    cursor: "default"
  }

  return (
    <>
      <h1 id="shopping-cart-heading">SHOPPING CART</h1>
      {calculateTotalPrice() === 0 ? (
        <ZeroProduct />
      ) : (
        <>
          {productsInShoppingCart.map((eachProduct, index) => (
            <div id="single-cart-container" key={index}>
              <img src={eachProduct.thumbnail} alt={"product image"} onClick={() => navigate(`/details/${eachProduct.id}`)} />

              <div id="details">
                <span id="brand">{eachProduct.brand}</span>
                <span id="title">{eachProduct.title}</span>
              </div>

              <div id="edit">
                <div id="minus" onClick={() => dispatch(removeOne(eachProduct.id))} style={eachProduct.quantity < 2 ? otherStyle : defaultStyle}>-</div>
                <div id="quantity">{eachProduct.quantity}</div>
                <div id="plus" onClick={() => dispatch(add(eachProduct))}>+</div>
              </div>

              <div id="price">
                <span id="dolar-span">₹</span>
                <span id="price-span">{eachProduct.price * eachProduct.quantity}</span>
                <span
                  id="trash-icon"
                  onClick={() => dispatch(remove(eachProduct.id))}
                >
                  <FaTrashAlt />
                </span>
              </div>

            </div>
          ))}

          <div id="total-price-div">
            <span id="left">Total Price: </span>
            <span id="dolar">₹</span>
            <span id="right">{calculateTotalPrice()}</span>
          </div>
          <div className="checkout-btn">
            <div id="paypal-btn"></div>
          </div>
        </>
      )}
    </>
  );
}

export default ShoppingCart;
