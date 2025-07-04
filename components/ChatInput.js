import React, { useRef, useEffect, useState } from 'react';
import IconButton from './IconButton';
import { 
  IconMicrophone, 
  IconAdjustmentsHorizontal,
  IconPhoto, 
  IconXMark, 
  IconArrowUp,
  IconSpinner,
  TOOLS_MENU,
} from '../constants';

const ChatInput = ({
  value,
  onChange,
  onSend,
  isSending,
  onVoiceInputStart,
  isListening,
  onImageSelected,      
  imagePreviewForSendUrl, 
  onClearImageToSend,
  selectedTool,
  onSelectTool,
  onClearTool,
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsToolsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = 120; 
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
      if (textareaRef.current.scrollHeight > maxHeight) {
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, [value]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isSending && (value.trim() || imagePreviewForSendUrl)) { 
        onSend();
      }
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && onImageSelected) {
      onImageSelected(event);
    }
    if (event.target) {
        event.target.value = null;
    }
  };
  
  const sendButtonDisabled = isSending || (!value.trim() && !imagePreviewForSendUrl);
  const selectedToolConfig = selectedTool ? TOOLS_MENU.find(t => t.id === selectedTool) : null;

  return (
    React.createElement('div', { className: "w-full max-w-3xl mx-auto md:px-0" },
      React.createElement('div', { className: "flex flex-col bg-eclipse-input-bg rounded-3xl shadow-lg px-4 py-3 space-y-2.5" },
        imagePreviewForSendUrl && React.createElement('div', { className: "relative self-start mb-2" },
          React.createElement('img', { 
            src: imagePreviewForSendUrl, 
            alt: "Selected image preview", 
            className: "h-20 w-20 object-cover rounded-md border border-eclipse-border" 
          }),
          React.createElement(IconButton, {
            icon: React.createElement(IconXMark, { className: "w-4 h-4 text-white" }),
            label: "Remove image",
            onClick: onClearImageToSend,
            className: "absolute top-1 right-1 bg-black/60 hover:bg-black/80 p-1 rounded-full",
            disabled: isSending
          })
        ),
        React.createElement('textarea', {
          ref: textareaRef,
          value: value,
          onChange: (e) => onChange(e.target.value),
          onKeyDown: handleKeyDown,
          placeholder: "Ask anything, or upload an image...",
          className: "w-full bg-transparent text-eclipse-text-primary placeholder-eclipse-text-secondary resize-none focus:outline-none text-base custom-scrollbar flex-grow min-h-[48px] max-h-[120px]",
          rows: 1,
          disabled: isSending,
          style: { overflowY: 'hidden' }
        }),
        React.createElement('div', { className: "flex items-center justify-between" },
          React.createElement('div', { className: "flex items-center space-x-1" },
            React.createElement(IconButton, { 
              icon: React.createElement(IconPhoto, { className: "w-6 h-6" }),
              label: "Upload image",
              onClick: handleImageUploadClick,
              className: "text-eclipse-text-secondary hover:text-eclipse-text-primary p-1.5",
              disabled: isSending
            }),
            React.createElement('input', { 
              type: "file",
              ref: fileInputRef,
              accept: "image/*",
              onChange: handleFileChange,
              className: "hidden"
            }),
            React.createElement('div', { className: 'relative', ref: dropdownRef },
              !selectedToolConfig ? (
                  React.createElement('button', {
                      onClick: () => setIsToolsMenuOpen(prev => !prev),
                      disabled: isSending,
                      className: "flex items-center px-2 py-1.5 text-eclipse-text-secondary hover:text-eclipse-text-primary rounded-lg text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-eclipse-accent disabled:opacity-50",
                      'aria-label': "Tools"
                  },
                      React.createElement(IconAdjustmentsHorizontal, { className: "w-5 h-5 mr-1.5" }),
                      "Tools"
                  )
              ) : (
                  React.createElement('div', { className: "flex items-center pl-1 pr-2 py-1 bg-eclipse-active-bg/50 text-eclipse-text-secondary rounded-lg" },
                      React.createElement(IconButton, {
                          icon: React.createElement(IconAdjustmentsHorizontal, { className: "w-5 h-5" }),
                          label: "Tools",
                          onClick: () => setIsToolsMenuOpen(prev => !prev),
                          className: "p-1 hover:text-eclipse-text-primary"
                      }),
                      React.createElement('div', { className: "w-px h-4 bg-eclipse-border mx-1.5" }),
                      React.createElement('div', { className: "flex items-center" },
                          React.createElement(selectedToolConfig.icon, { className: "w-5 h-5 mr-1.5 text-blue-400" }),
                          React.createElement('span', { className: "text-sm font-medium text-eclipse-text-primary" }, selectedToolConfig.label),
                          React.createElement(IconButton, {
                              icon: React.createElement(IconXMark, { className: "w-4 h-4 text-eclipse-text-secondary" }),
                              label: `Clear tool: ${selectedToolConfig.label}`,
                              onClick: onClearTool,
                              className: "p-0.5 ml-1.5 rounded-full hover:bg-eclipse-hover-bg hover:text-eclipse-text-primary"
                          })
                      )
                  )
              ),
              isToolsMenuOpen && React.createElement('div', {
                  className: "absolute bottom-full mb-2 w-64 bg-eclipse-sidebar-bg rounded-lg shadow-xl border border-eclipse-border p-1 z-20"
              },
                  TOOLS_MENU.map(tool => (
                      React.createElement('button', {
                          key: tool.id,
                          onClick: () => { onSelectTool(tool.id); setIsToolsMenuOpen(false); },
                          className: "w-full flex items-center text-left p-2 rounded-md hover:bg-eclipse-hover-bg"
                      },
                          React.createElement(tool.icon, { className: "w-5 h-5 mr-3 text-eclipse-text-secondary" }),
                          React.createElement('span', { className: "text-sm text-eclipse-text-primary" }, tool.label)
                      )
                  ))
              )
            )
          ),
          React.createElement('div', { className: "flex items-center space-x-2" },
            React.createElement(IconButton, {
              icon: React.createElement(IconMicrophone, { className: `w-6 h-6 ${isListening ? 'text-red-500 animate-pulse' : 'text-eclipse-text-secondary hover:text-eclipse-text-primary'}` }),
              label: isListening ? "Stop listening" : "Use microphone",
              onClick: onVoiceInputStart,
              disabled: isSending,
              className: "p-1.5"
            }),
            React.createElement(IconButton, {
              icon: isSending ? React.createElement(IconSpinner, { className: "w-5 h-5" }) : React.createElement(IconArrowUp, { className: "w-5 h-5" }),
              label: "Send message",
              onClick: onSend,
              disabled: sendButtonDisabled,
              className: `p-2 rounded-full transition-colors ${sendButtonDisabled ? 'bg-eclipse-sidebar-bg text-gray-500 cursor-not-allowed' : 'bg-eclipse-hover-bg text-eclipse-text-primary hover:bg-eclipse-active-bg'}`
            })
          )
        )
      ),
      React.createElement('style', null, `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #666;
        }
      `)
    )
  );
};

export default ChatInput;