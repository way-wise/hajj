'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from "sonner"
import api from '@/utilities/axios'
import { useAuth } from '@/providers/Auth'
import { Loader2 } from 'lucide-react'

// Define interfaces
interface Message {
    id: string
    subject: string
    message: string
    receiver: {
        id: string
        name: string
        email: string
        roles: string[]
    }
    projects?: {
        id: string
        title: string
        clients: {
            id: string
            name: string
            email: string
            roles: string[]
        }
    }
    isRead: boolean
    createdAt: string
    updatedAt: string
}

interface SendMessageForm {
    subject: string
    message: string
    attachment?: File | null
}

interface MessageData {
    subject: string
    message: string
    receiver: string
    projects?: string
}

export default function InboxPage() {
    const { user } = useAuth()
    const userId = user?.id
    const searchParams = useSearchParams()
    const projectId = searchParams.get('projectId')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [formData, setFormData] = useState<SendMessageForm>({
        subject: '',
        message: '',
        attachment: null
    })

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
        }
    }

    const fetchMessages = async () => {
        if (!userId) return

        try {
            setLoading(true)

            const response = await api.get('/api/inboxes', {
                params: {
                    depth: 2,
                    sort: 'createdAt',
                    where: JSON.stringify({
                        or: [
                            { receiver: { equals: userId } },
                            ...(projectId ? [{ projects: { equals: projectId } }] : [])
                        ]
                    })
                }
            })

            if (response.data.docs) {
                setMessages(response.data.docs)
                setTimeout(scrollToBottom, 100)
            }
        } catch (error: any) {
            console.error('Fetch error:', error)
            toast.error(error?.response?.data?.message || 'Failed to fetch messages')
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                attachment: e.target.files![0]
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!userId || !user) {
            toast.error('Please log in to send messages')
            return
        }

        if (!formData.subject.trim() || !formData.message.trim()) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            setSending(true)

            const messageData: MessageData = {
                subject: formData.subject.trim(),
                message: formData.message.trim(),
                receiver: userId,
                ...(projectId ? { projects: projectId } : {})
            }

            const response = await api.post('/api/inboxes', messageData)

            if (response.data) {
                toast.success('Message sent successfully')
                setFormData({
                    subject: '',
                    message: '',
                    attachment: null
                })
                await fetchMessages()
            }
        } catch (error: any) {
            console.error('Submission error:', error)
            toast.error(error?.response?.data?.message || 'Failed to send message')
        } finally {
            setSending(false)
        }
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        if (userId) {
            fetchMessages()
            const interval = setInterval(fetchMessages, 30000)
            return () => clearInterval(interval)
        }
    }, [userId, projectId])

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom()
        }
    }, [messages])

    if (!userId) {
        return (
            <div className="my-10 p-8 text-center">
                <p className="text-gray-500">Please log in to view your messages.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-4 px-4">
                    {projectId ? 'Project Messages' : 'All Messages'}
                </h2>
                {loading ? (
                    <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                ) : (
                    <div className="space-y-4 h-[500px] overflow-y-auto p-4 bg-gray-50 rounded-lg">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                No messages yet. Start a conversation!
                            </div>
                        ) : (
                            messages.map((message) => {
                                const isCurrentUserReceiver = message.receiver?.id === userId
                                const isAdmin = message.receiver?.roles?.includes('admin')

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex w-full ${isCurrentUserReceiver ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`w-full max-w-[70%] ${isCurrentUserReceiver ? 'items-end' : 'items-start'}`}>
                                            <div className={`flex items-center gap-2 mb-1 ${isCurrentUserReceiver ? 'justify-end' : 'justify-start'}`}>
                                                <span className="text-xs text-gray-500">
                                                    {isAdmin ? 'Admin' : (isCurrentUserReceiver ? 'You' : message.receiver?.name)} • {new Date(message.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <div
                                                className={`rounded-lg p-3 shadow-sm break-words
                                                ${isCurrentUserReceiver
                                                        ? 'bg-blue-500 text-white ml-auto rounded-tr-none'
                                                        : 'bg-white text-gray-800 rounded-tl-none border'
                                                    }`}
                                            >
                                                <div className="font-medium mb-1">{message.subject}</div>
                                                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <Input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Subject"
                            disabled={sending}
                            required
                            className="text-sm"
                        />
                    </div>
                    <div>
                        <Input
                            type="file"
                            onChange={handleFileChange}
                            disabled={sending}
                            className="text-sm"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Type your message here"
                        rows={3}
                        disabled={sending}
                        required
                        className="text-sm"
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={sending} size="sm">
                        {sending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            'Send Message'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}