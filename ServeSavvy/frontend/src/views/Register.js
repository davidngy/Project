import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function Register() {
    const [username, setUsername] = useState(''); //setUsername to update username
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const navigate = useNavigate();

    //handle submit
    const Submit = async (event) => 
    {
        event.preventDefault();
        if (password !== confirmation)
        {
            alert('Password are not the same!');
            return;
        }
    //set Data ready for backend
    const Data = {
        username: username,
        email,
        password1: password,
        password2: confirmation,
    };
    //send to backend
        try 
        {
            //send backend our Data
            const backend = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Data),
            });

            if(backend.ok)
            {
                console.log('User registered successfully');
                navigate('/login');
            }
            else
            {
                throw new Error('Registration failed');
            };


        }
        catch (error)
        {
            console.log(error);
        }
    };

    return(
        <div className='min-h-screen bg-gray-100'>
            <h2 className="text-2xl font-bold mb-4">Register</h2>

            <form className="space-y-6" onSubmit={Submit}>
                <div className="form-group">
                    <input
                        autoFocus
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        type="text"
                        placeholder="Resturant"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                    />
                </div>
                <input
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    value="Register"
                />
            </form>

            <div className="mt-4">
                Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-800">Log In here.</Link>
            </div>
        </div>
    );
}

export default Register;