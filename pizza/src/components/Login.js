import React, { useRef } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const regEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
export default function Login(props) {
    const email = useRef()
    const password = useRef()
    const navigate = useNavigate()
    const validate = () => {
        if (regEmail.test(email.current.value) && password.current.value.length > 0) {
            axios.post("http://localhost:7799/log", { email: email.current.value, password: password.current.value })
                .then(res => {
                    if (res.data.err > 0) {
                        alert(res.data.msg)
                    }
                    else if (res.data.err === 0) {
                        sessionStorage.setItem('user', res.data.token);
                        navigate("/menu")
                        props.loggedin()
                    }
                })
                .catch(console.log('ok'))
        }
        else {
            alert('password empty or email incorrect.')
        }
    }

    return (
        <Form className="my-2" method="post">
            <h3>Login</h3>
            <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Control type="text" ref={email} placeholder="john@test.com" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="password" ref={password} placeholder="●●●●" />
            </Form.Group>
            <Button variant="dark" onClick={() => validate()}>
                Login
            </Button>
        </Form>
    )
}
