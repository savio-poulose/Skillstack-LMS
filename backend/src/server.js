require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const app = require("./app.js");
const connectDB = require("./config/db.js");
const Message = require("./models/message.model");

const PORT = process.env.PORT || 5000;

connectDB();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// ─── Socket.IO JWT auth middleware ────────────────────────────────────────────
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

// ─── Connection handler ───────────────────────────────────────────────────────
io.on("connection", (socket) => {
  // Each user joins their own private room named by their userId
  socket.join(socket.userId);
  console.log(`Socket connected: user=${socket.userId}`);

  // ── Send message ──────────────────────────────────────────────────────────
  socket.on("sendMessage", async ({ receiverId, content }) => {
    try {
      if (!receiverId || !content?.trim()) return;

      const message = await Message.create({
        sender: socket.userId,
        receiver: receiverId,
        content: content.trim(),
      });

      const payload = {
        _id: message._id,
        sender: socket.userId,
        receiver: receiverId,
        content: message.content,
        read: false,
        createdAt: message.createdAt,
      };

      // Deliver to receiver's room (if online)
      io.to(receiverId).emit("newMessage", payload);
      // Echo back to sender
      socket.emit("newMessage", payload);
    } catch (err) {
      console.error("sendMessage socket error:", err);
    }
  });

  // ── Mark messages read (notify sender their msgs were read) ───────────────
  socket.on("markRead", async ({ senderId }) => {
    try {
      await Message.updateMany(
        { sender: senderId, receiver: socket.userId, read: false },
        { $set: { read: true } }
      );
      // Notify sender that messages are read
      io.to(senderId).emit("messagesRead", { by: socket.userId });
    } catch (err) {
      console.error("markRead socket error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: user=${socket.userId}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
