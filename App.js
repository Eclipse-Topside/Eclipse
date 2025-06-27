

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ImageFullScreenView from './components/ImageFullScreenView';
import { 
  createChatSession, 
  sendMessageStream, 
  generateImage, 
  generateTitleForChat,
  fetchAnswerWithGoogleSearch,
} from './services/geminiService';
import { DEFAULT_CHAT_TITLE, SUGGESTIONS, SuggestionType, MODEL_TEXT } from './constants'; 

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState({});
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [imageToEdit, setImageToEdit] = useState(null); 
  const [imageToSend, setImageToSend] = useState(null); 
  const [imageLibrary, setImageLibrary] = useState([]);
  const [scrollToMessageId, setScrollToMessageId] = useState(null);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);

  const handleOpenImageFullScreen = (imageUrl) => {
    setFullScreenImageUrl(imageUrl);
  };

  const handleCloseImageFullScreen = () => {
    setFullScreenImageUrl(null);
  };

  useEffect(() => {
    const storedChats = localStorage.getItem('eclipseChats');
    let loadedImageLibrary = [];
    if (storedChats) {
      const parsedChats = JSON.parse(storedChats);
      Object.values(parsedChats).forEach(chat => {
        chat.createdAt = new Date(chat.createdAt);
        chat.messages.forEach(msg => {
          msg.timestamp = new Date(msg.timestamp);
          if (msg.uploadedImagePreviewUrl && !msg.uploadedImageUrl) {
            msg.uploadedImageUrl = msg.uploadedImagePreviewUrl;
            delete msg.uploadedImagePreviewUrl;
          }
          // Populate image library from stored chats
          if (msg.sender === 'ai' && msg.imageUrl) {
            const userMessagePrompt = chat.messages.find(m => m.id === msg.id.replace('_ai', '_user'))?.text || "Image"; // Basic prompt fetching
            loadedImageLibrary.push({
              chatId: chat.id,
              messageId: msg.id,
              imageUrl: msg.imageUrl,
              promptText: msg.text || userMessagePrompt, // Use AI message text (which includes prompt) or fallback
              timestamp: msg.timestamp,
            });
          }
        });
        
        const sortedMessages = [...chat.messages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        if (sortedMessages && sortedMessages.length > 0) {
            const geminiHistory = sortedMessages
                .filter(msg => (msg.sender === 'user' || msg.sender === 'ai') && typeof msg.text === 'string' && msg.text.trim() !== '' && !msg.uploadedImageUrl && !msg.imageUrl) 
                .map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }], 
                }));
            
            if (geminiHistory.length > 0) {
                chat.geminiChat = createChatSession(geminiHistory);
            } else {
                chat.geminiChat = createChatSession(); 
            }
        } else {
            chat.geminiChat = createChatSession(); 
        }
      });
      setChats(parsedChats);
    }

    const storedImageLibrary = localStorage.getItem('eclipseImageLibrary');
    if (storedImageLibrary) {
      setImageLibrary(JSON.parse(storedImageLibrary).map(img => ({...img, timestamp: new Date(img.timestamp)})));
    } else if (loadedImageLibrary.length > 0) {
      // If no stored library but we loaded images from chats, use that
      setImageLibrary(loadedImageLibrary.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }
    
    const storedActiveChatId = localStorage.getItem('eclipseActiveChatId');
    if (storedActiveChatId && storedChats && JSON.parse(storedChats)[storedActiveChatId]) { 
        setActiveChatId(storedActiveChatId);
    } else if (storedChats && Object.keys(JSON.parse(storedChats)).length > 0) {
        const availableChats = Object.values(JSON.parse(storedChats)).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setActiveChatId(availableChats[0].id);
    }
    
    if (window.innerWidth < 768) {
        setSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('eclipseChats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('eclipseImageLibrary', JSON.stringify(imageLibrary));
  }, [imageLibrary]);

  useEffect(() => {
    if(activeChatId && chats[activeChatId]) { 
        localStorage.setItem('eclipseActiveChatId', activeChatId);
    } else {
        localStorage.removeItem('eclipseActiveChatId');
    }
  }, [activeChatId, chats]);

  const updateChatMessages = useCallback((chatId, messagesUpdater) => {
    setChats(prevChats => {
      const chatToUpdate = prevChats[chatId];
      if (!chatToUpdate) {
        console.warn(`updateChatMessages: Chat with ID ${chatId} not found in prevChats.`);
        const minimalChat = {
            id: chatId,
            title: DEFAULT_CHAT_TITLE,
            messages: [],
            createdAt: new Date(),
            geminiChat: createChatSession(), 
            isGeneratingTitle: false,
        };
        return {
            ...prevChats,
            [chatId]: {
                ...minimalChat,
                messages: messagesUpdater([]), 
            }
        };
      }
      return {
        ...prevChats,
        [chatId]: {
          ...chatToUpdate,
          messages: messagesUpdater(chatToUpdate.messages),
        },
      };
    });
  }, []);
  
  const handleNewChat = useCallback(() => {
    const newChatId = `chat_${Date.now()}`;
    const newChat = {
      id: newChatId,
      title: DEFAULT_CHAT_TITLE,
      messages: [],
      createdAt: new Date(),
      geminiChat: createChatSession(), 
      isGeneratingTitle: false,
    };
    setChats(prev => ({ ...prev, [newChatId]: newChat }));
    setActiveChatId(newChatId);
    setInputText('');
    setImageToEdit(null);
    setImageToSend(null); 
    if (window.innerWidth < 768) { 
        setSidebarOpen(false); 
    }
  }, []);

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setInputText(''); 
    setImageToEdit(null);
    setImageToSend(null); 
    if (window.innerWidth < 768) { 
        setSidebarOpen(false); 
    }
  };
  
 const generateTitleIfNeeded = useCallback(async (chatId, firstUserMessage) => {
    setChats(prevChats => {
        const currentChat = prevChats[chatId];
        if (currentChat && currentChat.messages.length === 1 && currentChat.title === DEFAULT_CHAT_TITLE && !currentChat.isGeneratingTitle && !firstUserMessage.uploadedImageUrl && !firstUserMessage.imageEditPreviewUrl) {
            const updatedChat = { ...currentChat, isGeneratingTitle: true };
            const newChats = { ...prevChats, [chatId]: updatedChat };

            generateTitleForChat(firstUserMessage.text)
                .then(newTitle => {
                    setChats(prev => ({ ...prev, [chatId]: { ...prev[chatId], title: newTitle || DEFAULT_CHAT_TITLE, isGeneratingTitle: false }}));
                })
                .catch(error => {
                    console.error("Failed to generate title:", error);
                    setChats(prev => ({ ...prev, [chatId]: { ...prev[chatId], isGeneratingTitle: false }}));
                });
            return newChats; 
        }
        return prevChats; 
    });
  }, []);


  const handleSendMessage = useCallback(async (text, suggestionType) => {
    const currentText = text.trim();
    if (!currentText && !imageToSend && !(imageToEdit && suggestionType === SuggestionType.EDIT_IMAGE)) return;

    setIsSending(true);

    let currentChatId = activeChatId;
    let geminiChatInstance; 
    
    const userMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: currentText,
      timestamp: new Date(),
      uploadedImageUrl: imageToSend?.previewUrl, 
      imageEditPreviewUrl: (suggestionType === SuggestionType.EDIT_IMAGE && imageToEdit) ? imageToEdit.previewUrl : undefined,
    };

    const lowerCaseText = currentText.toLowerCase();
    const imageCommandPrefixes = [
        '/image ', 'generate image ', 'create an image of ', 
        'draw ', 'paint ', 'show me an image of '
    ];

    let isImageGenerationIntent = false;
    let finalImagePrompt = "";

    if (suggestionType === SuggestionType.CREATE_IMAGE) {
        isImageGenerationIntent = true;
        const createSuggestion = SUGGESTIONS.find(s => s.id === SuggestionType.CREATE_IMAGE);
        const prefixToRemove = createSuggestion?.promptPrefix?.toLowerCase() || '/image ';
        finalImagePrompt = lowerCaseText.startsWith(prefixToRemove) ? currentText.substring(prefixToRemove.length).trim() : currentText;
    } else { 
        for (const prefix of imageCommandPrefixes) {
            if (lowerCaseText.startsWith(prefix)) {
                isImageGenerationIntent = true;
                finalImagePrompt = currentText.substring(prefix.length).trim();
                break;
            }
        }
    }
    
    if (isImageGenerationIntent && !finalImagePrompt) finalImagePrompt = "a beautiful random landscape";

    if (!currentChatId || !chats[currentChatId]) { 
      const newChatId = `chat_${Date.now()}`;
      currentChatId = newChatId; 
      geminiChatInstance = createChatSession();
      const newChatData = {
        id: newChatId, title: DEFAULT_CHAT_TITLE, messages: [userMessage], 
        createdAt: new Date(), geminiChat: geminiChatInstance, isGeneratingTitle: false,
      };
      setChats(prev => ({ ...prev, [newChatId]: newChatData }));
      setActiveChatId(newChatId);
      if (currentText && !isImageGenerationIntent && !imageToSend) generateTitleIfNeeded(newChatId, userMessage);
    } else { 
      const chat = chats[currentChatId];
      if (!chat || !chat.geminiChat) {
        console.error(`Error: Existing chat ${currentChatId} or its geminiChat session not found.`);
        setIsSending(false); return;
      }
      geminiChatInstance = chat.geminiChat;
      updateChatMessages(currentChatId, (prevMsgs) => [...prevMsgs, userMessage]);
      if (chat.messages.length === 0 && chat.title === DEFAULT_CHAT_TITLE && currentText && !isImageGenerationIntent && !imageToSend) {
        generateTitleIfNeeded(currentChatId, userMessage);
      }
    }

    const imageBeingSentForUpload = imageToSend; 
    const imageBeingSentForEdit = imageToEdit; 

    setInputText('');
    setImageToSend(null); 
    setImageToEdit(null); 

    const aiMessageId = `msg_${Date.now() + 1}_ai`; // Ensure AI message ID is distinct
    const aiPlaceholderMessage = { id: aiMessageId, sender: 'ai', text: '', timestamp: new Date(), isLoading: true };
    updateChatMessages(currentChatId, (prevMsgs) => [...prevMsgs, aiPlaceholderMessage]);

    try {
      if (isImageGenerationIntent) {
          const imageUrl = await generateImage(finalImagePrompt);
          const aiMessageWithImage = { 
              ...aiPlaceholderMessage, 
              text: `Generated image for: "${finalImagePrompt}"`, 
              imageUrl, 
              isLoading: false 
          };
          updateChatMessages(currentChatId, prevMsgs =>
            prevMsgs.map(msg => msg.id === aiMessageId ? aiMessageWithImage : msg)
          );
          setImageLibrary(prevLib => [{
            chatId: currentChatId,
            messageId: aiMessageId,
            imageUrl: imageUrl,
            promptText: finalImagePrompt,
            timestamp: aiMessageWithImage.timestamp,
          }, ...prevLib].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()));
      } else { 
        let geminiContentParts = [];
        if (currentText) geminiContentParts.push({ text: currentText });

        let imageFileToProcess = null;
        if (imageBeingSentForUpload) { 
            imageFileToProcess = imageBeingSentForUpload.file;
        } else if (suggestionType === SuggestionType.EDIT_IMAGE && imageBeingSentForEdit) { 
            imageFileToProcess = imageBeingSentForEdit.file;
        }

        if (imageFileToProcess) {
            const base64Image = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result).split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(imageFileToProcess);
            });
            geminiContentParts.push({ inlineData: { mimeType: imageFileToProcess.type, data: base64Image }});
        }
        
        const geminiContent = { role: 'user', parts: geminiContentParts };
        
        if (geminiContentParts.length === 0) {
            updateChatMessages(currentChatId, prevMsgs =>
                prevMsgs.map(msg => msg.id === aiMessageId ? { ...msg, text: "Cannot process an empty message.", isLoading: false, isError: true } : msg)
            );
        } else {
            let accumulatedText = "";
            const serviceToUse = (geminiContentParts.some(p => p.inlineData) || currentText.toLowerCase().includes("this image")) 
                ? sendMessageStream.bind(null, geminiChatInstance, geminiContent)
                : fetchAnswerWithGoogleSearch.bind(null, currentText || "Tell me something interesting.");

            await serviceToUse(
                (chunk, sources) => {
                  accumulatedText += chunk;
                  updateChatMessages(currentChatId, prevMsgs =>
                    prevMsgs.map(msg => msg.id === aiMessageId ? { ...msg, text: accumulatedText, sources, isLoading: true } : msg)
                  );
                },
                (error) => { 
                  console.error("Gemini stream/search error:", error);
                  updateChatMessages(currentChatId, prevMsgs =>
                    prevMsgs.map(msg => msg.id === aiMessageId ? { ...msg, text: "Sorry, I encountered an error processing your request.", isLoading: false, isError: true } : msg)
                  );
                },
                (finalText, sources) => { 
                  updateChatMessages(currentChatId, prevMsgs =>
                    prevMsgs.map(msg => msg.id === aiMessageId ? { ...msg, text: finalText, sources, isLoading: false } : msg)
                  );
                }
            );
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      updateChatMessages(currentChatId, prevMsgs =>
        prevMsgs.map(msg => msg.id === aiMessageId ? { ...msg, text: 'Failed to get response.', isLoading: false, isError: true } : msg)
      );
    } finally {
      setIsSending(false);
    }
  }, [activeChatId, chats, imageToEdit, imageToSend, updateChatMessages, generateTitleIfNeeded, imageLibrary]);

  const handleSendMessageRef = useRef(handleSendMessage);
  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  }, [handleSendMessage]);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recInstance = new SpeechRecognitionAPI();
      recInstance.continuous = false; recInstance.interimResults = true; recInstance.lang = 'en-US';
      recInstance.onresult = (event) => {
        let interimTranscript = ''; let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
          else interimTranscript += event.results[i][0].transcript;
        }
        setInputText(finalTranscript || interimTranscript);
        if (finalTranscript) handleSendMessageRef.current(finalTranscript); 
      };
      recInstance.onerror = (event) => { console.error('Speech recognition error:', event.error); setIsListening(false); };
      recInstance.onend = () => setIsListening(false);
      setRecognition(recInstance);
      return () => { if (recInstance) recInstance.abort(); setRecognition(null); };
    } else console.warn("Speech Recognition API not supported.");
  }, []); 

  const handleRetryMessage = useCallback((chatId, failedMessageId) => {
    const chat = chats[chatId];
    if (!chat) return;
    const failedMessageIndex = chat.messages.findIndex(m => m.id === failedMessageId);
    if (failedMessageIndex <= 0) { return; }
    
    const userMessageToResend = chat.messages[failedMessageIndex - 1];
    if (userMessageToResend?.sender !== 'user' || (!userMessageToResend.text && !userMessageToResend.uploadedImageUrl && !userMessageToResend.imageEditPreviewUrl)) {
        return;
    }
    
    setChats(prev => ({ ...prev, [chatId]: { ...prev[chatId], messages: chat.messages.slice(0, failedMessageIndex - 1) }}));

    if (userMessageToResend.uploadedImageUrl) {
        console.warn("Retrying message with previously uploaded image: Image will not be re-sent unless re-selected.");
    }
     if (userMessageToResend.imageEditPreviewUrl) {
        console.warn("Retrying message with previously selected edit image: Image will not be re-sent unless re-selected.");
    }

    handleSendMessage(userMessageToResend.text || "", undefined); 

  }, [chats, handleSendMessage]);


  const handleVoiceInput = () => {
    if (!recognition) { alert("Speech recognition is not available."); return; }
    if (isListening) { recognition.stop(); setIsListening(false); } 
    else {
      try {
        setInputText(''); setImageToEdit(null); setImageToSend(null); 
        recognition.start(); setIsListening(true);
      } catch (e) {
        console.error("Error starting speech recognition:", e.message);
        if (e.name === 'InvalidStateError' && recognition) { 
            recognition.abort(); 
            try { recognition.start(); setIsListening(true); } 
            catch (e2) { console.error("Still unable to start speech recognition:", e2); setIsListening(false); }
        } else setIsListening(false); 
      }
    }
  };

  const handleImageFileSelectedForEdit = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageToEdit({ file, previewUrl });
      const editImageSuggestion = SUGGESTIONS.find(s => s.id === SuggestionType.EDIT_IMAGE);
      setInputText(editImageSuggestion?.promptPrefix || 'Edit this image to ');
      setImageToSend(null); 
    }
    if (event.target) event.target.value = ''; 
  };

  const handleImageFileSelectedForSend = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageToSend({ file, previewUrl });
      setImageToEdit(null); 
    }
  };

  const clearImageToEdit = () => {
    if (imageToEdit?.previewUrl) URL.revokeObjectURL(imageToEdit.previewUrl);
    setImageToEdit(null);
    const editImageSuggestion = SUGGESTIONS.find(s => s.id === SuggestionType.EDIT_IMAGE);
     if (inputText.startsWith(editImageSuggestion?.promptPrefix || 'Edit this image to ')) setInputText('');
  };

  const clearImageToSend = () => {
    if (imageToSend?.previewUrl) URL.revokeObjectURL(imageToSend.previewUrl);
    setImageToSend(null);
  };


  const handleUpdateChatTitle = useCallback((chatId, currentTitle) => {
    const newTitle = window.prompt("Enter new chat name:", currentTitle);
    if (newTitle && newTitle.trim() !== "") {
      setChats(prev => (prev[chatId] ? { ...prev, [chatId]: { ...prev[chatId], title: newTitle.trim() } } : prev));
    }
  }, []);

  const handleDeleteChat = useCallback((chatIdToDelete) => {
    setChats(prevChats => { const updatedChats = { ...prevChats }; delete updatedChats[chatIdToDelete]; return updatedChats; });
    // Also remove images from library associated with this chat
    setImageLibrary(prevLib => prevLib.filter(img => img.chatId !== chatIdToDelete));

    if (activeChatId === chatIdToDelete) {
      const remainingChatsArray = Object.values(chats).filter(chat => chat.id !== chatIdToDelete)
                                   .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setActiveChatId(remainingChatsArray.length > 0 ? remainingChatsArray[0].id : null);
    }
  }, [activeChatId, chats]); 

  const handleDeleteChatConfirmation = useCallback((chatId) => {
    const chatToDelete = chats[chatId];
    if (!chatToDelete) return; 
    if (window.confirm(`Are you sure you want to delete chat "${chatToDelete.title || DEFAULT_CHAT_TITLE}"?`)) handleDeleteChat(chatId);
  }, [chats, handleDeleteChat]);

  const handleSelectImageFromLibrary = (imageUrl) => {
    handleOpenImageFullScreen(imageUrl);
  };
  
  const handleDeleteImageFromLibrary = useCallback((messageIdToDelete) => {
    if (window.confirm("Are you sure you want to permanently delete this image?")) {
        setImageLibrary(prevLib => prevLib.filter(img => img.messageId !== messageIdToDelete));
    }
  }, []);

  const handleShareImageFromLibrary = useCallback(async (imageUrl, promptText) => {
    if (navigator.share) {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'ai-generated-image.jpg', { type: blob.type });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'AI Generated Image',
                    text: `Image generated from prompt: "${promptText}"`,
                    files: [file],
                });
            } else {
                 await navigator.share({
                    title: 'AI Generated Image',
                    text: `Image generated from prompt: "${promptText}"`,
                    files: [file],
                });
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                 console.error('Error sharing image:', error);
                 alert(`Could not share image. Error: ${error.message}`);
            }
        }
    } else {
        try {
            await navigator.clipboard.writeText(promptText);
            alert('Share API not available. The image prompt has been copied to your clipboard.');
        } catch (err) {
            console.error('Failed to copy prompt text:', err);
            alert('Sharing is not supported on your browser.');
        }
    }
  }, []);


  const handleScrollToMessageComplete = () => {
    setScrollToMessageId(null);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    React.createElement('div', { className: "flex h-screen bg-eclipse-dark-bg relative overflow-hidden" }, 
      sidebarOpen && React.createElement('div', {
        className: "fixed inset-0 z-30 bg-black/50 md:hidden",
        onClick: toggleSidebar,
        'aria-hidden': "true"
      }),
      React.createElement(Sidebar, {
        isOpen: sidebarOpen,
        toggleSidebar: toggleSidebar,
        chats: Object.values(chats),
        activeChatId: activeChatId,
        onNewChat: handleNewChat,
        onSelectChat: handleSelectChat,
        onEditChatTitle: handleUpdateChatTitle,
        onDeleteChat: handleDeleteChatConfirmation,
        imageLibrary: imageLibrary,
        onSelectImageFromLibrary: handleSelectImageFromLibrary,
        onDeleteImageFromLibrary: handleDeleteImageFromLibrary,
        onShareImageFromLibrary: handleShareImageFromLibrary,
      }),
      React.createElement(ChatArea, {
        activeChat: activeChatId ? chats[activeChatId] : null,
        messages: activeChatId && chats[activeChatId] ? chats[activeChatId].messages : [],
        inputText: inputText,
        onInputChange: setInputText,
        onSendMessage: handleSendMessage, 
        isSending: isSending,
        onRetryMessage: handleRetryMessage,
        sidebarOpen: sidebarOpen,
        toggleSidebar: toggleSidebar,
        onVoiceInputStart: handleVoiceInput,
        isListening: isListening,
        onImageFileSelectedForEdit: handleImageFileSelectedForEdit, 
        imageToEditPreviewUrl: imageToEdit?.previewUrl,
        onClearImageToEdit: clearImageToEdit,
        onImageSelectedForSend: handleImageFileSelectedForSend,
        imagePreviewForSendUrl: imageToSend?.previewUrl,
        onClearImageToSend: clearImageToSend,
        scrollToMessageId: scrollToMessageId,
        onScrollToMessageComplete: handleScrollToMessageComplete,
        onImageClick: handleOpenImageFullScreen,
      }),
      fullScreenImageUrl && React.createElement(ImageFullScreenView, { 
        imageUrl: fullScreenImageUrl, 
        onClose: handleCloseImageFullScreen,
        altText: "Image preview" 
      })
    )
  );
};

export default App;