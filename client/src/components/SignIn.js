import React, { useState, useEffect } from "react";
import axios from 'axios'
const host = 'http://localhost:7070'
const hostClient = 'http://localhost:3000'


export default function SignIn () {
    const [form, setForm] = useState({
        userName: '',
        password: ''
    })

    useEffect(() => {
        if (localStorage.length > 0) {
            setForm({
                'userName': localStorage.getItem('userName'),
                'password': localStorage.getItem('password'),
            })
        }
    }, [])

    const f_handleInputs = (e) => {
        if (e.value !== '' && e.value !== ' ') {
            setForm({...form, [e.name]: e.value})
        }
    }

    const validate = () => {
        let isValidate = true

        setForm({
            userName: form.userName.trim(),
            password: form.password.trim()
        })

        const regexText = new RegExp(
            /^[a-zA-Z0-9]$/
        )

        if (regexText.test(form.userName)) {
            openModal(`Por favor não use  careceres especiais no campo userName`)
            isValidate = false
        }

        if (regexText.test(form.password)) {
            openModal(`Por favor não use  careceres especiais no campo na sua senha`)
            isValidate = false
        }

        if (form.userName === '') {
            openModal(`Por favor preencha o campo YserName`)
            isValidate = false
        }

        if (form.password.length < 8) {
            openModal(`Por favor Crie uma senha com pelo menos 8 dígitos`)
            isValidate = false
        }

        return isValidate
    }

    const openModal = (msg) => {
        const ctrModal = document.querySelector('.ctr-modal')

        ctrModal.classList.remove('close')
        document.querySelector('.modal p').innerHTML = msg

        document.addEventListener('keydown', (key) => {
            key = key.key
            
            if (key === 'Enter' || key === 'Escape') {
                closeModal()
            }
        })
    }

    const closeModal = () => {
        document.querySelector('.ctr-modal').classList.add('close')
        document.querySelector('.ctr-modal button').focus()
    }

    const sendDatas = (e) => {
        const buttonModal = document.querySelector('#buttonModalClose')

        if (validate()) {
            document.querySelector('.wrapper').classList.remove('close')
            document.querySelector('.blur').classList.remove('none')

            setTimeout(() => {
                axios.post(`${host}/signin`, {
                    userName: form.userName,
                    password: form.password
                }).then((res) => {
                    document.querySelector('.wrapper').classList.add('close')
                    document.querySelector('.blur').classList.add('none')
                    
                    localStorage.removeItem('password')
                    window.location.href = `${hostClient}/`
                })
                .catch((error) => console.log(error))
            }, 700)
        } else {
            buttonModal.focus()
        }

    }

    return (
    <div className="signIn form">
        <div className="ctr-modal close">
            <div className="modal">
                <div className="ctr-notice">
                    <h3 className="notice">Aviso:</h3>
                    <p></p>
                </div>

                <button className="close button-small" id="buttonModalClose" onClick={() => {closeModal()}}>Fechar</button>
            </div>
        </div>

        <div className="blur none">
        </div>
        
        <div className="wrapper close">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
        </div>

        <h2>Login-in</h2>


        <div className="ctr-inputs">
            <div className="ctr-input">
                <label htmlFor="userName">UserName:</label>
                <input 
                    type='text' 
                    id="userName" 
                    name="userName" 
                    value={form.userName}
                    placeholder='Digite seu userName'
                    onChange={(e) => {f_handleInputs(e.target)}}
                />
            </div>

            <div className="ctr-input">
                <label htmlFor="senha">Senha:</label>
                <input 
                    type='password' 
                    id="password" 
                    name="password" 
                    value={form.password}
                    placeholder='Digite sua senha'
                    onChange={(e) => {f_handleInputs(e.target)}}
                />
            </div>
        </div>

        <button type="button" onClick={() => {sendDatas()}}>Entrar</button>
    </div>
    )
}