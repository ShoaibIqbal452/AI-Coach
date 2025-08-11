import { profileService } from './profileService';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  is_plan?: boolean;
  plan_type?: 'workout' | 'diet' | null;
}

export interface ChatResponse {
  message_id: string;
  response: string;
  timestamp: string;
}

export interface ChatHistoryResponse {
  messages: Message[];
}

export const chatService = {
  async sendMessage(token: string, content: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          role: 'user'
        }),
      });

      if (!response.ok) {
        throw new Error(`Error sending message: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in chat service:', error);
      throw error;
    }
  },

  async getChatHistory(token: string): Promise<Message[]> {
    try {
      const response = await fetch(`${API_URL}/chat/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error getting chat history: ${response.statusText}`);
      }

      const data: ChatHistoryResponse = await response.json();
      
      return data.messages.map(message => ({
        ...message,
        timestamp: new Date(message.timestamp)
      }));
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  },

  async markMessageAsPlan(token: string, messageId: string, planType: 'workout' | 'diet'): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/chat/message/${messageId}/mark-plan`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_plan: true,
          plan_type: planType
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error marking message as plan:', error);
      return false;
    }
  },

  async savePlanFromMessage(token: string, message: Message, planType: 'workout' | 'diet'): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: planType,
          content: message.content,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to save plan');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving plan from message:', error);
      throw error;
    }
  }
};
