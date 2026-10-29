import { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import vault from '../assets/vault.png';

function Register(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();


    }

    return(
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-8">

            <div className="flex flex-col items-center text-center gap-2">
                <img
                    className="w-16 h-16"
                    src={vault}
                    alt="VaultBox logo"
                />

                <h1 className="text-2xl font-semibold">
                    Create your account
                </h1>

                <p className="text-sm text-gray-400">
                    Your files, all in one place.
                </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                        Email address
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 outline-none focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        minLength={8}
                        required
                        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 outline-none focus:border-blue-500"
                    />
                </div>

                {error && (
                    <p role="alert" className="text-sm text-red-400">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className=" cursor-pointer w-full rounded-lg bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? 'Creating account...' : 'Create account'}
                </button>
            </form>

            <p className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="font-medium text-blue-400 hover:text-blue-300"
                >
                    Log in
                </Link>
            </p>
        </div>
    </div>
    );
}

export default Register;