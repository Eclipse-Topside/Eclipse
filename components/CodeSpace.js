import React, { useState } from 'react';
import IconButton from './IconButton';
import { IconPlay, IconClipboard, IconSpinner } from '../constants';

const CodeSpace = ({
  code,
  language,
  output,
  onRun,
  onLanguageChange,
  onCodeChange,
  isRunning,
}) => {
  const [copied, setCopied] = useState(false);
  const supportedLanguages = ['python', 'javascript', 'typescript', 'html', 'css', 'java', 'csharp', 'go', 'rust', 'shell', 'plaintext'];

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return React.createElement('div', {
    className: "flex-shrink-0 w-[45%] max-w-3xl bg-[#202123] border-l border-eclipse-border flex flex-col font-mono"
  },
    // Header
    React.createElement('header', {
      className: "flex items-center justify-between p-3 border-b border-eclipse-border"
    },
      React.createElement('h2', { className: "text-lg font-sans font-semibold text-eclipse-text-primary" }, "Code Space"),
      React.createElement('div', { className: "flex items-center space-x-2" },
        React.createElement('select', {
          value: language,
          onChange: e => onLanguageChange(e.target.value),
          className: "bg-eclipse-input-bg text-eclipse-text-secondary text-sm rounded-md p-1.5 border border-transparent focus:outline-none focus:ring-1 focus:ring-eclipse-accent"
        },
          supportedLanguages.map(lang => React.createElement('option', { key: lang, value: lang }, lang))
        ),
        React.createElement(IconButton, {
          icon: copied ? React.createElement('span', {className: 'text-xs text-green-400'}, 'Copied!') : React.createElement(IconClipboard, { className: "w-5 h-5" }),
          label: "Copy code",
          onClick: handleCopy,
          className: "text-eclipse-text-secondary hover:text-eclipse-text-primary"
        }),
        React.createElement('button', {
          onClick: onRun,
          disabled: isRunning,
          className: "flex items-center bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white text-sm font-sans font-semibold px-4 py-1.5 rounded-md transition-colors"
        },
          isRunning
            ? React.createElement(IconSpinner, { className: "w-4 h-4 mr-2" })
            : React.createElement(IconPlay, { className: "w-4 h-4 mr-2" }),
          "Run"
        )
      )
    ),
    // Code Editor
    React.createElement('div', { className: 'flex-1 flex flex-col overflow-hidden relative' },
      React.createElement('textarea', {
        value: code,
        onChange: e => onCodeChange(e.target.value),
        spellCheck: "false",
        className: "flex-1 w-full p-4 bg-transparent text-eclipse-text-primary resize-none focus:outline-none text-sm leading-relaxed custom-scrollbar",
        placeholder: "// Your code will appear here..."
      }),
      React.createElement('div', {className: 'absolute top-2 right-4 text-xs text-gray-500 uppercase'}, language)
    ),
    // Output/Terminal
    React.createElement('div', { className: "h-[35%] border-t border-eclipse-border flex flex-col" },
      React.createElement('div', { className: 'px-4 py-2 text-sm text-eclipse-text-secondary border-b border-eclipse-border'}, 'Output'),
      React.createElement('pre', {
        className: "flex-1 p-4 text-sm text-eclipse-text-secondary overflow-y-auto custom-scrollbar"
      },
        React.createElement('code', null, output)
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
  );
};

export default CodeSpace;
