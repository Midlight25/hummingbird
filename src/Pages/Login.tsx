import React from 'react';
import { useNavigate } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';


const  Login=() =>{
	const navigate = useNavigate()

	//ADMIN
	//USER

	const login = () => {
		localStorage.setItem("user", JSON.stringify({role: "ADMIN"}))
		navigate("/dashboard")
	}

	return(
		<form className='login'>
			<h2>Let's start!</h2>
			<fieldset className='field-area'>
				<label htmlFor='email'>Email:</label>
				<input type = 'text ' id ='email' />
			</fieldset>
			<fieldset className='field-area'>
				<label htmlFor='password'>Password:</label>
				<input type = 'password ' id ='password' />
			</fieldset>
			<button type='submit'>Login</button>
		</form>
	);
}

export default Login;