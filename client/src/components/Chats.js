import React, { useEffect, useState } from "react";
import axios from 'axios'
import imagePerfil from './assets/images/perfil.jpg'
import iconOpen from './assets/icons/open.svg'
import { io } from 'socket.io-client'
const socket = io(process.env.REACT_APP_HOST_SERVER)
const host = process.env.REACT_APP_HOST_SERVER
const hostClient = process.env.REACT_APP_HOST_CLIENT

socket.emit('online', true)
socket.emit('getName', localStorage.getItem('userName'))

export default function Chats () {
    const [chats, setChats] = useState()

    useEffect(() => {
        if (localStorage.getItem('userName') !== null) {
            axios.post(`${host}/getMyChats`, {
                userName: localStorage.getItem('userName')
            }).then((res) => {
                setChats(res.data)

                socket.on('getUserBlocked', (data) => {                    
                    if (data.blockedUser === localStorage.getItem('userName')) {
                        console.log('vc foi bloqueado')
                        openModal(`o usuário ${data.user} lhe bloqueou, não seja babaca...`, true)
                    }
                })

                socket.on('getNewsFriends', (data) => {
                    console.log(data)
                    if (data.userAdded === localStorage.getItem('userName'), true) {
                        openModal(`o usuário ${data.user} lhe adicionou como amigo!`)
                    }
                })
            }).catch((error) => console.log(error))
        } else {
            window.location.href = `${hostClient}/signin`
        }
    },[])

    const openModal = (msg, reload) => {
        const ctrModal = document.querySelector('.ctr-modal')

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

        document.querySelector('.ctr-modal #buttonModalClose').addEventListener('click', () => {
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

    const openChat = (chatName, friendName) => {
        document.querySelector('main').classList.add('opacity-0')

        localStorage.setItem('chatName', chatName)
        setTimeout(() => {
            window.location.href = '/chat'
        }, 1000)

    }

    return (
        <div className="chats">
            {typeof(chats) !== 'undefined' && chats.map(chat => {
                return (
                <div className="chat" key={`chat-${chat.name}`} onClick={() => {
                    openChat(chat.name)
                }}>
                    <div className="ctr-infoUser" key={`ctr_info_user-${chat.name}`}>
                        <div className="ctr-picture" key={`picture-${chat.name}`}>
                            <img 
                                key={`picture_user-${chat.name}`} 
                                src={imagePerfil} 
                                className="picture"
                                alt={`foto de perfil do usuário ${chat.name}`}
                            />
                        </div>
            
                        <div key={`info_user-${chat.name}`} className="infoUser">
                            <p key={`name_user-${chat.name}`}>{chat.name}</p>
                            <p key={`message-${chat.name}`} className="body-small msg">{chat.message.text}</p>
                        </div>
                    </div>  
            
                    <div className="ctr-infoChat" key={`ctr_info_chat-${chat.name}`}>
                        <span key={`date_message-${chat.name}`} className="caption-small">
                            {chat.message.date}
                        </span>
            
                        <div key={`info_chat-${chat.name}`} className="infoChat">               
                            <img key={`openChat-${chat.name}`} src={iconOpen} className="openChat" alt="abrir o chat" />
                        </div>
                    </div>
                </div>
                )
            })}
        </div>
    )
}