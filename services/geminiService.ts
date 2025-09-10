// Fix: Implemented the AI service function to communicate with the Gemini API.
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, LearnBoxSection } from '../types';

// The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function dataUrlToAiPart(url: string, mimeType: string) {
  return {
    inlineData: {
      data: url.split(',')[1],
      mimeType,
    },
  };
}

export const sendMessageToAI = async (history: ChatMessage[]) => {
  try {
    // Convert our app's chat history to the format Gemini API expects
    const contents = history.map(msg => {
      const parts = [];
      if (msg.text) {
        parts.push({ text: msg.text });
      }
      if (msg.media) {
        parts.push(dataUrlToAiPart(msg.media.url, msg.media.mimeType));
      }
      return {
        role: msg.sender === 'user' ? 'user' : 'model',
        parts,
      };
    });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        tools: [{googleSearch: {}}],
      }
    });
    
    const text = result.text;
    const sources = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, sources };

  } catch (error) {
    console.error("Error sending message to AI:", error);
    if (error instanceof Error) {
        return { text: `Sorry, an error occurred: ${error.message}`, sources: [] };
    }
    return {
      text: "I'm sorry, I encountered an unknown error. Please try again.",
      sources: []
    };
  }
};


export const generateMindMap = async (section: LearnBoxSection): Promise<string> => {
  const contentString = section.content.map(item => {
    switch(item.type) {
      case 'text': return `Text: ${item.content}`;
      case 'link': return `Link: ${item.url}`;
      case 'file': return `File: ${item.name}`;
      case 'video': return `Video: ${item.url}`;
      case 'image': return `Image: An image is present.`;
      default: return '';
    }
  }).join('\n');

  const prompt = `
    Analyze the following content from a study note section titled "${section.title}". 
    Identify the central topic, main sub-topics, and key relationships between concepts.
    Based on this analysis, generate a visual mind map using Mermaid flowchart syntax (flowchart TD).
    The central topic should be the root node. Sub-topics and key details should branch from it.
    Keep the node text concise. Do not add any explanation before or after the Mermaid code block.
    
    Content:
    ---
    ${contentString}
    ---
  `;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    let mindMapCode = result.text;
    
    // Clean up the response to only include the mermaid code
    if (mindMapCode.includes('```mermaid')) {
      mindMapCode = mindMapCode.split('```mermaid')[1].split('```')[0].trim();
    } else if (mindMapCode.includes('flowchart TD')) {
       mindMapCode = mindMapCode.substring(mindMapCode.indexOf('flowchart TD')).trim();
    }
    
    return mindMapCode;
  } catch (error) {
    console.error("Error generating mind map:", error);
    return "flowchart TD\n  A[Error]\n  B[Could not generate mind map]";
  }
};