import React, {useEffect, useState} from "react";
import imagePerfil from './assets/images/perfil.jpg'
import axios from "axios";
import { io } from 'socket.io-client'
const socket = io(process.env.REACT_APP_HOST_SERVER)
const host = process.env.REACT_APP_HOST_SERVER

socket.emit('online', true)
socket.emit('getName', localStorage.getItem('userName'))

export default function PerfilFriend () {
    const [chat, setChat] = useState()
    const [online, setOnline] = useState()

    useEffect(() => {        
        axios.post(`${host}/getChat`, {
            chatName: localStorage.getItem('chatName'),
            userName: localStorage.getItem('userName')
        }).then((res) => {
            setChat(res.data)
        }).catch((error) => console.log(error))

        axios.post(`${host}/getOnline`, {
            chatName: localStorage.getItem('chatName'),
        }).then((res) => {
            setOnline(res.data)
        }).catch((error) => console.log(error))
    }, [])

    const blockUser = () => {
        axios.post(`${host}/blockUser`, {
            userName: localStorage.getItem('userName'),
            userBlock: localStorage.getItem('chatName')
        }).then((res) => {
            socket.emit('userBlocked', {
                blockedUser: localStorage.getItem('chatName'),
                user: localStorage.getItem('userName')
            })
            f_disableChat()
        }).catch((error) => console.log(error))
    }

    const f_goHome = () => {
        window.location.href = '/'
    }

    const f_disableChat = () => {
        document.querySelector('.home .blur').classList.remove('none')

        setTimeout(() => {
            f_goHome()
        }, 1000);

    }

    const openPrompt = (msg, funcCancel, funcNext, reload) => {
        const ctrPrompt = document.querySelector('.ctr-prompt')
        const buttonCancel = document.querySelector('.ctr-prompt .buttonCancel')
        const buttonNext = document.querySelector('.ctr-prompt .buttonNext')

        ctrPrompt.classList.remove('close')
        document.querySelector('.modal p').innerHTML = msg

        document.addEventListener('keydown', (key) => {
            key = key.key
            
            if (key === 'Escape') {
                funcCancel()
            }
        })

        buttonNext.addEventListener('click', () => {
            if (reload === true) {
                funcNext()
                window.location.reload()
            } else {
                funcNext()
            }
        })

        buttonCancel.addEventListener('click', () => {
            funcCancel()
        })
    }

    const closePrompt = () => {
        document.querySelector('.ctr-prompt').classList.add('close')
        document.querySelector('.ctr-prompt button').focus()
    }

    const returnPerfil = () => {
        if (online !== 'undefined') {
            return (
            <div className="perfil">
                <img src={imagePerfil} className="picture-large" alt="foto de perfil do usu??rio"/>
                <p className="body-large">{chat.name}</p>
                <p>{online === true? 'online': 'offline'}</p>
    
                <button 
                    className="block"
                    onClick={() => {openPrompt('Deseja bloquear este usu??rio?', closePrompt, blockUser, false)}}
                >Bloquear usu??rio</button>
            </div>
            )
        }
    }


    return (
        typeof(chat) !== 'undefined' && returnPerfil()
    )
}