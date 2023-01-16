import React from "react";
import { Routes, Route, Link } from 'react-router-dom'
import Index from './components/Index'
import Adm from './components/Adm'

export default function App () {
    return (
    <>
		<header>
			<h1>DevCity</h1>

			<nav>
				<Link to='/'>Home</Link>
				<Link to='/adm'>Adm</Link>
			</nav>
		</header>

		<main>
			<Routes>
				<Route path="/" element={<Index/>}></Route>
				<Route path="/adm" element={<Adm/>}></Route>
			</Routes>
		</main>
    </>
    )
}