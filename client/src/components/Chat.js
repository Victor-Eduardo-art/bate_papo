import React, { useEffect, useState } from "react";
import iconOpen from './assets/icons/open.svg'
import sendMessage from './assets/icons/iconSend.svg'
import iconEmoji from './assets/icons/iconEmoji.svg'
import axios from 'axios'
import { io } from 'socket.io-client'
const socket = io(process.env.REACT_APP_HOST_SERVER)
const host = process.env.REACT_APP_HOST_SERVER

socket.emit('online', true)
socket.emit('getName', localStorage.getItem('userName'))

export default function Chat () {
    const [chat, setChat] = useState()
    const [messageText, setMessageText] = useState('')

    useEffect(() => {        
        axios.post(`${host}/getChat`, {
            chatName: localStorage.getItem('chatName'),
            userName: localStorage.getItem('userName')
        }).then((res) => {
            setChat(res.data)

            socket.on('getMessage', (message) => {
                if (typeof(message) !== 'undefined' && typeof(chat) !== 'undefined') {
                    if (message.message_to === localStorage.getItem('userName')) {
                        setChat({
                            message: {
                                text: message.text, 
                                date: message.date, 
                                user: message.message_from
                            },

                            history: [...chat.history, {
                                text: message.text, 
                                date: message.date, 
                                user: message.message_from
                            }]
                        })
                    }
                }
            })

            socket.on('getUserBlocked', (data) => {
                console.log(data)

                if (data.blockedUser === localStorage.getItem('userName')) {
                    console.log('vc foi bloqueado')
                    f_disableChat()
                }
            })

            socket.on('getNewsFriends', (data) => {
                console.log(data)
                
                if (data.userAdded === localStorage.getItem('userName'), () => {console.log('novo amigo!')}) {
                    openModal(`o usuário ${data.user} lhe adicionou como amigo!`)
                }
            })

        }).catch((error) => console.log(error))
    }, [])

    const openModal = (msg, funcNext) => {
        const ctrModal = document.querySelector('.ctr-modal')

        ctrModal.classList.remove('close')
        document.querySelector('.modal p').innerHTML = msg

        document.addEventListener('keydown', (key) => {
            key = key.key
            
            if (key === 'Enter' || key === 'Escape') {
                closeModal()
                funcNext()
            }
        })

        document.querySelector('.ctr-modal #buttonModalClose').addEventListener('click', () => {
            closeModal()
            funcNext()
        })
    }

    const closeModal = () => {
        document.querySelector('.ctr-modal').classList.add('close')
        document.querySelector('.ctr-modal button').focus()
    }

    const f_disableChat = () => {
        document.querySelector('.home .blur').classList.remove('none')

        setTimeout(() => {
            openModal('Este usuário acabou de lhe bloquear, não seja babaca....')
        }, 2000);

    }

    const f_sendMessage = () => {
        if (validate()) {
            axios.post(`${host}/sendMessage`, {
                message: messageText,
                chatName: localStorage.getItem('chatName'),
                userName: localStorage.getItem('userName'),
            }).then((data) => {
                const date = new Date()
                setMessageText('')
                setChat(data.data)

                socket.emit('sendMessage', {
                    message_to: localStorage.getItem('chatName'),
                    message_from: localStorage.getItem('userName'),
                    text: messageText,
                    date: date.toLocaleString()
                })

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
        if (e.value !== ' ') {
            setMessageText(e.value)
        }
    }

    const goTheEnd = (e) => {
        const scrollbar = document.querySelector('.messages')

        const tmp = setInterval(() => {
            if (scrollbar.scrollTop >= scrollbar.scrollHeight - 609) {
                e.preventDefault()
                clearInterval(tmp)
            } else {
                scrollbar.scrollTop = scrollbar.scrollTop + 25
            }
        }, 10)
    }

    const getMessages = (chat) => {
        return (
        <>
            {chat.history.map((message) => {
                if (message.user !== localStorage.getItem('userName')) {
                    return (
                    <div className="ctr-person-messages" key={`ctr-person-info${message.date + message.text}`}>
                        <div className="person-message" key={`person-message-${message.date + message.text}`}>
                            <p className="message body-small" key={`message-${message.date + message.text}`}>{message.text}</p>
                            <span className="date-message caption-small" key={`date-${message.date + message.text}`}>{message.date}</span>
                        </div>
                    </div>
                    )
                } else {
                    return (
                    <div className="ctr-your-messages" key={`ctr-your-info${message.date + message.text}`}>
                        <div className="your-message" key={`your-message-${message.date + message.text}`}>
                            <p className="message body-small" key={`message-${message.date + message.text}`}>{message.text}</p>
                            <span className="date-message caption-small" key={`date-${message.date + message.text}`}>{message.date}</span>
                        </div>
                    </div>
                    )
                }
            })}
            <div className="end"></div>
        </>
        )
        goTheEnd()
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

        <div className="messages" onMouseEnter={(e) => {goTheEnd(e)}}>
            {typeof(chat) !== 'undefined' && 
                getMessages(chat)
            }
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