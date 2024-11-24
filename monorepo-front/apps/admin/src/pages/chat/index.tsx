import { useEffect, useState } from 'react';
import { ArrowLeft, SendHorizontal, X } from 'lucide-react';
import { Button } from '@common/components/ui/button';
import { Textarea } from '@common/components/ui/textarea';
import { getAiInsight } from '@common/api/chat';
import useUserStore from '@/store/useUserStore';
import { useLocation } from 'wouter';
interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

const ChatPage = () => {
  const { userProfile } = useUserStore();
  const [location, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialPromptSent, setInitialPromptSent] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const initialPrompt = params.get('prompt');

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      isUser: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAiInsight(
        userProfile?.id as string,
        textToSend
      );
      console.log('response', response);

      const aiResponse: Message = {
        id: Date.now().toString(),
        content: response.data.answer,
        isUser: false,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  if (initialPrompt && !initialPromptSent) {
    handleSendMessage(initialPrompt);
    setInitialPromptSent(true);
  }

  return (
    <div className='flex flex-col h-screen bg-brandgradient'>
      {/* Headr */}
      <div className='p-4 border-b bg-white/50 backdrop-blur-sm justify-between flex'>
        <h1 className='text-xl font-medium text-neutral-800'>Chat con IA</h1>
        <Button
          onClick={() => setLocation('/profile')}
          size='icon'
          variant='ghost'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.isUser
                  ? 'bg-gradient-to-br from-[rgb(251,205,156)] from-30% via-[#ebb6ec] to-[#b0bbec] text-neutral-800'
                  : 'bg-white text-neutral-700'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className='flex justify-start'>
            <div className='bg-white text-neutral-400 max-w-[80%] p-3 rounded-2xl'>
              Escribiendo...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className='p-4 border-t bg-white/50 backdrop-blur-sm pb-20'>
        <div className='flex gap-2 max-w-3xl mx-auto'>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Escribe tu mensaje...'
            className='resize-none bg-white/80'
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={() => handleSendMessage(input)}
            disabled={isLoading || !input.trim()}
            size='icon'
            className='bg-gradient-to-br from-[rgb(251,205,156)] from-30% via-[#ebb6ec] to-[#b0bbec] text-neutral-800 hover:opacity-90'
          >
            <SendHorizontal className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
