import React, { useEffect, useState } from "react";
import axios from 'axios'
import imagePerfil from './assets/images/perfil.jpg'
import iconOpen from './assets/icons/open.svg'
const host = process.env.REACT_APP_HOST_SERVER
const hostClient = process.env.REACT_APP_HOST_CLIENT

export default function Chats () {
    const [chats, setChats] = useState()

    useEffect(() => {
        if (localStorage.getItem('userName') !== null) {
            axios.post(`${host}/getMyChats`, {
                userName: localStorage.getItem('userName')
            }).then((res) => {
                setChats(res.data)
            }).catch((error) => console.log(error))
        } else {
            window.location.href = `${hostClient}/signup`
        }
    },[])

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
                            {chat.online === true? 'online': 'offline'}
                        </span>
            
                        <div key={`info_chat-${chat.name}`} className="infoChat">
                            <div key={`ctr_message_count-${chat.name}`} className="ctr-messageCount">
                                <span key={`message_count-${chat.name}`} className="messageCount caption-small">2</span>
                            </div>
            
                            <img key={`openChat-${chat.name}`} src={iconOpen} className="openChat" alt="abrir o chat" />
                        </div>
                    </div>
                </div>
                )
            })}
        </div>
    )
}