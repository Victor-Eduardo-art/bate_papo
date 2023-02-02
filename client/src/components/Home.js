import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Routes, Route, Link } from 'react-router-dom'
import Perfil from './Perfil'
import PerfilFriend from './PerfilFriend'
import Chats from "./Chats";
import Chat from "./Chat";
import { io } from 'socket.io-client'
const host = process.env.REACT_APP_HOST_SERVER
const socket = io(process.env.REACT_APP_HOST_SERVER)

socket.emit('online', true)
socket.emit('getName', localStorage.getItem('userName'))

export default function Home () {
    const [form, setForm] = useState({
        userName: '',
        message: ''
    })
    
    const openModal = (msg, reload) => {
        const ctrModal = document.querySelector('.ctr-modal')
        const buttonClose = document.querySelector('.ctr-modal #buttonModalClose')

        ctrModal.classList.remove('close')
        document.querySelector('.modal p').innerHTML = msg

        document.addEventListener('keydown', (key) => {
            key = key.key
            
            if (key === 'Enter' || key === 'Escape') {
                if (reload === true) {
                    closeModal()
                    window.location.reload()
                } else {
                    closeModal()
                }
            }
        })

        buttonClose.addEventListener('click', () => {
            if (reload === true) {
                closeModal()
                window.location.reload()
            } else {
                closeModal()
            }
        })
    }

    const closeModal = () => {
        document.querySelector('.ctr-modal').classList.add('close')
        document.querySelector('.ctr-modal button').focus()
    }

    const f_closeAddUser = () => {
        document.querySelector('.modal-addUser').classList.add('close')
    }

    const f_handleInputs = (e) => {
        setForm({...form, [e.name]: e.value})
    }

    const validate = () => {
        let isValidate = true

        setForm({userName: form.userName.trim(), message: form.message.trim()})

        const regexText = new RegExp(
            /^[a-zA-Z0-9]$/
        )

        if (regexText.test(form.userName)) {
            openModal(`Por favor não use  careceres especiais no campo userName`)
            isValidate = false
        }

        if (form.userName === '') {
            openModal(`Por favor preencha o campo userName`)
            isValidate = false
        }

        if (regexText.test(form.message)) {
            openModal(`Por favor não use careceres especiais no campo mensagem`)
            isValidate = false
        }

        if (form.message === '') {
            openModal(`Por favor escreva algo legal para iniciar a conversa`)
            isValidate = false
        }

        return isValidate
    }

    const f_addUser = () => {
        if (validate()) {
            document.querySelector('.wrapper').classList.remove('close')
            document.querySelector('.blur').classList.remove('none')
            
            axios.post(`${host}/addChat`, {
                friendName: form.userName,
                userName: localStorage.getItem('userName'),
                message: form.message,
            }).then((res) => {
                    document.querySelector('.wrapper').classList.add('close')
                    document.querySelector('.blur').classList.add('none')

                    console.log(res.data)

                    console.log(res.data)

                    if (res.data !== 'user not found' && 
                        res.data !== null && 
                        res.data !== 'user already added' &&
                        res.data !== 'this user is you') {

                        f_closeAddUser()
                        openModal('Amigo adicionado com sucesso! acabamos de adicionar um novo chat', true)
                    } else {
                        f_closeAddUser()
                        openModal(`${res.data}`)
                    }
                }).catch((error) => {
                    console.log(error)
                })
        }
    }

    return (
    <div className="home">
        <div className="blur none"></div>

        <div className="wrapper close">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
        </div>

        <div className="ctr-modal close">
            <div className="modal">
                <div className="ctr-notice">
                    <h3 className="notice">Aviso:</h3>
                    <p></p>
                </div>

                <button className="close button-small" id="buttonModalClose">Fechar</button>
            </div>
        </div>

        <div className="modal-addUser close">
            <h3>Adicionar amigo</h3>

            <div className="ctr-inputs">
                <div className="ctr-input">
                    <label htmlFor="userName">UserName:</label>
                    <input 
                        type='text' 
                        id="userName" 
                        name="userName" 
                        value={form.userName}
                        placeholder='Digite o userName do seu amigo'
                        onChange={(e) => {f_handleInputs(e.target)}}
                    />
                </div>

                <div className="ctr-input">
                    <label htmlFor="userName">Mensagem:</label>

                    <textarea
                        id="message" 
                        name="message" 
                        value={form.message}
                        placeholder='Escreva algo legal para iniciar a conversa'
                        onChange={(e) => {f_handleInputs(e.target)}}
                    ></textarea>
                </div>
            </div>

            <button onClick={() => {f_addUser()}}>Adicionar</button>
            <button 
                className="button-close button-small" 
                onClick={() => {f_closeAddUser()}}
            >Cancelar</button>
        </div>

        <Routes>
            <Route path="/" element={[<Perfil key='perfil'/>, <Chats key='chats'/>]}></Route>
            <Route path="/chat" element={[<PerfilFriend key='perfilFriend'/>, <Chat key='chat'/>]}></Route>
        </Routes>
    </div>
    )
}