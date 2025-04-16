import { Server } from 'socket.io';
import { NextRequest } from 'next/server';
import prisma from '@/lib/db';

// Define the global socket type
declare global {
  var io: any;
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Check if the server is already running
  if (!global.io) {
    console.log('Socket server starting...');

    // Create a new Socket.IO server instance
    const io = new Server({
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    // Store the socket server in the global object
    global.io = io;

    // Handle socket connections
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle joining a chat room (individual or group)
      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Client ${socket.id} joined room: ${roomId}`);
      });

      // Handle new messages
      socket.on('send-message', async (message) => {
        try {
          // Save message to database
          const savedMessage = await prisma.message.create({
            data: {
              content: message.content,
              senderId: message.senderId,
              ...(message.groupChatId && { groupChatId: message.groupChatId }),
              ...(message.receiverId && { receiverId: message.receiverId }),
            },
            include: {
              sender: true,
            },
          });

          // Format the message to include sender info
          const formattedMessage = {
            ...savedMessage,
            senderName: savedMessage.sender.name,
          };

          // If it's a group message, emit to the group room
          if (message.groupChatId) {
            io.to(message.groupChatId).emit('new-message', formattedMessage);
          }
          // If it's a direct message, emit to both sender and receiver
          else if (message.receiverId) {
            io.to(message.receiverId).emit('new-message', formattedMessage);
            io.to(message.senderId).emit('new-message', formattedMessage);
          }
          // Fallback to broadcasting to all
          else {
            io.emit('new-message', formattedMessage);
          }
        } catch (error) {
          console.error('Error saving message:', error);
          socket.emit('error', { message: 'Failed to save message' });
        }
      });

      // Handle disconnections
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    // Start the socket server
    const PORT = process.env.SOCKET_PORT || 3001;
    io.listen(Number(PORT));
    console.log(`Socket server listening on port ${PORT}`);
  }

  return new Response('Socket.IO server is running', {
    status: 200,
  });
}