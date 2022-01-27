import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Image } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export default function Menu(props) {
    const navigate = useNavigate()
    const [items, setItems] = useState([])

    useEffect(async () => {
        if (sessionStorage.getItem('user') != undefined) {
            let token = sessionStorage.getItem('user')
            let tmp = await axios.get("http://localhost:7799/getmenu", {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (tmp.data.err === 0) {
                setItems([...tmp.data.data])
            }
            else if (tmp.data.err > 0) {
                alert(tmp.data.msg)
            }
        }
        else {
            navigate("/login")
        }
    }, [])

    const cart = (element) => {
        if (sessionStorage.getItem('cart') != undefined) {
            let tmp = JSON.parse(sessionStorage.getItem('cart'))
            // console.log(tmp.filter(ele => ele.name == element.name))
            if (tmp.filter(ele => ele.name == element.name).length === 0) {
                element.quantity = 1
                tmp.push(element)
                sessionStorage.setItem('cart', JSON.stringify(tmp))
            }
        }
        else {
            element.quantity = 1
            sessionStorage.setItem('cart', JSON.stringify([element]))
        }
        props.check()
    }

    return (
        <React.Fragment>
            <h4 className="my-3">Menu</h4>
            <Row>
                {items.map((ele, index) =>
                    <Col xs={12} sm={12} md={6} lg={4} className="g-4" key={index}>
                        <Card>
                            <Card.Img variant="top" src={ele.path} height="220px" />
                            <Card.Body>
                                <Card.Title className="text-center">{ele.name}</Card.Title>
                                <Card.Text>
                                    <Button variant="dark" onClick={() => { cart(ele) }}>Add to Cart</Button>
                                    <p className="text-center" style={{ display: 'inline-block', width: '58%', fontWeight: 'bold' }}>${ele.price}</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </React.Fragment>
    )
}
