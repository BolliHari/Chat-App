import express from 'express';
import http from 'http';
import cors from 'cors';
import "dotenv/config";
import { connectDB } from './lib/db.js';
import userRoutes from './controllers/routes/userRoutes.js';
import messageRouter from './controllers/routes/messageRoutes.js';
import { Server } from 'socket.io';
import { ifError } from 'assert';

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

export const usersSocketMap = {};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("New client connected: " + userId);

    if (userId) {
        usersSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(usersSocketMap));

    socket.on("disconnect", () => {
        console.log("Client disconnected: " + userId);
        delete usersSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(usersSocketMap));
    });
})

app.use(cors());
app.use(express.json({limit: "4mb"}));

const PORT = process.env.PORT || 5000;

app.use('/api/status', (req, res) => {
    res.send("Server is running");
});
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRouter);

await connectDB();


if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}


export default server