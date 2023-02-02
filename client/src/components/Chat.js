import React, { useEffect, useState } from "react";
import iconOpen from './assets/icons/open.svg'
import sendMessage from './assets/icons/iconSend.svg'
import iconEmoji from './assets/icons/iconEmoji.svg'
import axios from 'axios'
const host = process.env.REACT_APP_HOST_SERVER

export default function Chat () {
    const [chat, setChat] = useState()
    const [messageText, setMessageText] = useState('')

    useEffect(() => {        
        axios.post(`${host}/getChat`, {
            chatName: localStorage.getItem('chatName'),
            userName: localStorage.getItem('userName')
        }).then((res) => {
            setChat(res.data)
            console.log(res.data)
        }).catch((error) => console.log(error))
    }, [])

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

    const f_sendMessage = () => {
        if (validate()) {
            axios.post(`${host}/senMessage`, {
                message: messageText,
                chatName: localStorage.getItem('chatName'),
                userName: localStorage.getItem('userName'),
            }).then((data) => {
                setMessageText('')
                setChat([...chat, data.data])
            }).catch((error) => console.log(error))
        }
    }

    const validate = () => {
        let isValidate = true

        setMessageText(messageText.trim())

        const regexText = new RegExp(
            /^[a-zA-Z0-9$%#@/]$/
        )

        if (regexText.test(messageText)) {
            openModal(`Por favor não use careceres suspeitos na mensagem`)
            isValidate = false
        }

        if (messageText === '') {
            openModal(`Por favor escreva uma mensagem antes de enviar`)
            isValidate = false
        }

        return isValidate
    }

    const f_handleInputs = (e) => {
        if (e.value !== '' && e.value !== ' ') {
            setMessageText(e.value)
        }
    }

    const getMessages = (chat) => {
        console.log(chat)

        // if (indice === 0) {
        //     if (chatData.message.user === localStorage.getItem('userName')) {
        //         return (
        //         <>
        //             <div className="ctr-your-messages" key={`ctr-your-${chatData.message.date}`}>
        //                 {typeof(chatData) !== 'undefined' && chatData.map((message) => {
        //                     console.log(message)
        //                     if (message.user === localStorage.getItem('userName')) {
        //                         return (
        //                         <div className="your-message" key={`your-message-${message.date + message.text}`}>
        //                             <p className="message body-small" key={`message-${message.date + message.text}`}>{message.text}</p>
        //                             <span className="date-message caption-small" key={`date-${message.date + message.text}`}>{message.date}</span>
        //                         </div>
        //                         )
        //                     }
        //                 })}
        //             </div>

        //             <div className="ctr-person-messages" key={`ctr-person-${chatData.message.date}`}>
        //                 {typeof(chat) !== 'undefined' && chat.map((chatData) => {
        //                     if (chatData.message.user !== localStorage.getItem('userName')) {
        //                         return (
        //                         <div className="person-message" key={`person-message-${chat.message.date + chat.message.text}`}>
        //                             <p className="message body-small" key={`message-${message.date + message.text}`}>{message.text}</p>
        //                             <span className="date-message caption-small" key={`date-${message.date + message.text}`}>{message.date}</span>
        //                         </div>
        //                         )
        //                     }
        //                 })}
        //             </div>
        //         </>
        //         )
        //     } else {
        //         return (
        //         <>

        //         </>
        //         )
        //     }
        // }
    }

    return (
    <div className="currentlyOpenChat">
        <div className="header">
            <button className="buttonClose" onClick={() => {
                document.querySelector('main').classList.add('opacity-0')

                setTimeout(() => {
                    window.location.href = '/'
                }, 1000)
            }}><img src={iconOpen} alt="ícone voltar"/></button>
        </div>

        <div className="messages">
            {typeof(chat) !== 'undefined' && 
                getMessages(chat)
            })
        </div>

        <div className="entrance-area">
            <button className="button-emoji"><img src={iconEmoji} alt='ícone emoji'/></button>
            <input 
                type='text' 
                className="input-message" 
                placeholder="escreva sua mensagem aqui"
                value={messageText}
                onChange={(e) => {f_handleInputs(e.target)}}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        f_sendMessage()
                    }
                }}
            />
            <button className="send-message" onClick={() => {f_sendMessage()}}><img src={sendMessage} alt="botão enviar message"></img></button>
        </div>
    </div>
    )
}