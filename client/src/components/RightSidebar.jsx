import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import ChatCaintainer from './ChatCaintainer'
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const RightSidebar = () => {

  const {selectedUser, messages} = useContext(ChatContext);
  const {logout, onlineUsers} = useContext(AuthContext);
  const [msgImg, setMsgImg] = useState([])

  useEffect(() => {
      setMsgImg(
        messages.filter(msg => msg.image).map(msg => msg.image)
      )
  },[messages])

  return selectedUser && (
    <div className={`bg-[#8185B2]/10 overflow-y-scroll rounded-l-xl text-white relative ${selectedUser ? "max-md:hidden" : ""}`}>
        <div className=" flex flex-col items-center gap-2 pt-16 font-light text-xs mx-auto">
          <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full'/>
          <h1 className='text-lg flex items-center gap-2 font-medium mx-auto px-10'>
            {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 bg-green-500 rounded-full'></p>}
            {selectedUser.fullName}
            </h1>
          <p className='mx-auto px-10'>{selectedUser.bio}</p>
        </div>
        <hr className='border-[#ffffff50] my-4' />
        <div className="px-5 text-xs">
          <p>Media</p>
          <div className="mt-2 max-h-[200px] grid grid-cols-2 gap-3 rounded overflow-y-scroll opacity-80">
            {msgImg.map((url, index) => (
              <div key={index} onClick={() => window.open(url, '_blank')} className="cursor-pointer hover:opacity-100 transition-opacity">
                <img src={url} alt="" className="w-full h-full object-cover rounded" />
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 px-20 py-2 rounded-full text-white text-sm cursor-pointer'>
          Logout
        </button>
    </div>
  )
}

export default RightSidebar
