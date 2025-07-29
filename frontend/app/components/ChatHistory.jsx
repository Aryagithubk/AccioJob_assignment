"use client"

import { User, Bot, Clock } from "lucide-react"

export default function ChatHistory({ chatHistory }) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!chatHistory || chatHistory.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Bot className="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p className="text-sm">No messages yet</p>
        <p className="text-xs text-gray-400 mt-1">Start a conversation to see your chat history</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {chatHistory.map((message, index) => (
        <div key={index} className="space-y-3">
          {/* User Message */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-gray-900">{message.userPrompt}</p>
              </div>
              {message.timestamp && (
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(message.timestamp)}
                </div>
              )}
            </div>
          </div>

          {/* AI Response */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-900">{message.aiResponse}</p>
                {message.code && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-200">Code generated</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {index < chatHistory.length - 1 && <div className="border-b border-gray-100 pb-2" />}
        </div>
      ))}
    </div>
  )
}
