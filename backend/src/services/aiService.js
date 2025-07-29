// The API key is automatically provided by the Canvas environment for gemini-2.0-flash
// You do not need to explicitly set process.env.LLM_API_KEY or LLM_API_URL.
// Just leave apiKey as an empty string, and Canvas will inject it at runtime.

const LLM_API_URL_BASE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const apiKey = "AIzaSyAHDGS3BuGIV_BtKbMDMcClmkZJY6i7dRQ"; // Canvas will automatically provide the API key here at runtime.

/**
 * Generates a UI component (JSX and CSS) based on a given prompt using the Gemini API.
 * @param {string} prompt - The prompt describing the desired component.
 * @returns {Promise<{jsx: string, css: string, chatReply: string}>} An object containing the generated JSX, CSS, and the full API response text.
 */
exports.generateComponent = async (prompt) => {
  const apiUrl = `${LLM_API_URL_BASE}?key=${apiKey}`;

  // Prepare the chat history for the Gemini API request
  let chatHistory = [];
  chatHistory.push({ role: "user", parts: [{ text: prompt }] });

  const payload = { contents: chatHistory };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error response:", errorData);
      throw new Error(`API call failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();

    let output = '';
    // Safely access the generated text from the Gemini API response
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      output = result.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected Gemini API response structure:", result);
      throw new Error("Failed to generate component: Unexpected API response structure.");
    }

    // Assuming the response has JSX and CSS separated by '/*CSS*/' marker
    const [jsx, css] = output.split('/*CSS*/');
    return {
      jsx: jsx.trim(),
      css: css?.trim() || '', // Ensure css is an empty string if not found
      chatReply: output
    };
  } catch (error) {
    console.error("Error generating component:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

/**
 * Updates an existing UI component (JSX and CSS) based on a new prompt,
 * previous JSX, and previous CSS using the Gemini API.
 * @param {string} prompt - The prompt describing the desired update.
 * @param {string} prevJsx - The previous JSX code of the component.
 * @param {string} prevCss - The previous CSS code of the component.
 * @returns {Promise<{newJsx: string, newCss: string, chatReply: string}>} An object containing the updated JSX, CSS, and the full API response text.
 */
exports.updateComponent = async (prompt, prevJsx, prevCss) => {
  const apiUrl = `${LLM_API_URL_BASE}?key=${apiKey}`;

  // For Gemini's generateContent, system instructions are typically prepended to the user prompt.
  let chatHistory = [];
  const combinedPrompt = `You are an AI UI assistant who can create wonderful UIs using JSX and Tailwind CSS. Use Tailwind CSS strictly. Make the UI very beautiful and impressive. Only write the JSX code — no explanation.\n\nHere is the current JSX:\n${prevJsx}\n\nCSS:\n${prevCss}\n\nNow update it based on this prompt: ${prompt}`;

  chatHistory.push({ role: "user", parts: [{ text: combinedPrompt }] });

  const payload = { contents: chatHistory };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error response:", errorData);
      throw new Error(`API call failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();

    let output = '';
    // Safely access the generated text from the Gemini API response
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      output = result.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected Gemini API response structure:", result);
      throw new Error("Failed to update component: Unexpected API response structure.");
    }

    // Assuming the response has new JSX and new CSS separated by '/*CSS*/' marker
    const [newJsx, newCss] = output.split('/*CSS*/');
    return {
      newJsx: newJsx.trim(),
      newCss: newCss?.trim() || '', // Ensure newCss is an empty string if not found
      chatReply: output
    };
  } catch (error) {
    console.error("Error updating component:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};
