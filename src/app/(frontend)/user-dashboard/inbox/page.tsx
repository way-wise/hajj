'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from "sonner"
import api from '@/utilities/axios'
import { useAuth } from '@/providers/Auth'

interface Message {
    id: string
    subject: string
    message: string
    sender: {
        id: string
        name: string
        email: string
        roles: string[]
    }
    attachments?: {
        id: string
        url: string
        filename: string
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
    clients: {
        id: string
        name: string
        email: string
        roles: string[]
    }
    createdAt: string
    updatedAt: string
}

interface SendMessageForm {
    subject: string
    message: string
    attachment?: File | null
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
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const fetchMessages = async () => {
        if (!userId) return

        try {
            setLoading(true)
            const response = await api.get('/api/inboxes', {
                params: {
                    depth: 2,
                    sort: '-createdAt', // Sort by newest first
                    where: {
                        or: [
                            { sender: { equals: userId } },
                            { clients: { equals: userId } },
                            ...(projectId ? [{ projects: { equals: projectId } }] : [])
                        ]
                    }
                }
            })

            if (response.data.docs) {
                setMessages(response.data.docs)
                scrollToBottom()
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

            // Create the base message data
            const messageData = {
                subject: formData.subject.trim(),
                message: formData.message.trim(),
                sender: userId
            }

            // If it's a project message, set the client as the project owner
            if (projectId) {
                const projectResponse = await api.get(`/api/projects/${projectId}`)
                if (projectResponse.data?.clients?.id) {
                    messageData.clients = projectResponse.data.clients.id
                    messageData.projects = projectId
                }
            } else {
                // For direct messages, set the client as an admin
                const adminResponse = await api.get('/api/users', {
                    params: {
                        where: {
                            roles: {
                                contains: 'admin'
                            }
                        }
                    }
                })
                if (adminResponse.data?.docs?.[0]?.id) {
                    messageData.clients = adminResponse.data.docs[0].id
                }
            }

            // Handle file upload if exists
            if (formData.attachment) {
                const fileData = new FormData()
                fileData.append('file', formData.attachment)

                try {
                    const uploadResponse = await api.post('/api/media', fileData)
                    if (uploadResponse.data?.id) {
                        messageData.attachments = uploadResponse.data.id
                    }
                } catch (uploadError) {
                    console.error('File upload error:', uploadError)
                    toast.error('Failed to upload file')
                    return
                }
            }

            console.log('Sending message data:', messageData)

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
        scrollToBottom()
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
                    <div className="text-center text-gray-500">Loading messages...</div>
                ) : (
                    <div className="space-y-4 h-[500px] overflow-y-auto p-4 bg-gray-50 rounded-lg">
                        {messages.map((message) => {
                            const isCurrentUserMessage = message.sender?.id === message.clients.id;

                            return (
                                <div key={message.id} className={`flex ${!isCurrentUserMessage ? 'justify-end' : 'justify-start'} mb-4`}>
                                    <div className={`max-w-[70%]`}>
                                        <div className={`flex items-center mb-1 ${!isCurrentUserMessage ? 'justify-end' : 'justify-start'}`}>
                                            <span className="text-xs text-gray-500">
                                                {message.sender?.name} • {new Date(message.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <div
                                            className={`rounded-lg p-3 shadow-sm
                                                ${!isCurrentUserMessage
                                                    ? 'bg-blue-500 text-white rounded-tr-none'
                                                    : 'bg-white text-gray-800 rounded-tl-none border'}`}
                                        >
                                            <div className="font-medium mb-1">{message.subject}</div>
                                            <p className="text-sm">{message.message}</p>
                                            {message.attachments && (
                                                <div className="mt-2 text-sm">
                                                    <a
                                                        href={message.attachments.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center gap-1 ${!isCurrentUserMessage ? 'text-white' : 'text-blue-500'}`}
                                                    >
                                                        📎 {message.attachments.filename}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
                        {sending ? 'Sending...' : 'Send Message'}
                    </Button>
                </div>
            </form>
        </div>
    )
}