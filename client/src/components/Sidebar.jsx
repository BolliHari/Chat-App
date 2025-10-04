import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {

  const { selectedUser, setSelectedUser, getUsers, users, unseenMessages, setUnseenMessage} = useContext(ChatContext);
  console.log(users)

  const navigate = useNavigate();

  const [input, setInput] = useState(false);

  const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users


  const {logout, onlineUsers} = useContext(AuthContext);

  useEffect(() => {
    getUsers();
  },[onlineUsers])
  return (
    <div className={`bg-[#8185B2]/10 p-5 h-full overflow-y-scroll rounded-r-xl text-white ${ selectedUser ? "" : ""}`}>
      <div className="mb-5">
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt="" className='max-w-40'/>
          <div className="relative py-2 group">
            <img src={assets.menu_icon} alt="" className='max-h-5 cursor-pointer'/>
            <div className="absolute top-full right-0 bg-[#282142] p-3 rounded-lg  w-30 group-hover:block hidden shadow-lg z-10">
              <p className='cursor-pointer text-sm' onClick={() => navigate('/profile')}>Edit Profile</p>
              <hr className='my-2 border-t border-[#4B4D6E]'/>
              <p onClick={() => logout()} className='text-sm cursor-pointer'>Logout</p>
            </div>
          </div>
        </div>
        <div className="flex items-center bg-[#4B4D6E]/60 rounded-full px-3 mt-4 gap-3 py-2">
          <img src={assets.search_icon} alt="" className='w-3'/>
          <input onChange={(e) => setInput(e.target.value)} type="text" className='bg-transparent text-white placeholder-[#c8c8c8] border-none outline-none text-sm flex-1' placeholder='Search User...' />
        </div>
      </div>
      {
        filteredUsers.map((user, index) => (
          <div onClick={() => {setSelectedUser(user); setUnseenMessage(prev => ({...prev,[user._id]:0}))}} key={index} className={`relative flex items-center gap-2 cursor-pointer hover:bg-[#4B4D6E]/60 p-2 pl-4 rounded max-sm:text-sm my-2 ${ selectedUser?._id === user._id && 'bg-[#4B4D6E]/60'}`}>
            <img src={user?.profilePic || assets.profilePic} alt="" className='w-[35px] rounded-full aspect-[1/1]'/>
            <div className="flex flex-col leading-5">
              <p className='text-sm font-semibold'>{user.fullName}</p>
              {
                onlineUsers.includes(user._id) ? <span className='text-green-400 text-xs'>Online</span> : <span className='text-neutral-400 text-xs'>Offline</span>
              }
            </div>
            {
              unseenMessages[user._id] && <p className='absolute top-4 right-4 w-5 h-5 rounded-full bg-purple-400 text-xs flex items-center justify-center'>{unseenMessages[user._id]}</p>
            }
          </div>
        ))
      }
    </div>
  )
}

export default Sidebar
