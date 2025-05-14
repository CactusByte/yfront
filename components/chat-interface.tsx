"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Loader2, Smile, MoreHorizontal, X } from "lucide-react"
import Image from "next/image"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { AnimatePresence, motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isLoading?: boolean
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there, I'm Yongui! I'm so excited to meet you! What would you like to talk about today? 👽✨",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate typing indicator
  useEffect(() => {
    if (isLoading) {
      setIsTyping(true)
    } else {
      const timeout = setTimeout(() => {
        setIsTyping(false)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const messageId = Date.now().toString()
    const userMessage: Message = {
      id: messageId,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Add temporary loading message
    const loadingMessageId = `loading-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      },
    ])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input
        }),
      })

      const data = await response.json()
      console.log('API Response:', data)

      if (!response.ok) {
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          data
        })
        throw new Error(data.error || `API request failed with status ${response.status}`)
      }

      if (!data.response) {
        console.error('Invalid API response format:', data)
        throw new Error('Invalid response format from API')
      }

      // Remove loading message and add real response
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== loadingMessageId)
          .concat({
            id: Date.now().toString(),
            role: "assistant",
            content: data.response,
            timestamp: new Date(),
          }),
      )
    } catch (error) {
      console.error("Error getting response:", error)

      let errorMessage = "I'm having trouble connecting to my home planet. Please check if the server is running and try again! 📡👾"
      let toastMessage = "Failed to connect with the server. Please try again."

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage = "I can't reach my home planet's servers. Please check your internet connection and try again! 🌐👾"
        toastMessage = "Network error: Unable to reach the server. Please check your internet connection."
      }

      // Remove loading message and add error message
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== loadingMessageId)
          .concat({
            id: Date.now().toString(),
            role: "assistant",
            content: errorMessage,
            timestamp: new Date(),
          }),
      )

      toast({
        title: "Connection Error",
        description: toastMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Chat cleared! What would you like to talk about now?",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <Card className="w-full max-w-2xl bg-gray-900/70 backdrop-blur-sm border border-green-500/30 rounded-xl overflow-hidden shadow-xl shadow-green-500/5">
      <div className="bg-gray-800/80 p-3 border-b border-green-500/30 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 relative mr-3">
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full z-10 animate-pulse"></div>
            <Image src="/images/yongui.png" alt="Yongui" width={32} height={32} className="rounded-full" />
          </div>
          <div>
            <h3 className="font-medium text-green-400">Yongui</h3>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700/50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={clearChat}>Clear Chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="h-[500px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-green-500/20 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="flex gap-3 max-w-[85%]">
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="/images/yongui.png" alt="Yongui" />
                    <AvatarFallback className="bg-green-500/20 text-green-400">Y</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col">
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-purple-600 text-white rounded-tr-none"
                        : "bg-green-500/20 border border-green-500/30 text-white rounded-tl-none"
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                  <span className="text-xs text-gray-500 mt-1 ml-1">
                    {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                  </span>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-purple-600/20 text-purple-400">U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && !messages.some((m) => m.isLoading) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src="/images/yongui.png" alt="Yongui" />
                <AvatarFallback className="bg-green-500/20 text-green-400">Y</AvatarFallback>
              </Avatar>
              <div className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-white rounded-tl-none">
                <div className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-green-500/30">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message to Yongui..."
              className="bg-gray-800/50 border-green-500/30 focus-visible:ring-green-500/50 text-white pr-10"
              disabled={isLoading}
            />
            {input && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-white"
                onClick={() => setInput("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-green-400 hover:bg-green-500/10"
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-green-500 hover:bg-green-600 text-black"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </Card>
  )
}
