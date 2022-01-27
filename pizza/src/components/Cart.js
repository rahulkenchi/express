import React, { useState, useEffect } from 'react'
import { Col, Row, Button, FormControl } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function Cart(props) {
    const [items, setItems] = useState([])
    const navigate = useNavigate()
    const [g, setG] = useState(0)
    useEffect(() => {
        if (sessionStorage.getItem('user') != undefined) {
            if (sessionStorage.getItem('cart') != undefined) {
                let tmp = JSON.parse(sessionStorage.getItem('cart'))
                setItems([...tmp])
                setG(tmp.reduce((sum, ele) => Number(ele.price) * Number(ele.quantity) + sum, 0))
            }
        }
        else { navigate("/login") }
    }, [])

    const del = (index) => {
        let tmp = items
        tmp.splice(index, 1)
        setItems([...tmp])
        let tmp2 = JSON.parse(sessionStorage.getItem('cart'))
        tmp2.splice(index, 1)
        sessionStorage.setItem('cart', JSON.stringify([...tmp2]))
        setG(items.reduce((sum, ele) => Number(ele.price) * Number(ele.quantity) + sum, 0))
        props.check()
    }

    const ch = (index, id) => {
        let q = document.getElementById(id).value
        if (q < 1) {
            items[index].quantity = 1
        }
        else {
            items[index].quantity = q
        }
        setG(items.reduce((sum, ele) => Number(ele.price) * Number(ele.quantity) + sum, 0))
    }

    const dot = () => {
        sessionStorage.setItem('cart', JSON.stringify(items))
    }
    return (
        <React.Fragment>
            <h2 className="m-2 ms-3">Shopping Cart</h2>
            <hr />
            {items.map((ele, index) =>
                <Row className="m-2" key={index}>
                    <Col xs={3} sm={3} md={3} lg={3}>
                        <img src={ele.path} width="150px" height="90px" />
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>{ele.name}</Col>
                    <Col xs={2} sm={2} md={2} lg={2}>$ {ele.price}</Col>
                    <Col xs={3} sm={3} md={3} lg={3}>
                        <FormControl
                            id={ele._id}
                            type="number"
                            className="me-2"
                            aria-label="Search"
                            value={ele.quantity}
                            min={1}
                            onChange={() => ch(index, ele._id)}
                        />
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2} className="text-end"><Button variant="dark" onClick={() => del(index)}>Delete</Button></Col>
                </Row>
            )}
            <Row className="m-2">
                <Col xs={5} sm={5} md={5} lg={5}></Col>
                <Col xs={2} sm={2} md={2} lg={2} style={{ fontSize: 'large', fontWeight: 'bold' }}>
                    $ {g}
                </Col>
                <Col xs={5} sm={5} md={5} lg={5} className="text-end">
                    <Button variant="dark" style={{ fontSize: 'large' }}
                        onClick={() => {
                            if (g != 0) {
                                navigate("/checkout", { state: g });
                                dot();
                            }
                            else if (g === 0) { alert('cart empty please buy a pizza.') }
                        }}>
                        Checkout &gt;</Button>
                </Col>
            </Row>
        </React.Fragment >
    )
}
