import React, { useEffect, useState, useRef } from 'react';
import UserAvatar from './UserAvatar';
import IconButton from './IconButton';
import { 
  IconArrowPath, 
  IconDownload,
  IconDocumentDuplicate,
  IconHandThumbUp,
  IconHandThumbDown,
  IconSpeakerWave,
  IconSparkles,
  IconShare,
  IconCheck,
  IconStop,
  IconChevronDown,
  IconPencil,
} from '../constants'; 

// TYPING_SPEED_MS constant removed

const ChatMessage = ({ 
  message, 
  onRetry, 
  onImageClick, 
  isCodeSpaceActive,
  onCopy,
  onFeedback,
  onRegenerate,
  onEdit,
  onSpeak,
  isSpeaking,
  onStopSpeaking,
  onShare,
  onEditUserMessage,
}) => {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (message.text) {
      onCopy(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      onStopSpeaking();
    } else {
      onSpeak(message.text);
    }
  };
  
  const handleUserEdit = () => {
    if (onEditUserMessage) {
        onEditUserMessage(message.id);
    }
  };


  const formatText = (text) => {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/```([\s\S]*?)```/g, (_match, code) => {
        const lines = code.trim().split('\n');
        const language = lines[0].match(/^(python|javascript|typescript|html|css|json|bash|shell|java|csharp|cpp)/i) ? lines[0] : '';
        const actualCode = language ? lines.slice(1).join('\n') : code;
        return `<pre class="bg-eclipse-code-bg p-3 rounded-md my-2 overflow-x-auto text-sm"><code class="language-${language.toLowerCase()}">${actualCode.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
      })
      .replace(/`([^`]+)`/g, '<code class="bg-eclipse-code-bg px-1 py-0.5 rounded text-sm">$1</code>');
    return { __html: html };
  };

  const handleDownloadImage = (e, imageUrl) => {
    e.stopPropagation();
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1) || 'generated-image.jpg';
    link.download = filename.startsWith("data:") || filename.startsWith("blob:") ? "image.jpg" : filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const textForDisplay = message.text || ''; // Directly use message.text
  
  const messageContentElements = [];

  // Display user-uploaded image first if it exists
  if (isUser && message.uploadedImageUrl) {
    messageContentElements.push(
      React.createElement('div', { key: 'user-image-container', className: "mb-2 relative group" }, // mb-2 if there's text below
        React.createElement('img', { 
          src: message.uploadedImageUrl, 
          alt: "User uploaded content", 
          className: `rounded-lg max-w-xs md:max-w-sm ${onImageClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`,
          onClick: onImageClick && message.uploadedImageUrl ? () => onImageClick(message.uploadedImageUrl) : undefined,
          'aria-label': onImageClick ? "View image full screen" : "User uploaded image"
        }),
         // No download button for user's own uploaded images in their message bubble for now
      )
    );
  }
  
  // Display text content
  if (textForDisplay) {
    messageContentElements.push(React.createElement('div', { key: 'text', dangerouslySetInnerHTML: formatText(textForDisplay) }));
  }

  // Display AI-generated image if it exists
  if (isAI && message.imageUrl) {
    messageContentElements.push(
      React.createElement('div', { key: 'ai-image-container', className: "mt-2 relative group" },
        React.createElement('img', { 
          src: message.imageUrl, 
          alt: "AI generated content", 
          className: `rounded-lg max-w-xs md:max-w-sm ${onImageClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`,
          onClick: onImageClick && message.imageUrl ? () => onImageClick(message.imageUrl) : undefined,
          'aria-label': onImageClick ? "View image full screen" : "AI generated image"
        }),
        React.createElement(IconButton, {
          icon: React.createElement(IconDownload, { className: "w-5 h-5" }),
          label: "Download image",
          onClick: (e) => handleDownloadImage(e, message.imageUrl),
          className: "absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
        })
      )
    );
  }
  
  if (message.isLoading && isAI && messageContentElements.length === 0) { // Show thinking if no content yet
    messageContentElements.push(React.createElement('p', { key: 'thinking', className: "text-sm italic" }, "Eclipse is thinking..."));
  }

  if (message.isError) {
    messageContentElements.push(
      React.createElement('div', { key: 'error', className: "text-red-400 mt-2 text-sm" },
        React.createElement('p', null, message.text || "Sorry, something went wrong."), // Display error text if available
        onRetry && React.createElement('button', 
          { 
            onClick: () => onRetry(message.id), 
            className: "mt-1 text-red-300 hover:text-red-200 flex items-center underline"
          },
          React.createElement(IconArrowPath, { className: "w-4 h-4 mr-1" }),
          "Retry"
        )
      )
    );
  }

  if (isAI && !message.isLoading && !message.isError) {
    messageContentElements.push(
      React.createElement('div', { key: 'actions', className: 'flex items-center space-x-1 mt-3 -ml-2' },
        React.createElement(IconButton, {
          icon: copied ? React.createElement(IconCheck, { className: "w-5 h-5 text-green-500" }) : React.createElement(IconDocumentDuplicate, { className: "w-5 h-5" }),
          label: copied ? 'Copied!' : 'Copy',
          onClick: handleCopy,
          className: 'text-eclipse-text-secondary hover:text-eclipse-text-primary'
        }),
        React.createElement(IconButton, {
          icon: React.createElement(IconHandThumbUp, { className: `w-5 h-5 ${message.feedback === 'up' ? 'text-blue-500 fill-blue-500/20' : ''}` }),
          label: 'Good response',
          onClick: () => onFeedback(message.id, 'up'),
          className: 'text-eclipse-text-secondary hover:text-eclipse-text-primary'
        }),
        React.createElement(IconButton, {
          icon: React.createElement(IconHandThumbDown, { className: `w-5 h-5 ${message.feedback === 'down' ? 'text-red-500 fill-red-500/20' : ''}` }),
          label: 'Bad response',
          onClick: () => onFeedback(message.id, 'down'),
          className: 'text-eclipse-text-secondary hover:text-eclipse-text-primary'
        }),
        React.createElement(IconButton, {
          icon: isSpeaking ? React.createElement(IconStop, { className: "w-5 h-5" }) : React.createElement(IconSpeakerWave, { className: "w-5 h-5" }),
          label: isSpeaking ? 'Stop speaking' : 'Read aloud',
          onClick: handleToggleSpeak,
          className: 'text-eclipse-text-secondary hover:text-eclipse-text-primary'
        }),
        React.createElement(IconButton, {
          icon: React.createElement(IconSparkles, { className: "w-5 h-5" }),
          label: 'Edit prompt',
          onClick: () => onEdit(message.id),
          className: 'text-eclipse-text-secondary hover:text-eclipse-text-primary bg-eclipse-input-bg'
        }),
        React.createElement(IconButton, {
          icon: React.createElement(IconArrowPath, { className: "w-5 h-5" }),
          label: 'Regenerate',
          onClick: () => onRegenerate(message.id),
          className: 'text-eclipse-text-secondary hover:text-eclipse-text-primary'
        }),
        React.createElement(IconButton, {
          icon: React.createElement(IconShare, { className: "w-5 h-5" }),
          label: 'Share',
          onClick: () => onShare(message.text),
          className: 'text-eclipse-text-secondary hover:text-eclipse-text-primary'
        })
      )
    );
  } else if (isUser && !message.isError && (message.text || message.uploadedImageUrl)) {
      messageContentElements.push(
        React.createElement('div', { key: 'user-actions', className: 'flex items-center space-x-1 mt-2' },
          React.createElement(IconButton, {
            icon: copied ? React.createElement(IconCheck, { className: "w-5 h-5 text-green-400" }) : React.createElement(IconDocumentDuplicate, { className: "w-5 h-5" }),
            label: copied ? 'Copied!' : 'Copy',
            onClick: handleCopy,
            className: 'text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-lg'
          }),
          React.createElement(IconButton, {
            icon: React.createElement(IconPencil, { className: "w-5 h-5" }),
            label: 'Edit',
            onClick: handleUserEdit,
            className: 'text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-lg'
          }),
        )
      );
  }


  if (message.sources && message.sources.length > 0) {
    messageContentElements.push(
      React.createElement('div', { key: 'sources', className: "mt-3 pt-2 border-t border-eclipse-border/50" },
        React.createElement('p', { className: "text-xs text-eclipse-text-secondary mb-1" }, "Sources:"),
        React.createElement('ul', { className: "list-disc list-inside text-xs" },
          message.sources.map((source, index) => (
            React.createElement('li', { key: index },
              React.createElement('a', { href: source.uri, target: "_blank", rel: "noopener noreferrer", className: "text-blue-400 hover:underline" },
                source.title || source.uri
              )
            )
          ))
        )
      )
    );
  }
  
  // If there's no content at all (e.g. user sends only an image that hasn't loaded, or AI is purely loading)
  // this prevents an empty bubble, though usually isLoading or an image itself would be present.
  if (messageContentElements.length === 0 && !message.isLoading) {
      if (isUser && message.uploadedImageUrl) { 
        // This case should ideally be caught by the image rendering above.
        // If somehow it's missed, this is a fallback.
         messageContentElements.push(React.createElement('p', { key: 'image-placeholder', className: "text-sm italic" }, "[Image uploaded]"));
      } else {
         messageContentElements.push(React.createElement('p', { key: 'empty-placeholder', className: "text-sm italic" }, "..."));
      }
  }

  const bubbleClasses = isUser 
    ? `p-3 rounded-lg shadow-sm ${isCodeSpaceActive ? 'bg-zinc-800 text-gray-200' : 'bg-blue-600 text-white'}` 
    : 'text-eclipse-text-primary';

  return (
    React.createElement('div', { className: `py-4 px-2 md:px-0 flex ${isUser ? 'justify-end' : ''}` },
      React.createElement('div', { className: `flex items-start gap-3 w-full max-w-2xl mx-auto ${isUser ? 'flex-row-reverse' : ''}` },
        isAI && React.createElement('img', { 
            src: "./unnamed.png", 
            alt: "Eclipse AI Avatar",
            className: "flex-shrink-0 w-8 h-8 rounded-full object-cover" 
        }),
        isUser && React.createElement(UserAvatar, { name: "User", size: "md", className: "bg-blue-500" }),
        React.createElement('div', { 
          className: `${bubbleClasses} ${message.isLoading && isAI && !message.imageUrl && !textForDisplay ? 'animate-pulse' : ''}` // Ensure pulse only shows when truly loading and no text yet
         },
         messageContentElements
        )
      )
    )
  );
};

export default ChatMessage;