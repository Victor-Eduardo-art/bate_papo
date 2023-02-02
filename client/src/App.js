import React from "react";
import { Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { io } from 'socket.io-client'

const socket = io(process.env.REACT_APP_HOST_SERVER)
const hostClient = process.env.REACT_APP_HOST_CLIENT

export default function App () {
	const f_logoff = () => {
		localStorage.clear()
		window.location.href = '/signup'
	}

	const f_returnLinks = () => {
		if (window.location.href === `${hostClient}/signin` || window.location.href === `${hostClient}/signup`) {
			return (
				<>
					<Link to='/signin'>Sign-in</Link>
					<Link to='/signup'>Sign-up</Link>
				</>
			)
		} else {
			return (
				<button className="link" onClick={() => {f_logoff()}}>Sair</button>
			)
		}
	}
    return (
    <>
		<header>
			<div className="ctr-logo">
				<h1 className="text-shadow">Bate</h1>
				<h1 className="text-emphasis">Papo</h1>
			</div>

			<nav>
				{f_returnLinks()}
			</nav>
		</header>

		<main>
			<Routes>
				<Route path="/*" element={<Home/>}></Route>
				<Route path="/signin" element={<SignIn/>}></Route>
				<Route path="/signup" element={<SignUp/>}></Route>
			</Routes>
		</main>
    </>
    )
}