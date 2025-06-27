import React from 'react';

const SuggestionChip = ({ suggestion, onClick }) => {
  return (
    React.createElement('button',
      {
        onClick: () => onClick(suggestion),
        className: "flex items-center bg-eclipse-input-bg hover:bg-eclipse-hover-bg text-eclipse-text-secondary text-sm px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
      },
      React.createElement(suggestion.icon, { className: "w-4 h-4 mr-2" }),
      suggestion.label
    )
  );
};

export default SuggestionChip;