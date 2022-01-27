import axios from 'axios'
import React, { useRef, useState, useEffect } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
const regCredit = new RegExp(/^[0-9]{16}$/)

export default function Checkout(props) {
    const cardcredit = useRef()
    const [boo, setBoo] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (sessionStorage.getItem('user') != undefined) { }
        else { navigate("/login") }
    }, [])


    const check = () => {
        if (regCredit.test(cardcredit.current.value)) {
            let token = sessionStorage.getItem('user')
            let tmp = jwt_decode(token)
            let email = tmp.email
            let list = JSON.parse(sessionStorage.getItem('cart'))
            for (let i = 0; i < list.length; i++) { delete list[i]._id }
            axios.post("http://localhost:7799/order", { email: email, list: list }, { headers: { "Authorization": `Bearer ${token}` } })
                .then(res => {
                    if (res.data.err == 0) {
                        setBoo(false);
                        sessionStorage.removeItem('cart');
                        props.check()
                    }
                    else if (res.data.err > 0) {
                        alert(res.data.msg)
                    }
                }
                )
                .catch(err => alert('Ordering failed.'))
        }
        else { alert("Credit card number incorrect") }
    }
    return (
        <>
            {
                boo ?
                    <React.Fragment >
                        <h3 className="my-2">Checkout</h3>
                        <Form.Group controlId="formcreditcard">
                            <Form.Label>Credit Card</Form.Label>
                            <Form.Control type="number" ref={cardcredit} />
                        </Form.Group>
                        <p>Order Total: <span style={{ fontWeight: 'bold' }}>$ {location.state}</span></p>
                        <p><Button variant="dark" onClick={() => check()}>Checkout</Button></p>
                    </React.Fragment >
                    :
                    < React.Fragment >
                        <h3 className="my-2">Order has been placed successfully!</h3>
                        <Alert variant="success">
                            You will receive notification by email with order details.
                        </Alert>
                        <p><Button variant="dark" onClick={() => navigate("/menu")}>Go an order some more</Button></p>
                    </React.Fragment >
            }
        </>
    )
}
