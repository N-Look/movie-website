import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';


const SignUp = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup, isLoading, error } = useAuthStore();

    const handleSignUp = async (e) => {
        e.preventDefault();
        // Handle sign up logic here

        try {
            await signup(username, email, password);
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
            <h1 className='text-3xl font-medium text-white mb-7'>Sign Up</h1>

            <form onSubmit={handleSignUp} className='flex flex-col space-y-4'>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="John Doe" className="w-full h-[50px] bg-white/10 text-white rounded-2xl px-5 text-base border border-white/10 focus:border-purple-500 focus:bg-white/15 outline-none transition-all duration-300" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="johndoe@gmail.com" className="w-full h-[50px] bg-white/10 text-white rounded-2xl px-5 text-base border border-white/10 focus:border-purple-500 focus:bg-white/15 outline-none transition-all duration-300" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full h-[50px] bg-white/10 text-white rounded-2xl px-5 text-base border border-white/10 focus:border-purple-500 focus:bg-white/15 outline-none transition-all duration-300"/>

                {error && <p className='text-red-500'>{error}</p>}

                <button type='submit' disabled={isLoading} className='w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-2xl text-base font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] cursor-pointer transition-all duration-300'>
                    Sign Up
                </button>
            </form>

            <div  className='mt-10 text-[#737373] text-sm'>
                <p>Already have an account? <span onClick={() => navigate('/signin')}
                className='text-white font-medium cursor-pointer ml-2 hover:underline'>Sign In Now</span></p>
            </div>


         </div>


    </div>
  )
  
}

export default SignUp