import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";



const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendURL, {
      query: { userId: userData._id },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      console.log(data)
      if (data.success) {
        setAuthUser(data.userData);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        connectSocket(data.userData);
        toast.success(data.message);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    setAuthUser(null);
    setToken(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    socket?.disconnect();
    setSocket(null);
    setOnlineUsers([]);
    toast.success("Logged out successfully");
  };

  const updateProfile = async (body) => {
    try {
      console.log(body)
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
        console.log(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuth();
    }
  }, [token]);


  const values = {
    axios,
    authUser,
    setAuthUser,
    onlineUsers,
    setOnlineUsers,
    socket,
    setSocket,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
};
