import React from "react"
import {Routes, Route, Navigate} from "react-router-dom"

import InnerContent from "./Components/InnerContent"

import Dashboard from "./Pages/Dashboard"
import Settings from "./Components/Settings"
import Login from "./Pages/Login"
import About from "./Pages/About"
import Register from "./Pages/Register"
import { User } from "./Components/User"
import { UserDetails } from "./Components/UserDetails"




const MainRoutes = () => (
	<Routes>
	    <Route path="/" element={<InnerContent />}>
			<Route path="/" element={<Navigate replace to="dashboard" />} />
				<Route path="dashboard" element={<Dashboard />} />
			<Route path="/" element={<Navigate replace to="login" />} />
				<Route path="login" element={<Login />} />
			<Route path="/" element={<Navigate replace to="register" />} />
				<Route path="register" element={<Register />} />
			<Route path="/" element={<Navigate replace to="about" />} />
				<Route path="about" element={<About />} />
				</Route>
				<Route path='user' element ={<User/>} />
				<Route path='user/:userId' element = {<UserDetails />} />
				<Route path = "settings" element={<Settings />} />
</Routes>
)

export default MainRoutes