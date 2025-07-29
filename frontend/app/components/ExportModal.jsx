"use client"

import { useState } from "react"
import { Download, X, Check } from "lucide-react"
import { exportAPI } from "../services/api"

export default function ExportModal({ session, isOpen, onClose }) {
  const [loading, setLoading] = useState(false)
  const [exported, setExported] = useState(false)

  const handleDownload = async () => {
    try {
      setLoading(true)

      // Directly call the API to get the blob
      const blob = await exportAPI.exportSession(session._id)

      if (!(blob instanceof Blob)) {
        throw new Error("Export failed: Received data is not a Blob")
      }

      const filename = `${session.title.replace(/\s+/g, "-").toLowerCase()}-export.${blob.type.split("/")[1] || "bin"}`
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExported(true)
      setTimeout(() => {
        setExported(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Confirm Export</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        <p className="text-gray-700 mb-6">
          Are you sure you want to export "<strong>{session.title}</strong>"?
        </p>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={loading}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {exported ? (
              <>
                <Check className="h-4 w-4" />
                <span>Exported!</span>
              </>
            ) : loading ? (
              <span>Exporting...</span>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
