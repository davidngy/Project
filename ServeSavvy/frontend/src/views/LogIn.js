import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const submit = async (event) =>
    {
        event.preventDefault();
        //send backend our Data
        const backend = await fetch('http://localhost:8000/api/login/', {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });
        if(backend.ok)
        {
            const { token, userId } = await backend.json(); //Token und userId werden zurückgegeben
            localStorage.setItem('token', token); // Speichert das Token im Local Storage
            localStorage.setItem('userId', userId); // Speichert die Benutzer-ID
            console.log('Login erfolgreich');
            navigate('/'); 
        }
        else if(!backend.ok)
        {
            alert("resturant name or password is wrong!");
        }
    };

    return (
        <div className='min-h-screen bg-gray-100'>
        <h2 className="text-2xl font-bold mb-4">Log In</h2>
        <form onSubmit={submit} className="space-y-6" >
            <div className='form-group'>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                name="username"
                placeholder="Resturant"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            </div>
            <div className='form-group'>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            </div>
            
            <input
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    value="Login"
            />
            
        </form>

        <div className="mt-4">
            No account yet? <Link to="/register" className="text-blue-500 hover:text-blue-800">Register In here.</Link>
        </div>
        </div>
    );
}

export default Login;
