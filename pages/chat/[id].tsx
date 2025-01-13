'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useParams } from 'next/navigation'
import Page from '@/components/page'
import Section from '@/components/section'
import { pb } from '@/lib/pb' // Replace with your PocketBase import
import BackHome from '@/components/backHome'
import { useRouter } from 'next/router'

type Message = {
    id: string
    message_text: string
    senderId: string
    recipientId: string
    timestamp: string
}

export default function ChatDetails() {
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const lastMessageRef = useRef<HTMLDivElement>(null)
    const [user, setUser] = useState<any>(null)
    const [otherUserData, setOtherUserData] = useState<any>([])
    const [userId, setUserId] = useState<any>(null)
    const [sp, setSp] = useState<any>(null)
    const [otherUserAvatar, setOtherUserAvatar] = useState<any>(null)

    const params = useParams()
    const userChatname: any = params?.id ?? 'Chat' // Recipient ID

    const scrollToBottom = () => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'instant' })
        
    }

    const router = useRouter()

    // Initialize user data
    useEffect(() => {
        const initializeUser = async () => {
            try {
                const userStorage = localStorage.getItem('pocketbase_auth')
                const spf = localStorage.getItem('sp')
                
                if (!userStorage) {
                    console.log('No user found in localStorage')
                    return
                }

                const user = JSON.parse(userStorage)
                const sps = spf ? JSON.parse(spf) : null
                
                setSp(sps)
                setUser(user)
                setUserId(sps ? sps.id : user.id)
            } catch (error) {
                console.error('Error initializing user:', error)
            }
        }

        initializeUser()
    }, [])

    // Fetch messages and set up subscription
    useEffect(() => {
        const fetchMessagesAndSubscribe = async () => {
            if (!userId || userChatname === 'Chat') return

            try {
                // Fetch other user's data
                if (sp) {
                    const spv = await pb.collection('ServiceProviders').getOne(sp.id)
                    setOtherUserData(sp)
                } else {
                    const otherUser = await pb.collection('Users').getOne(userChatname)
                    
                    setOtherUserData(otherUser)
                }

                // Fetch initial messages
                const fetchedMessages = await pb.collection('Messages').getFullList<Message>({
                    filter: `(senderId="${userId}" && recipientId="${userChatname}") || (senderId="${userChatname}" && recipientId="${userId}")`,
                    sort: 'created',
                })
                setMessages(fetchedMessages)

                const otherUser = await pb.collection('Users').getOne(userChatname)
                setOtherUserAvatar(otherUser)

                setTimeout(scrollToBottom, 100)


       
            } catch (error) {
                console.error('Error fetching messages:', error)
            }
        }

        fetchMessagesAndSubscribe()

    
    }, [userId, userChatname])

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;


        const messageData: Partial<Message> = {
            message_text: newMessage,
            senderId: userId,
            recipientId: userChatname,
            timestamp: new Date().toISOString(),
        };

        try {
            const savedMessage = await pb.collection('Messages').create(messageData);

            setNewMessage(''); // Clear the input field
            scrollToBottom(); // Ensure scroll to the latest message
        } catch (error) {
            console.log('Error sending message:', error);
        }
    };



    useEffect(() => {
        if (!userId || userChatname === 'Chat') return;

        const subscribeToMessages = async () => {
            try {
                // Subscribe to new messages
                pb.collection('Messages').subscribe('*', function (e) {
                    if (e.action === 'create') {
                        const newMessage = e.record;

                        // Check if the new message belongs to the current chat
                        if (
                            (newMessage.senderId === userId && newMessage.recipientId === userChatname) ||
                            (newMessage.senderId === userChatname && newMessage.recipientId === userId)
                        ) {
                            setMessages((prevMessages) => {

                                // log the message object
                                console.log(newMessage);
                                console.log(prevMessages);

                                console.log(otherUserData);
                                console.log(user.model.id);
                                console.log(newMessage.senderId);
                                console.log(newMessage.recipientId);
                                

                                // Avoid duplicate messages by checking for existing IDs
                                if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
                                    return [...prevMessages, newMessage];
                                }
                                setTimeout(scrollToBottom, 100)
                                return prevMessages;
                            });
                            scrollToBottom(); // Ensure scroll to latest message
                        }
                    }
                    console.log(e.action);
                    console.log(e.record);
                }, { /* other options like expand, custom headers, etc. */ });
            } catch (error) {
                console.log('Error subscribing to messages:', error);
            }
        };

        subscribeToMessages();
    }, [userId, userChatname]); // Dependencies to reinitialize subscription


    return (
        <div className="-mb-16">
            <Page padding={0} nav={false} fromChat={true} >
                <Section>
                    {user && otherUserData && otherUserAvatar ?
                    <div className="flex flex-col bg-background">
                    <ScrollArea className="flex-grow p-3 min-h-[80vh]" ref={scrollAreaRef}>
                        <div className="mx-auto">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'} mb-2`}
                                    ref={index === messages.length - 1 ? lastMessageRef : null}
                                >
                                    <div
                                        className={`flex items-start max-w-[80%] ${message.senderId === userId ? 'flex-row-reverse' : 'flex-row'}`}
                                    >
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback>
                                                {message.senderId === userId ?
                                                    'U'
                                                    : 'R'}
                                            </AvatarFallback>
                                            <AvatarImage
                                                src={
                                                    message.senderId === userId
                                                        ? `https://pb.alifz.xyz/api/files/_pb_users_auth_/${user.model.id}/${user.model.avatar}`
                                                        : `https://pb.alifz.xyz/api/files/_pb_users_auth_/${otherUserAvatar.id}/${otherUserAvatar.avatar}`
                                                }
                                            />
                                        </Avatar>
                                        <div
                                            className={`mx-2 p-2 rounded-lg ${message.senderId === userId
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-secondary-foreground'
                                                }`}
                                        >
                                            {message.message_text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <footer className="p-4 bg-white z-10 sticky bottom-0 left-0 border-t w-full opacity-100 p-4">
                        <div className="max-w-2xl mx-auto">
                            <div

                                className="flex space-x-2"
                            >
                                <Input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-grow  bg-white "
                                />
                                <Button type="submit" size="icon" onMouseDown={(e) => {
                                    e.preventDefault()
                                    handleSendMessage()
                                }} >
                                    <Send className="h-4 w-4" />
                                    <span className="sr-only">Send</span>
                                </Button>
                            </div>
                        </div>
                    </footer>
                </div>
                : <BackHome /> }
                </Section>
            </Page>
        </div>
    )
}


// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { Send } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { useParams } from 'next/navigation'
// import Page from '@/components/page'
// import Section from '@/components/section'
// import { pb } from '@/lib/pb'
// import BackHome from '@/components/backHome'
// import { useRouter } from 'next/router'

// type Message = {
//     id: string
//     message_text: string
//     senderId: string
//     recipientId: string
//     timestamp: string
// }

// export default function ChatDetails() {
//     const [messages, setMessages] = useState<Message[]>([])
//     const [newMessage, setNewMessage] = useState('')
//     const scrollAreaRef = useRef<HTMLDivElement>(null)
//     const lastMessageRef = useRef<HTMLDivElement>(null)
//     const [user, setUser] = useState<any>(null)
//     const [otherUserData, setOtherUserData] = useState<any>(null)
//     const [userId, setUserId] = useState<string | null>(null)
//     const [sp, setSp] = useState<any>(null)
//     const unsubscribeRef = useRef<(() => void) | null>(null)

//     const params = useParams()
//     const userChatname: string = params?.id ?? 'Chat'

//     const scrollToBottom = () => {
//         lastMessageRef.current?.scrollIntoView({ behavior: 'instant' })
//     }

//     // Initialize user data
//     useEffect(() => {
//         const initializeUser = async () => {
//             try {
//                 const userStorage = localStorage.getItem('pocketbase_auth')
//                 const spf = localStorage.getItem('sp')
                
//                 if (!userStorage) {
//                     console.log('No user found in localStorage')
//                     return
//                 }

//                 const user = JSON.parse(userStorage)
//                 const sps = spf ? JSON.parse(spf) : null
                
//                 setSp(sps)
//                 setUser(user)
//                 setUserId(sps ? sps.id : user.id)
//             } catch (error) {
//                 console.error('Error initializing user:', error)
//             }
//         }

//         initializeUser()
//     }, [])

//     // Fetch messages and set up subscription
//     useEffect(() => {
//         const fetchMessagesAndSubscribe = async () => {
//             if (!userId || userChatname === 'Chat') return

//             try {
//                 // Fetch other user's data
//                 if (sp) {
//                     const spv = await pb.collection('ServiceProviders').getOne(sp.id)
//                     setOtherUserData(sp)
//                 } else {
//                     const otherUser = await pb.collection('Users').getOne(userChatname)
//                     setOtherUserData(otherUser)
//                 }

//                 // Fetch initial messages
//                 const fetchedMessages = await pb.collection('Messages').getFullList<Message>({
//                     filter: `(senderId="${userId}" && recipientId="${userChatname}") || (senderId="${userChatname}" && recipientId="${userId}")`,
//                     sort: 'created',
//                 })
//                 setMessages(fetchedMessages)

//                 // Set up subscription
//                 const unsubscribe = await pb.collection('Messages').subscribe('*', (e) => {
//                     if (e.action === 'create') {
//                         const newMessage = e.record
//                         if (
//                             (newMessage.senderId === userId && newMessage.recipientId === userChatname) ||
//                             (newMessage.senderId === userChatname && newMessage.recipientId === userId)
//                         ) {
//                             setMessages(prev => [...prev, newMessage])
//                             setTimeout(scrollToBottom, 100)
//                         }
//                     }
//                 })

//                 // Store unsubscribe function
//                 unsubscribeRef.current = unsubscribe
//             } catch (error) {
//                 console.error('Error fetching messages:', error)
//             }
//         }

//         fetchMessagesAndSubscribe()

//         // Cleanup subscription
//         return () => {
//             if (unsubscribeRef.current) {
//                 unsubscribeRef.current()
//                 unsubscribeRef.current = null
//             }
//         }
//     }, [userId, userChatname])

//     const handleSendMessage = async () => {
//         if (newMessage.trim() === '' || !userId) return

//         const messageData: Partial<Message> = {
//             message_text: newMessage,
//             senderId: userId,
//             recipientId: userChatname,
//             timestamp: new Date().toISOString(),
//         }

//         try {
//             await pb.collection('Messages').create(messageData)
//             setNewMessage('')
//         } catch (error) {
//             console.error('Error sending message:', error)
//         }
//     }

//     return (
//         <div className="-mb-16">
//             <Page padding={0} nav={false} fromChat={true}>
//                 <Section>
//                     {user && otherUserData ? (
//                         <div className="flex flex-col bg-background">
//                             <ScrollArea className="flex-grow p-3 min-h-[80vh]" ref={scrollAreaRef}>
//                                 <div className="mx-auto">
//                                     {messages.map((message, index) => (
//                                         <div
//                                             key={message.id}
//                                             className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'} mb-2`}
//                                             ref={index === messages.length - 1 ? lastMessageRef : null}
//                                         >
//                                             <div
//                                                 className={`flex items-start max-w-[80%] ${message.senderId === userId ? 'flex-row-reverse' : 'flex-row'}`}
//                                             >
//                                                 <Avatar className="w-8 h-8">
//                                                     <AvatarFallback>
//                                                         {message.senderId === userId ? 'U' : 'R'}
//                                                     </AvatarFallback>
//                                                     <AvatarImage
//                                                         src={
//                                                             message.senderId === userId
//                                                                 ? `https://pb.alifz.xyz/api/files/${otherUserData.collectionId}/${otherUserData.id}/${otherUserData.avatar}`: `https://pb.alifz.xyz/api/files/_pb_users_auth_/${user.id}/${user.avatar}`
                                                                
//                                                         }
//                                                     />
//                                                 </Avatar>
//                                                 <div
//                                                     className={`mx-2 p-2 rounded-lg ${
//                                                         message.senderId === userId
//                                                             ? 'bg-primary text-primary-foreground'
//                                                             : 'bg-secondary text-secondary-foreground'
//                                                     }`}
//                                                 >
//                                                     {message.message_text}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </ScrollArea>
//                             <footer className="p-4 bg-white z-10 sticky bottom-0 left-0 border-t w-full opacity-100">
//                                 <div className="max-w-2xl mx-auto">
//                                     <div className="flex space-x-2">
//                                         <Input
//                                             type="text"
//                                             placeholder="Type your message..."
//                                             value={newMessage}
//                                             onChange={(e) => setNewMessage(e.target.value)}
//                                             className="flex-grow bg-white"
//                                             onKeyPress={(e) => {
//                                                 if (e.key === 'Enter') {
//                                                     handleSendMessage()
//                                                 }
//                                             }}
//                                         />
//                                         <Button
//                                             type="submit"
//                                             size="icon"
//                                             onMouseDown={(e) => {
//                                                 e.preventDefault()
//                                                 handleSendMessage()
//                                             }}
//                                         >
//                                             <Send className="h-4 w-4" />
//                                             <span className="sr-only">Send</span>
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </footer>
//                         </div>
//                     ) : (
//                         <BackHome />
//                     )}
//                 </Section>
//             </Page>
//         </div>
//     )
// }