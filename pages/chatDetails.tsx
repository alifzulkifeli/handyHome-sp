'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Message = {
  id: number
  text: string
  sender: 'user' | 'bot'
}

export default function ChatDetails() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'bot' },
    { id: 2, text: "Hi! I'm having trouble with my account.", sender: 'user' },
    { id: 3, text: "I'm sorry to hear that. Can you please provide more details about the issue you're experiencing?", sender: 'bot' },
    { id: 4, text: "I can't seem to log in. It says my password is incorrect, but I'm sure it's right.", sender: 'user' },
    { id: 5, text: "I understand. Let's try to resolve this. Have you tried resetting your password?", sender: 'bot' },
    { id: 6, text: "No, I haven't. How do I do that?", sender: 'user' },
    { id: 7, text: "To reset your password, please follow these steps:\n1. Go to the login page\n2. Click on 'Forgot Password'\n3. Enter your email address\n4. Follow the instructions sent to your email", sender: 'bot' },
    { id: 8, text: "Okay, I'll try that. Thanks!", sender: 'user' },
    { id: 9, text: "You're welcome! Let me know if you need any further assistance.", sender: 'bot' },
  ])
  const [newMessage, setNewMessage] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const userMessage: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
      }
      setMessages([...messages, userMessage])
      
      // Simulate bot response with varied replies
      setTimeout(() => {
        const botReplies = [
          "Thank you for your message. Is there anything else I can help you with?",
          "I understand. Could you please provide more information about that?",
          "That's interesting. Let me look into that for you.",
          "I see. Have you tried any troubleshooting steps so far?",
          "Got it. Is there any other aspect of this issue you'd like to discuss?",
        ]
        const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)]
        const botMessage: Message = {
          id: messages.length + 2,
          text: randomReply,
          sender: 'bot',
        }
        setMessages(prevMessages => [...prevMessages, botMessage])
      }, 1000)

      setNewMessage('')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="bg-primary p-4 shadow-md">
        <h2 className="text-2xl font-bold text-primary-foreground">Customer Support Chat</h2>
      </div>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="max-w-2xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              } mb-4`}
              ref={index === messages.length - 1 ? lastMessageRef : null}
            >
              <div
                className={`flex items-start max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{message.sender === 'user' ? 'U' : 'CS'}</AvatarFallback>
                  <AvatarImage src={message.sender === 'user' ? '/user-avatar.png' : '/support-avatar.png'} />
                </Avatar>
                <div
                  className={`mx-2 p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {message.text.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 bg-background border-t">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex space-x-2"
          >
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}