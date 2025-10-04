import React, { useContext, useEffect, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatCaintainer = () => {

  const { messages, selectedUser, setSelectedUser, 
          getMessages, sendMessage} = useContext(ChatContext)

  const { authUser, onlineUsers } = useContext(AuthContext);


  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") {
      return null
    }
    await sendMessage({text : input.trim()})
    setInput("")
  }


  const handleSendImage = (e) => {
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("Select Image only");
      return
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({image : reader.result})
      e.target.value = ""
    }
    reader.readAsDataURL(file);
  }

  const scrollEnd = React.useRef(null);



  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  },[selectedUser])
  React.useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages])


  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      <div className='flex items-center gap-3 mx-4 py-3 border-b border-gray-600'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full'/>
        <p className='text-white font-semibold text-xl flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className="h-2 w-2 bg-green-500 rounded-full"></span>}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='max-w-7 md:hidden'/>
      </div>
      {/* chat container */}
      <div className="flex flex-col h-[calc(100%-120px)] p-3 pb-6 overflow-y-scroll">
        {
          messages.map((msg,index) => (
            <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
              {
                msg.image ? (
                  <img src={msg.image} alt="" className='max-w-[230px] rounded-lg overflow-hidden mb-8 border border-gray-700'/>
                ) : (
                  <p className={`p-2 max-w-[200px] bg-violet-500/50 text-white font-light rounded-lg break-all mb-8 max-md:text-sm ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
                )
              }
              <div className="text-center">
                 <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.profile_martin} alt="" className='w-7 rounded-full'/>  
                  <p className='text-xs text-gray-400 mt-1'>{new Date(msg.createdAt).toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit', hour12: false})}</p>
              </div>
            </div>
          ))
        }
        <div ref={scrollEnd}></div>
      </div>
      {/* bottom input */}
      <div className="absolute bottom-0 left-0 right-0 p-3 gap-3 flex items-center">
        <div className=" flex-1 flex items-center bg-gray-100/20 p-2 rounded-lg gap-3">
          <input onChange={(e) => setInput(e.target.value)} value={input} onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null} type="text" className='flex-1 border-none outline-0 rounded-lg text-white placeholder:text-gray-400' placeholder='Type your message...' />
          <input onChange={handleSendImage} type="file" id='image' accept='image/png image/jpeg' hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className='w-5 cursor-pointer'/>
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-9 mr-2 cursor-pointer'/>
      </div>
    </div>
  ) : (
    <div className='flex flex-col justify-center items-center gap-3 max-md:hidden bg-white/10'>
      <img src={assets.logo_icon} alt="" className='max-w-16' />
      <p className='text-white font-semibold'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatCaintainer
