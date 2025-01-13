import BackHome from "@/components/backHome"
import Page from "@/components/page"
import Section from "@/components/section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { pb } from "@/lib/pb"
import { useRouter } from "next/router"
import { use, useEffect, useState } from "react"

type Message = {
  id: string
  name: string
  avatar: string
  lastMessage: string | undefined
  senderId: string
  recipientId: string
  message_text?: string

}

export default function Chat() {
  const [userId, setUserId] = useState<any>(0)
  const [messages, setMessages] = useState<Message[]>([])
  type RecordModel = {
    id: string;
    avatar?: string;
    collectionId: string;
    name: string;
  };
  const [user, setUser] = useState< any>(null)

  const [otherUserData, setOtherUserData] = useState<(any | Message | RecordModel)[]>([])




  useEffect(() => {
    let messageList: Message[] = []
    let otherUser: [] = [];
    const fetchMessages = async () => {
      try {
        let user: { id: string    } | null = null;
        const userStorage = localStorage.getItem('sp');
        if (userStorage) {
          user = JSON.parse(userStorage);
          setUser(user);
        } else {
          console.log('No user found in localStorage');
          return;
        }

        
        

        if (!user) {
          console.log('User is null');
          return;
        }

        console.log(user.id);
        
        const fetchedMessages = await pb.collection('Messages').getFullList<Message>({
            filter: `(senderId="${user.id}"  || recipientId="${user.id}")`,
            sort: '-created',
        })

        console.log(fetchedMessages);
        

        for (let i = 0; i < fetchedMessages.length; i++) {
          const message = fetchedMessages[i];
          let otherUser: string[] = [];
          console.log(message.senderId);
          console.log(message.recipientId);

          if (message.senderId === user.id && !messageList.find(m => m.name === message.recipientId)) {
            otherUser.push(message.recipientId);
             messageList.push({
              id: message.id,
              name: message.recipientId,
              avatar: "https://i.pravatar.cc/300",
              lastMessage: "You: " + message.message_text,
              senderId: message.senderId,
              recipientId: message.recipientId,
            })

          } else if (message.recipientId === user.id && !messageList.find(m => m.name === message.senderId)) {
            otherUser.push(message.senderId);
            messageList.push({
              id: message.id,
              name: message.senderId,
              avatar: "https://i.pravatar.cc/300",
              lastMessage: message.message_text,
              senderId: message.senderId,
              recipientId: message.recipientId,
            })
          } else
          {
            // otherUser = await pb.collection('users').get(message.senderId);
          }

          
        }
        setMessages(messageList)
        console.log(messageList);
        
        
        for (let i = 0; i < messageList.length; i++) {

          const sp = await pb.collection('Users').getOne(messageList[i].name);
          console.log(sp);
          

          console.log(sp);
          setOtherUserData((prevData) => [...prevData, sp]);
        }

      }
      catch (error) {
        console.log('Error fetching user:', error)
      }

    }
    fetchMessages()
    console.log(otherUserData);
    
  }, [userId])

  const router = useRouter();
  return (
    <Page padding={0} >
      <Section>
        {user && otherUserData.length > 0 ? (
          <div className="h-full bg-background text-foreground w-full">
          <ScrollArea className="h-full">
            <div className="p-1 space-y-1">
              {messages.map((message, index) => (
                <Card key={message.id} className="hover:bg-accent transition-colors" onClick={() => router.push('/chat/' + message.name)} >
                  <CardContent className="p-4 flex items-center space-x-4">
                    <Avatar>
                      {/* <AvatarImage src={message.avatar} alt={message.name} /> */}
                      {/* <AvatarFallback>{message.name.split(' ').map(n => n[0]).join('')}</AvatarFallback> */}
                      {
                        otherUserData[index] && 'collectionId' in otherUserData[index] && otherUserData[index].avatar ? <AvatarImage src={`https://pb.alifz.xyz/api/files/${otherUserData[index].collectionId}/${otherUserData[index].id}/${otherUserData[index].avatar}`} /> : <AvatarFallback>{message.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      }
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      {otherUserData[index] && 'name' in otherUserData[index] && otherUserData[index].avatar ? otherUserData[index].name : message.name}
                      <p className="text-sm text-muted-foreground truncate">{message.lastMessage}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
        ) : (
          <BackHome />
        )}
      </Section>
    </Page>
  )
}