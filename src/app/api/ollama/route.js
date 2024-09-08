import { NextResponse } from 'next/server';
import ollama from 'ollama';
import prisma from '@/utils/connect';
import { v4 as uuidv4 } from 'uuid'; // Add this import

const activeRequests = new Map();

const SYSTEM_MESSAGE = `You are a mental well-being assistant dedicated to helping users manage stress and promote positive mental health. Provide supportive, compassionate, and evidence-based advice to help users navigate their emotions. Engage in a friendly and understanding manner, offering mindfulness exercises, breathing techniques, and personalized suggestions. Aim for thoughtful, encouraging responses that foster calm and well-being. your name is vibeflow. If possible, please keep your answers brief.`;

export async function POST(request) {
  const { message, sessionId } = await request.json();
  const requestId = uuidv4(); // Generate a unique requestId

  // Ensure messages is initialized as an array
  let messages = [];

  // If sessionId is provided, fetch existing messages
  if (sessionId) {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { messages: true },
    });
    if (session && session.messages) {
      messages = session.messages.map(msg => ({ role: msg.role, content: msg.content }));
    }
  }

  // Add the system message at the beginning of the conversation
  if (messages.length === 0) {
    messages.push({ role: 'system', content: SYSTEM_MESSAGE });
  }

  // Add the new user message
  messages.push({ role: 'user', content: message });

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  let chatSession;
  if (sessionId) {
    chatSession = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  } else {
    chatSession = await prisma.chatSession.create({
      data: { userId: 'anonymous' }, // Replace with actual user ID if you have authentication
    });
  }

  // Store user message
  await prisma.message.create({
    data: {
      chatSessionId: chatSession.id,
      role: 'user',
      content: message,
    },
  });

  const streamResponse = async () => {
    try {
      const response = await ollama.chat({
        model: 'llama3',
        messages: messages,
        stream: true,
      });

      activeRequests.set(requestId, { writer, response });

      let assistantMessage = '';

      for await (const part of response) {
        if (!activeRequests.has(requestId)) {
          assistantMessage += '\n\n[Response generation stopped]';
          break;
        }
        assistantMessage += part.message.content;
        await writer.write(encoder.encode(part.message.content));
      }

      // Store assistant message
      await prisma.message.create({
        data: {
          chatSessionId: chatSession.id,
          role: 'assistant',
          content: assistantMessage,
        },
      });
    } catch (error) {
      console.error('Error:', error);
      await writer.write(encoder.encode('An error occurred while processing your request.'));
    } finally {
      activeRequests.delete(requestId);
      await writer.close();
    }
  };

  streamResponse();

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
      'X-Request-ID': requestId,
      'X-Session-ID': chatSession.id,
    },
  });
}

export async function DELETE(request) {
  const requestId = request.headers.get('X-Request-ID');
  if (requestId && activeRequests.has(requestId)) {
    const { writer, response } = activeRequests.get(requestId);
    activeRequests.delete(requestId);
    await writer.write(new TextEncoder().encode('\n\n[Response generation stopped]'));
    await writer.close();
    // If ollama provides a method to cancel the stream, call it here
    // For example: await response.cancel();
  }
  return new NextResponse(null, { status: 204 });
}