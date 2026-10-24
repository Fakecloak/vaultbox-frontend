import vault  from '../assets/vault.png'
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogIn = async (e) => {
        e.preventDefault();
        setError('');
    try {
        const url = "http://localhost:3000/api/auth/login";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.log(data.error);
            setError(data.error || 'Login Failed');
            return;
        }

        // console.log(data.token);
        setError('');
        localStorage.setItem('token', data.token);
    } catch (error) {
        console.error("Login failed:", error);
    }
};

    return(
        <div className="bg-black  text-white min-h-screen flex items-center justify-center px-4">
            <div className='w-full max-w-md space-y-6'>
                <div className='flex flex-col justify-center items-center'>

                    <div className=''>
                        <img className='w-16 h-16' src={vault} alt="Logo"/>
                    </div>
                    <div className='text-xl text-white'>VaultBox</div>
                    <div className='text-sm text-white'>Your files, all in one place.</div>
                </div>

                <div className='text-lg space-y-2'>
                    <div className=''> 
                        <label for="">Email address</label> 
                        <input value= {email} onChange={(e)=> setEmail(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 outline-none focus:border-blue-500" type="email" placeholder='you@example.com' />
                    </div>

                    <div className=''>
                        <label for="" >Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 outline-none focus:border-blue-500" type="password" placeholder='Enter your password'/>
                    </div>

                    {error && (
                        <p className='text-sm text-red-500'>
                            {error}
                        </p>
                    )}
                    <form onClick={handleLogIn}>
                    <button type="submit" className='text-center w-full bg-blue-500 rounded-2xl font-medium' >Sign in </button>
                    </form>

                    <p className="text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-medium text-blue-400 hover:text-blue-300"
                        >
                            Create account
                        </Link>
                    </p>

                </div>

            </div>
        </div>

       
    );
}

export default Login;