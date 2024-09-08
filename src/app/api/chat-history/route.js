import { NextResponse } from 'next/server';
import prisma from '@/utils/connect';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";  // Update this line

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get the most recent chat session for the logged-in user
    const chatSession = await prisma.chatSession.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: { messages: true },
    });

    if (chatSession) {
      return NextResponse.json({
        sessionId: chatSession.id,
        messages: chatSession.messages.map(m => ({ role: m.role, content: m.content })),
      });
    } else {
      return NextResponse.json({ sessionId: null, messages: [] });
    }
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 });
  }
}