"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Send, Download, Code, Eye } from "lucide-react"
import { useSession } from "../contexts/SessionContext"
import { aiAPI, exportAPI } from "../services/api"
import CodePreview from "./CodePreview"
import ChatHistory from "./ChatHistory"
import LoadingSpinner from "./ui/LoadingSpinner"
import ExportModal from "./ExportModal"

export default function MainEditor({ session, onBack }) {
  const [currentSession, setCurrentSession] = useState(session)
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")
  const [currentCode, setCurrentCode] = useState({ jsx: "", css: "" })
  const { updateSession } = useSession()
  const [showExportModal, setShowExportModal] = useState(false)

  useEffect(() => {
    // Load the latest code from chat history
    if (currentSession.chatHistory && currentSession.chatHistory.length > 0) {
      const lastMessage = currentSession.chatHistory[currentSession.chatHistory.length - 1]
      if (lastMessage.code) {
        setCurrentCode(lastMessage.code)
      }
    }
  }, [currentSession])

  const handleSendPrompt = async (e) => {
    e.preventDefault()
    if (!prompt.trim() || loading) return

    setLoading(true)

    try {
      let response

      if (currentCode.jsx) {
        // Update existing component
        response = await aiAPI.update(prompt, currentCode.jsx, currentCode.css, currentSession._id)
      } else {
        // Generate new component
        response = await aiAPI.generate(prompt, currentSession._id)
      }

      // Update current code
      setCurrentCode({
        jsx: response.jsx,
        css: response.css,
      })

      // Update chat history
      const newChatEntry = {
        userPrompt: prompt,
        aiResponse: response.chatReply,
        code: {
          jsx: response.jsx,
          css: response.css,
        },
        timestamp: new Date().toISOString(),
      }

      const updatedChatHistory = [...(currentSession.chatHistory || []), newChatEntry]

      // Update session
      const updatedSession = await updateSession(currentSession._id, {
        chatHistory: updatedChatHistory,
      })

      setCurrentSession(updatedSession)
      setPrompt("")
    } catch (error) {
      console.error("Failed to process prompt:", error)
      alert("Failed to process your request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      setLoading(true)

      // Call the export API with the current session ID
      const exportData = await exportAPI.exportSession(currentSession._id)

      // Create the export content
      const exportContent = {
        sessionTitle: currentSession.title,
        sessionId: currentSession._id,
        jsx: exportData.jsx || "",
        css: exportData.css || "",
        exportedAt: new Date().toISOString(),
        chatHistory: currentSession.chatHistory || [],
      }

      // Create and download the file
      const blob = new Blob([JSON.stringify(exportContent, null, 2)], {
        type: "application/json",
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentSession.title.replace(/\s+/g, "-").toLowerCase()}-export.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Show success message
      alert("Session exported successfully!")
    } catch (error) {
      console.error("Failed to export session:", error)
      alert("Failed to export session. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">{currentSession.title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === "preview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === "code" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Code className="h-4 w-4" />
                  <span>Code</span>
                </button>
              </div>

              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Chat Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ChatHistory chatHistory={currentSession.chatHistory || []} />
          </div>

          {/* Prompt Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendPrompt} className="space-y-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  currentCode.jsx
                    ? "Describe how you'd like to modify the component..."
                    : "Describe the component you want to create..."
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!prompt.trim() || loading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>{currentCode.jsx ? "Update" : "Generate"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            {currentCode.jsx ? (
              <CodePreview jsx={currentCode.jsx} css={currentCode.css} activeTab={activeTab} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No component yet</h3>
                  <p className="text-gray-600 max-w-md">
                    Start by describing the component you want to create in the chat. I'll generate the code and show
                    you a live preview here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ExportModal session={currentSession} isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
    </div>
  )
}


