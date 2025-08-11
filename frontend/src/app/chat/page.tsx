'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Box, Stack, Typography, Alert, Snackbar, CircularProgress } from '@mui/material';
import { chatService, Message as ChatMessage } from '@/services/chatService';

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [savingPlan, setSavingPlan] = useState(false);
  const [savePlanSuccess, setSavePlanSuccess] = useState<string | null>(null);
  const [savePlanError, setSavePlanError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/auth/login');
      return;
    }
    
    setToken(storedToken);
    
    const fetchChatHistory = async () => {
      try {
        setLoadingHistory(true);
        const chatHistory = await chatService.getChatHistory(storedToken);
        
        if (chatHistory.length > 0) {
          setMessages(chatHistory);
        } else {
          setMessages([
            {
              id: '1',
              role: 'assistant',
              content: 'Hello! I\'m your AI Gym Coach. How can I help you today? You can ask me about workout routines, diet plans, or fitness advice.',
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: 'Hello! I\'m your AI Gym Coach. How can I help you today? You can ask me about workout routines, diet plans, or fitness advice.',
            timestamp: new Date(),
          },
        ]);
      } finally {
        setLoadingHistory(false);
      }
    };
    
    fetchChatHistory();
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSaveAsPlan = async (message: ChatMessage, planType: 'workout' | 'diet') => {
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    setSavingPlan(true);
    setSavePlanSuccess(null);
    setSavePlanError(null);
    
    try {
      // Use chatService to save the plan
      await chatService.savePlanFromMessage(token, message, planType);
      
      // Mark the message as a saved plan
      const updatedMessages = messages.map(msg => 
        msg.id === message.id 
          ? { ...msg, is_plan: true, plan_type: planType } 
          : msg
      );
      
      setMessages(updatedMessages);
      
      // Update the message in the backend
      await chatService.markMessageAsPlan(token, message.id, planType);
      
      setSavePlanSuccess(`Successfully saved as ${planType} plan!`);
      
      setTimeout(() => {
        setSavePlanSuccess(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving plan:', error);
      setSavePlanError(error instanceof Error ? error.message : 'Failed to save plan');
      
      setTimeout(() => {
        setSavePlanError(null);
      }, 3000);
    } finally {
      setSavingPlan(false);
    }
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !token) return;
    
    const tempUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, tempUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const response = await chatService.sendMessage(token, inputMessage);
      
      const aiMessage: ChatMessage = {
        id: response.message_id,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(response.timestamp),
      };
      
      const updatedHistory = await chatService.getChatHistory(token);
      setMessages(updatedHistory);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <Snackbar 
        open={!!savePlanSuccess} 
        autoHideDuration={3000} 
        onClose={() => setSavePlanSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSavePlanSuccess(null)}>
          {savePlanSuccess}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!savePlanError} 
        autoHideDuration={3000} 
        onClose={() => setSavePlanError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setSavePlanError(null)}>
          {savePlanError}
        </Alert>
      </Snackbar>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 6rem)' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {loadingHistory ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={2} sx={{ maxWidth: '48rem', mx: 'auto' }}>
              {messages.map((message) => (
              <Box
                key={message.id}
                sx={{ 
                  display: 'flex', 
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <Card
                  sx={{
                    maxWidth: '80%',
                    bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
                    color: message.role === 'user' ? 'primary.contrastText' : 'text.primary'
                  }}
                >
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>{message.content}</Typography>
                    <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.7, display: 'block' }}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                    
                    {message.role === 'assistant' && (
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleSaveAsPlan(message, 'workout')}
                        >
                          Save as Workout Plan
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleSaveAsPlan(message, 'diet')}
                        >
                          Save as Diet Plan
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            ))}
            <Box ref={messagesEndRef} />
          </Stack>
          )}
        </Box>
        
        <Box sx={{ borderTop: 1, borderColor: 'divider', p: 2, bgcolor: 'background.paper' }}>
          <form onSubmit={handleSendMessage} style={{ maxWidth: '48rem', margin: '0 auto' }}>
            <Stack direction="row" spacing={1}>
              <Textarea
                sx={{ flexGrow: 1, resize: 'none' }}
                placeholder="Ask your AI coach a question..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                minRows={1}
              />
              <Button type="submit" isLoading={isLoading}>
                Send
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
    </MainLayout>
  );
}
