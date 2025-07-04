







import React, { useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestionChip from './SuggestionChip';
import UserAvatar from './UserAvatar';
import IconButton from './IconButton';
import ImageFullScreenView from './ImageFullScreenView';
import { IconMenu, SUGGESTIONS, SuggestionType } from '../constants';

const ChatArea = ({
  activeChat,
  messages,
  inputText,
  onInputChange,
  onSendMessage,
  isSending,
  onRetryMessage,
  sidebarOpen,
  toggleSidebar,
  onVoiceInputStart,
  isListening,
  onImageFileSelectedForEdit, 
  imageToEditPreviewUrl, 
  onClearImageToEdit, 
  onImageSelectedForSend,
  imagePreviewForSendUrl,
  onClearImageToSend,
  scrollToMessageId,
  onScrollToMessageComplete,
  onImageClick,
  selectedTool,
  onSelectTool,
  onClearTool,
  isCodeSpaceActive,
  onCopyText,
  onFeedback,
  onRegenerate,
  onEditPrompt,
  onSpeak,
  speakingMessageId,
  onStopSpeaking,
  onShare,
  onEditUserMessage,
}) => {
  const messagesEndRef = useRef(null);
  const imageEditFileInputRef = useRef(null); 
  const chatMessagesContainerRef = useRef(null);

  useEffect(() => {
    if (!scrollToMessageId && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, scrollToMessageId]); // Rerun if messages change and not targeting a specific message

  useEffect(() => {
    if (scrollToMessageId && chatMessagesContainerRef.current) {
      const messageElement = chatMessagesContainerRef.current.querySelector(`#message-item-${scrollToMessageId}`);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a highlight or visual cue if desired
        messageElement.classList.add('ring-2', 'ring-eclipse-accent', 'rounded-md', 'transition-all', 'duration-300', 'ease-in-out');
        setTimeout(() => {
            messageElement.classList.remove('ring-2', 'ring-eclipse-accent', 'rounded-md');
        }, 2000); // Remove highlight after 2 seconds
        onScrollToMessageComplete();
      } else {
        // If element not found immediately (e.g. messages still loading), try scrolling to end as fallback
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        onScrollToMessageComplete(); // Still call complete
      }
    }
  }, [scrollToMessageId, messages, onScrollToMessageComplete]);


  const handleSuggestionClick = (suggestion) => {
    if (suggestion.id === SuggestionType.EDIT_IMAGE) {
      imageEditFileInputRef.current?.click(); 
      return;
    }
    
    if (suggestion.hasDropdown) {
        alert(`${suggestion.label} dropdown functionality to be implemented!`);
        if (suggestion.promptPrefix) onInputChange(suggestion.promptPrefix); 
        return;
    }

    const fullPrompt = `${suggestion.promptPrefix || ''}${inputText || ''}`; 
    if (suggestion.id === SuggestionType.CREATE_IMAGE && (!inputText && !suggestion.promptPrefix.includes(inputText))) {
      onSendMessage(suggestion.promptPrefix + "a vibrant abstract scene", suggestion.id);
    } else {
      onSendMessage(fullPrompt, suggestion.id);
    }
  };
  
  const handleSend = () => {
    if (inputText.trim() || imagePreviewForSendUrl || (imageToEditPreviewUrl && inputText.includes("Edit this image"))) { 
      onSendMessage(inputText.trim());
    }
  };
  
  const currentMessages = activeChat ? activeChat.messages : messages;
  const displayedSuggestions = SUGGESTIONS; 

  const messageElements = [];
  if (currentMessages.length === 0 && !isSending && !imagePreviewForSendUrl && !imageToEditPreviewUrl) { 
    messageElements.push(
      React.createElement('div', { key: 'empty-chat', className: "flex flex-col items-center justify-center h-full text-center" },
        React.createElement('img', { src: './eclipsepro.png', alt: 'Eclipse AI Logo', className: "w-16 h-16 rounded-full mb-4" }),
        React.createElement('h2', { className: "text-3xl font-semibold text-eclipse-text-primary mb-2" }, "Eclipse"),
        React.createElement('p', { className: "text-lg text-eclipse-text-secondary mb-6" }, "How can I help you today?")
      )
    );
  } else {
    currentMessages.forEach((msg) => {
      // Wrap ChatMessage in a div with an ID for scrolling
      messageElements.push(
        React.createElement('div', { key: msg.id, id: `message-item-${msg.id}`, className: "py-1" }, // Added wrapper with ID
          React.createElement(ChatMessage, { 
            message: msg, 
            onRetry: activeChat && msg.isError ? () => onRetryMessage(activeChat.id, msg.id) : undefined, 
            onImageClick: (msg.imageUrl || msg.uploadedImageUrl) ? onImageClick : undefined,
            isCodeSpaceActive: isCodeSpaceActive,
            onCopy: onCopyText,
            onFeedback: (messageId, feedbackType) => onFeedback(activeChat.id, messageId, feedbackType),
            onRegenerate: (messageId) => onRegenerate(activeChat.id, messageId),
            onEdit: (messageId) => onEditPrompt(activeChat.id, messageId),
            onSpeak: (text) => onSpeak(text, msg.id),
            isSpeaking: speakingMessageId === msg.id,
            onStopSpeaking: onStopSpeaking,
            onShare: onShare,
            onEditUserMessage: (messageId) => onEditUserMessage(activeChat.id, messageId),
          })
        )
      );
    });
  }

  if (isSending && currentMessages.length > 0 && currentMessages[currentMessages.length -1].sender === 'user') {
    const lastUserMessage = currentMessages[currentMessages.length -1];
    const isLikelyImageResponse = (lastUserMessage.text && lastUserMessage.text.toLowerCase().startsWith('/image')) || lastUserMessage.uploadedImageUrl;
    if (!isLikelyImageResponse) { 
        const thinkingMessageId = 'thinking-msg';
        messageElements.push(
          React.createElement('div', { key: thinkingMessageId, id: `message-item-${thinkingMessageId}`, className: "py-1" },
            React.createElement(ChatMessage, { message: {id: thinkingMessageId, sender: 'ai', text: '', timestamp: new Date(), isLoading: true}})
          )
        );
    }
  }
  messageElements.push(React.createElement('div', { key: 'messages-end-ref', ref: messagesEndRef }));


  return (
    React.createElement('div', { className: "flex-1 flex flex-col h-screen overflow-hidden" },
      React.createElement('header', { className: "p-4 flex items-center justify-between border-b border-eclipse-border md:hidden" },
        React.createElement(IconButton, {
            icon: React.createElement(IconMenu, { className: "w-6 h-6 text-eclipse-text-primary" }),
            onClick: toggleSidebar,
            label: "Toggle sidebar"
        }),
        React.createElement('h1', { className: "text-lg font-semibold text-eclipse-text-primary" },
            activeChat ? activeChat.title : "Eclipse"
        ),
        React.createElement(UserAvatar, { name: "N", size: "md" }) 
      ),
      React.createElement('div', { className: "hidden md:flex items-center justify-end p-4 space-x-3 absolute top-0 right-0 z-10" },
        React.createElement(UserAvatar, { name: "N", size: "md" }) 
      ),
      React.createElement('main', { ref: chatMessagesContainerRef, className: "flex-1 overflow-y-auto p-4 md:pt-16 custom-scrollbar" },
        messageElements
      ),
      React.createElement('input', { 
        type: "file", 
        ref: imageEditFileInputRef, 
        onChange: onImageFileSelectedForEdit, 
        accept: "image/*", 
        style: { display: 'none' } 
      }),
      React.createElement('footer', { className: "p-3 md:p-6" },
         (currentMessages.length === 0 || (imageToEditPreviewUrl && !imagePreviewForSendUrl)) && !isSending && 
          React.createElement('div', { className: "flex flex-wrap gap-2.5 justify-center mb-3 max-w-2xl mx-auto" },
            displayedSuggestions.map((s) => (
              React.createElement(SuggestionChip, { key: s.id.toString(), suggestion: s, onClick: handleSuggestionClick })
            ))
          ),
        React.createElement(ChatInput, {
          value: inputText,
          onChange: onInputChange,
          onSend: handleSend,
          isSending: isSending,
          onVoiceInputStart: onVoiceInputStart,
          isListening: isListening,
          onImageSelected: onImageSelectedForSend,
          imagePreviewForSendUrl: imagePreviewForSendUrl,
          onClearImageToSend: onClearImageToSend,
          selectedTool: selectedTool,
          onSelectTool: onSelectTool,
          onClearTool: onClearTool,
        }),
         React.createElement('p', { className: "text-xs text-center text-eclipse-text-secondary mt-3" },
            "Eclipse can make mistakes. Consider checking important information."
        )
      ),
      React.createElement('style', null, `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4A4A4F;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `)
    )
  );
};

export default ChatArea;