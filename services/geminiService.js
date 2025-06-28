
import { GoogleGenAI } from "@google/genai";
import { MODEL_TEXT, MODEL_IMAGE, SYSTEM_INSTRUCTION_ECLIPSE, SYSTEM_INSTRUCTION_IMAGE_BOT } from '../constants';

let ai = null;

const getAIClient = () => {
  if (!ai) {
    // Use Vite's import.meta.env for browser compatibility
    const apiKey = import.meta.env.GEMINI_API_KEY || "AIzaSyBAgO_o-Or4Xb95qSPM6sMgGvHlSSFDOtY";
    if (!apiKey) {
      console.error("GEMINI_API_KEY environment variable not set.");
      throw new Error("GEMINI_API_KEY environment variable not set.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const createChatSession = (history) => {
  const client = getAIClient();
  return client.chats.create({
    model: MODEL_TEXT,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_ECLIPSE,
    },
    history: history,
  });
};

export const sendMessageStream = async (
  chat,
  content, 
  onChunk,
  onError,
  onComplete
) => {
  try {
    const messagePayload = { message: content };
    
    const result = await chat.sendMessageStream(messagePayload);
    let fullText = "";
    let finalSources = undefined;

    for await (const chunk of result) {
      const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata?.groundingChunks && groundingMetadata.groundingChunks.length > 0) {
        finalSources = groundingMetadata.groundingChunks
          .map((gc) => ({
            uri: gc.web?.uri || '',
            title: gc.web?.title || gc.web?.uri || '',
          }))
          .filter(source => source.uri);
      }
      const textChunk = chunk.text;
      if (textChunk) {
        fullText += textChunk;
        onChunk(textChunk, finalSources); 
      }
    }
    onComplete(fullText, finalSources);
  } catch (error) {
    console.error("Error sending message to Gemini (stream):", error);
    onError(error instanceof Error ? error : new Error('Unknown error during streaming chat.'));
  }
};

export const generateImage = async (prompt) => {
  const client = getAIClient();
  try {
    const promptResponse = await client.models.generateContent({
        model: MODEL_TEXT,
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION_IMAGE_BOT,
            temperature: 0.2,
        }
    });
    
    const imagePrompt = promptResponse.text.trim();
    if (!imagePrompt) {
        throw new Error("Failed to generate a suitable image prompt.");
    }

    console.log("Using image prompt:", imagePrompt);

    const response = await client.models.generateImages({
      model: MODEL_IMAGE,
      prompt: imagePrompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error('No image generated or image data missing.');
    }
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw error;
  }
};


export const generateTitleForChat = async (firstMessageText) => {
    const client = getAIClient();
    try {
        const prompt = `Based on the following first message, suggest a very short, concise title for this conversation (max 5 words, ideally 2-3 words). Do not use quotes or any prefix. Just the title. First message: "${firstMessageText}"`;
        const response = await client.models.generateContent({
            model: MODEL_TEXT,
            contents: prompt,
            config: {
                temperature: 0.3,
            }
        });
        let title = response.text.trim().replace(/^["']|["']$/g, '');
        if (title.length > 30) title = title.substring(0, 27) + "...";
        return title || "New Chat";
    } catch (error) {
        console.error("Error generating title:", error);
        return "New Chat";
    }
};

export const fetchAnswerWithGoogleSearch = async (
  prompt,
  onChunk,
  onError,
  onComplete
) => {
  const client = getAIClient();
  try {
    const fullPrompt = `${SYSTEM_INSTRUCTION_ECLIPSE}\n\nUser query: ${prompt}`;
    
    const params = {
      model: MODEL_TEXT,
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    };

    const result = await client.models.generateContentStream(params);
    let fullText = "";
    let finalSources = undefined;

    for await (const chunk of result) {
      const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata?.groundingChunks && groundingMetadata.groundingChunks.length > 0) {
        finalSources = groundingMetadata.groundingChunks
          .map((gc) => ({
            uri: gc.web?.uri || '',
            title: gc.web?.title || gc.web?.uri || '',
          }))
          .filter(source => source.uri);
      }
      const textChunk = chunk.text;
      if (textChunk) {
        fullText += textChunk;
        onChunk(textChunk, finalSources); 
      }
    }
    onComplete(fullText, finalSources);
  } catch (error) {
    console.error("Error with Google Search grounding:", error);
    onError(error instanceof Error ? error : new Error('Unknown error during Google Search grounding.'));
  }
};

export const generateText = async (prompt) => {
    const client = getAIClient();
    try {
        const response = await client.models.generateContent({
            model: MODEL_TEXT,
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION_ECLIPSE,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating text:", error);
        throw error;
    }
};
