import React, { useState, useContext } from 'react'
import { GlobalState } from '../../GlobalState'
import Menu from "./icons/menu-filled.svg"
import Close from "./icons/close-filled.svg"
import Cart from "./icons/shopping-cart.svg"
import { Link } from 'react-router-dom'

const Header = () => {

    const value = useContext(GlobalState)

    return (
        <header>

            <div className="menu">
                <img src={Menu} width="30" alt="menu icon" />
            </div>
            <div className="logo">
                <h1>
                    <Link to="/">P.E Shop</Link>
                </h1>
            </div>
            <ul>
                <li><Link to="/">Products</Link></li>
                <li><Link to="/login">Login or Register</Link></li>
                <li>
                    <img src={Close} alt="close window" width="30" />
                </li>
            </ul>

            <div>
                <span>0</span>
                <Link>
                    <img src={Cart} alt="shopping-cart" width="30" />
                </Link>
            </div>
        </header>
    )
}

export default Header