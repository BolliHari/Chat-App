import React, { useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = React.useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault(); 
    if(currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(currState === "Sign up" ? "signup" : "login" , { fullName, email, password, bio });

  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-6 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl '>
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />
      <form onSubmit={submitHandler} className='text-white flex flex-col gap-6  bg-white/10 p-6 rounded-lg border-2 border-gray-600'>
        <h2 className='text-2xl font-medium flex items-center justify-between'>
          {currState}
          {isDataSubmitted && <img src={assets.arrow_icon} alt=""  className='w-5 cursor-pointer'/>}
          </h2> 
        {currState === "Sign up" && !isDataSubmitted && (
          <input onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" required placeholder='Full Name' className='bg-transparent border-b border-gray-400 focus:border-white outline-none py-2 placeholder:text-gray-400'/>
        )}
        {
          !isDataSubmitted && (
            <>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email' className='bg-transparent border-b border-gray-400 outline-none py-2 focus:border-white placeholder:text-gray-400' required/>
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' className='bg-transparent border-b border-gray-400 outline-none py-2 focus:border-white placeholder:text-gray-400' required/>
            </>
          )
        }
        {currState === "Sign up" && isDataSubmitted && (
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder='Bio' rows={4} className='bg-transparent border-b border-gray-400 focus:border-white outline-none py-2 placeholder:text-gray-400 resize-none' required/>
        )}

        <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 px-20 py-2 rounded-full text-white text-sm cursor-pointer'>
          {currState === "Sign up" ? "Create Account" : "Login"}
        </button>

        <div className="text-sm text-gray-400 flex items-center gap-1 cursor-pointer">
          <input type="checkbox" className='cursor-pointer' />
          <p>Accept Terms and Conditions</p>
        </div>
        <div className="flex flex-col gap-2">
          {
            currState === "Sign up" ? (
              <p className='text-sm text-gray-600'>Already have an account? <span onClick={() => {setCurrState("Login"); setIsDataSubmitted(false)}} className='text-white cursor-pointer'>Login</span></p>
            ):
            (
              <p className='text-sm text-gray-600'>Don't have an account? <span onClick={() => {setCurrState("Sign up"); setIsDataSubmitted(false)}} className='text-white cursor-pointer'>Sign up</span></p>
            )
          }
        </div>
      </form>
    </div>
  )
}

export default LoginPage
