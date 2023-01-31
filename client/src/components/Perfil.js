import React from "react";
import imagePerfil from './assets/images/perfil.jpg'


export default function Perfil () {
    return (
    <div className="perfil">
        <img src={imagePerfil} className="picture-large" alt="minha foto de perfil"/>
        <p className="body-large">{localStorage.getItem('userName')}</p>

        <button 
            className="addUser"
            onClick={() => {document.querySelector('.modal-addUser').classList.remove('close')}}
        >Adicionar amigo</button>
    </div>
    )
}