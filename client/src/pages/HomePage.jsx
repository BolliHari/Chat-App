import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatCaintainer from '../components/ChatCaintainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext);


  return (
    <div className='w-full h-screen px-[15%] py-[5%]'>
      <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${ selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
        <Sidebar />
        <ChatCaintainer />
        <RightSidebar />
      </div>
    </div>
  )
}

export default HomePage
