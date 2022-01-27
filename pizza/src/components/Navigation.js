import React, { useContext, useEffect, useState } from 'react'
import { Navbar, Nav, Container, Image } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import axios from 'axios'

export default function Navigation(props) {
    const [count, setCount] = useState('')
    useEffect(() => {
        if (sessionStorage.getItem('cart') != undefined) {
            setCount(JSON.parse(sessionStorage.getItem('cart')).length)
        }
        else { setCount(''); }
        props.check2()
    }, [props.login, props.cart])


    const des = () => {
        sessionStorage.removeItem('cart')
        sessionStorage.removeItem('user')
        props.check2()
        props.logout()
    }

    const sendingmail = async () => {
        if (sessionStorage.getItem('user') != undefined) {
            let token = sessionStorage.getItem('user')
            axios.get("http://localhost:7799/checkmail", {
                headers: { "Authorization": `Bearer ${token}` }
            })
        }
    }
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand><Image src="../images/brand_img.jfif" width="70px" height="70px" rounded></Image>
                    <span className="ml-5"> Sicilian Pizza</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav style={{ alignItems: 'center' }}>
                        {!props.login ?
                            <>
                                <NavLink to="/signup" className="btn border ms-3 my-2">Signup</NavLink>
                                <NavLink to="/login" className="btn border ms-3 my-2">Login</NavLink>
                            </>
                            :
                            <>
                                <NavLink to="/menu" className="ms-3">Menu</NavLink>
                                <NavLink to="/cart" className="ms-3">Cart {count > 0 ? <span className="bg-secondary rounded text-white p-1">{count}</span> : ' '}</NavLink>
                                <Nav.Link onClick={() => sendingmail()} >Click</Nav.Link>
                                <NavLink to="/login" className="btn border ms-3" onClick={() => des()}>Logout</NavLink>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    )
}
