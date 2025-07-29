"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Sandpack } from "@codesandbox/sandpack-react"

function cleanJsxCode(rawJsx) {
  if (!rawJsx) return ""
  let code = rawJsx
    .replace(/^```jsx\s*/i, "")
    .replace(/```$/i, "")
    .trim()

  // Always inject import React
  if (!/export\s+default/.test(code)) {
    code = `
import React from "react"

function App() {
  return (
    <div className="p-4">
      ${code}
    </div>
  )
}

export default App`
  } else if (!/^import\s+React\b/.test(code)) {
    code = `import React from "react"\n` + code
  }

  return code.trim()
}


export default function CodePreview({ jsx = "", css = "", activeTab }) {
  const [copied, setCopied] = useState(false)
  const cleanedJsx = cleanJsxCode(jsx)

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error("Copy failed")
    }
  }

  // Sandpack files setup with Tailwind injected via script
  const files = {
    "/App.js": css.trim()
      ? `import "./styles.css"\n\n` + cleanedJsx
      : cleanedJsx,

    "/index.js": `
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Inject Tailwind CSS via CDN
const script = document.createElement("script");
script.src = "https://cdn.tailwindcss.com";
script.onload = () => {
  const root = createRoot(document.getElementById("root"));
  root.render(<App />);
};
document.head.appendChild(script);
`,

    "/index.html": `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React + Tailwind</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`,
  }

  if (css.trim()) {
    files["/styles.css"] = css
  }

  if (activeTab === "preview") {
    return !cleanedJsx.trim() ? (
      <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">🎨</div>
          <div>No preview available</div>
          <div className="text-sm mt-1">Generate some code to see the preview</div>
        </div>
      </div>
    ) : (
      <div className="h-full bg-gray-100 rounded-lg p-4">
        <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Live Preview</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
          <div className="h-full">
            <Sandpack
              template="vanilla"
              files={files}
              options={{
                showNavigator: false,
                showTabs: false,
                showLineNumbers: false,
                showInlineErrors: true,
                showErrorScreen: true,
                autorun: true,
                recompileMode: "delayed",
                recompileDelay: 300,
              }}
              customSetup={{
                dependencies: {
                  react: "^18.0.0",
                  "react-dom": "^18.0.0",
                },
              }}
              theme="light"
            />
          </div>
        </div>
      </div>
    )
  }

  // Generated Code view
  return !cleanedJsx.trim() ? (
  <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
    <div className="text-center">
      <div className="text-4xl mb-2">🎨</div>
      <div>No preview available</div>
      <div className="text-sm mt-1">Generate some code to see the preview</div>
    </div>
  </div>
) : (
  <div className="h-full flex flex-col bg-gray-100 rounded-lg">
    <div className="bg-white rounded-t-lg shadow-sm border-b border-gray-200 px-4 py-2 flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">Live Preview</span>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-xs text-gray-500">Live</span>
      </div>
    </div>
    <div className="flex-1 overflow-hidden">
      <Sandpack
        template="vanilla"
        files={files}
        options={{
          showNavigator: false,
          showTabs: true,
          showLineNumbers: false,
          showInlineErrors: true,
          showErrorScreen: true,
          autorun: true,
          recompileMode: "delayed",
          recompileDelay: 300,
          editorHeight: 800, // default - 300
          editorWidthPercentage: 50,
        }}
        customSetup={{
          dependencies: {
            react: "^18.0.0",
            "react-dom": "^18.0.0",
          },
        }}
        theme="light"
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  </div>
)
 
}



