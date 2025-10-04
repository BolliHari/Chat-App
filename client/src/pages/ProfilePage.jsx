import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

  const { authUser, updateProfile } = useContext(AuthContext)
  
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [name, setName] = React.useState(authUser.fullName);
  const [bio, setBio] = React.useState(authUser.bio);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      await updateProfile({fullName : name, bio})
      navigate('/');
      return
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage)
    reader.onload = async () => {
      const base64img = reader.result;
      await updateProfile({profilePic : base64img, fullName : name, bio})
      navigate('/');
    }
  };

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center'>
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center max-sm:flex-col-reverse">
        <form className='flex flex-col gap-6 p-10 flex-1' onSubmit={handleSubmit}>
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-4 cursor-pointer'>
            <input onChange={(e) => setSelectedImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImage && "rounded-full"}`}/>
            upload profile image
          </label>
          <input type="text" placeholder='Your Name' value={name} onChange={(e) => setName(e.target.value)} className='p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 '/>
          <textarea placeholder='Your Bio' value={bio} onChange={(e) => setBio(e.target.value)} className='p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ' rows={4}></textarea>
          <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 p-2 rounded-full text-white text-lg cursor-pointer'>Save</button>
        </form>
        <img className={`max-w-44 mx-10 max-sm:mt-10 aspect-square rounded-full ${selectedImage && "rounded-full"}`} src={authUser?.profilePic || assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfilePage
