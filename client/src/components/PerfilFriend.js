import React, {useEffect, useState} from "react";
import imagePerfil from './assets/images/perfil.jpg'
import axios from "axios";
const host = process.env.REACT_APP_HOST_SERVER

export default function PerfilFriend () {
    const [chat, setChat] = useState()

    useEffect(() => {        
        axios.post(`${host}/getChat`, {
            // chatName: localStorage.getItem('chatName'),
            chatName: 'teste',
            userName: localStorage.getItem('userName')
        }).then((res) => {
            setChat(res.data)
            console.log(res)
            console.log(chat)
        }).catch((error) => console.log(error))
    }, [])

    const blockUser = () => {
        axios.post(`${host}/blockUser`, {
            userName: localStorage.getItem('userName'),
            userBlock: localStorage.getItem('chatName')
        }).then((res) => {

            console.log(res.data)
        }).catch((error) => console.log(error))
    }
    return (
    <div className="perfil">
        <img src={imagePerfil} className="picture-large" alt="foto de perfil do usuário"/>
        <p className="body-large">{localStorage.getItem('chatName')}</p>
        <p>online</p>

        <button 
            className="block"
            onClick={() => {blockUser()}}
        >Bloquear usuário</button>
    </div>
    )
}