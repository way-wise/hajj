'use client'

import * as React from 'react'
import { Paperclip, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'

import type { Page, Inbox } from '@/payload-types'

interface Message {
    id: number
    subject?: string
    text: string
    sender: 'user' | 'other'
    attachment?: File
}

export default function Inbox() {
    const [messages, setMessages] = React.useState<Message[]>([
        { id: 1, text: "Hello! How can I help you today?", sender: 'other' },
    ])
    const [subject, setSubject] = React.useState('')
    const [newMessage, setNewMessage] = React.useState('')
    const [attachment, setAttachment] = React.useState<File | null>(null)
    const scrollAreaRef = React.useRef<HTMLDivElement>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (newMessage.trim() || attachment) {
            const userMessage: Message = {
                id: messages.length + 1,
                subject: subject,
                text: newMessage,
                sender: 'user',
                attachment: attachment || undefined
            }
            setMessages([...messages, userMessage])
            setNewMessage('')
            setSubject('')
            setAttachment(null)

            // Simulate a response (you'd replace this with actual API call in a real app)
            setTimeout(() => {
                const botMessage: Message = {
                    id: messages.length + 2,
                    text: "Thanks for your message. How else can I assist you?",
                    sender: 'other'
                }
                setMessages(prevMessages => [...prevMessages, botMessage])
            }, 1000)
        }
    }

    const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAttachment(file)
        }
    }

    React.useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [messages])

    const [inboxes, setInboxes] = React.useState([]);
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/inoxes`);
                // throw new Error('Network response was not ok');
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/inboxes`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setInboxes(result);
            }
            catch (error) {
                // setError(error.message);
                alert('data not found')
            }
        };

        fetchData();
    }, []);

    console.log(inboxes)
    return (
        <div className="flex flex-col lg:h-[700px] min-h-max w-full">
            <div className="bg-primary text-primary-foreground p-4">
                <h2 className="text-xl font-semibold">Inbox</h2>
            </div>
            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'
                            }`}
                    >
                        <div
                            className={`inline-block p-2 rounded-lg ${message.sender === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                                }`}
                        >
                            {message.subject && (
                                <div className="font-semibold mb-1">{message.subject}</div>
                            )}
                            <div>{message.text}</div>
                            {message.attachment && (
                                <div className="mt-1 text-sm">
                                    Attachment: {message.attachment.name}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 bg-background">
                <Input
                    type="text"
                    placeholder="Subject (optional)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mb-2"
                />
                <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="mb-2"
                    rows={3}
                />
                <div className="flex items-center space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="h-4 w-4" />
                        <span className="sr-only">Attach file</span>
                    </Button>
                    <Input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleAttachment}
                    />
                    {attachment && (
                        <span className="text-sm text-muted-foreground">
                            {attachment.name}
                        </span>
                    )}
                    <Button type="submit" className="ml-auto">
                        <Send className="h-4 w-4 mr-2" />
                        Send
                    </Button>
                </div>
            </form>
        </div>
    )
}