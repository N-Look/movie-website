import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, isLoading, error} = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Handle sign in logic here
        try {
            const {message} = await login(email, password);
            toast.success(message);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

return (
    <div 
    className='min-h-screen bg-cover bg-center bg-no-repeat px-4 md:px-8 py-5'
    style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/background_banner.jpg)",
    }}>
         <div className='max-w-[450px] w-full bg-black/70 backdrop-blur-2xl rounded-3xl px-8 py-14 mx-auto mt-8 border border-white/10 shadow-2xl'>
            <h1 className='text-3xl font-medium text-white mb-7'>Sign In</h1>

            <form onSubmit={handleLogin} className='flex flex-col space-y-4'>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full h-[50px] bg-[#333] text-white rounded px-5 text-base" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full h-[50px] bg-[#333] text-white rounded px-5 text-base"/>

                {error && <p className='text-red-500'>{error}</p>}

                <button type='submit' disabled={isLoading} className='w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-2xl text-base font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] cursor-pointer transition-all duration-300'>
                    Sign In
                </button>
            </form>

            <div  className='mt-10 text-[#737373] text-sm'>
                <p>New to Nflix? <span onClick={() => navigate('/signup')}
                className='text-white font-medium cursor-pointer ml-2 hover:underline'>Sign Up Now</span></p>
            </div>


         </div>


    </div>
  )
}

export default SignIn