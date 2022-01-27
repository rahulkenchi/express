import axios from 'axios'
import React, { useRef } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
const regEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
const regPhone = new RegExp(/^[6-9][0-9]{9}/)

export default function Signup() {
    const navigate = useNavigate()
    const email = useRef()
    const password = useRef()
    const password2 = useRef()
    const phone = useRef()

    const sending = () => {
        if (regEmail.test(email.current.value)) {
            if (!regPhone.test(phone.current.phone)) {
                if (password.current.value === password2.current.value) {
                    axios.post("http://localhost:7799/signup", { email: email.current.value, MobileNo: phone.current.value, password: password.current.value })
                        .then(res => { console.log('OK Data sent.'); navigate("/login") })
                        .catch(err => alert('Some how failed too send data'))
                }
                else {
                    alert('Password does not match make sure password and confirm password are same.')
                }
            }
        }
        else {
            alert('email format incorrect')
        }
    }

    return (
        <Form className="my-2">
            <h3>Signup</h3>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="text" name="email" ref={email} placeholder="john@test.com" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPhone">
                <Form.Control type="text" name="phone" ref={phone} placeholder="98000000000" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="password" name="password" ref={password} placeholder="password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword2">
                <Form.Control type="password" name="password2" ref={password2} placeholder="confirm password" />
            </Form.Group>
            <Button variant="dark" onClick={() => sending()}>
                Signup
            </Button>
        </Form>
    )
}
