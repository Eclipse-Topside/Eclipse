import React from 'react';

const IconButton = ({ icon, label, className, ...props }) => {
  return (
    React.createElement('button',
      {
        'aria-label': label,
        className: `p-2 rounded-md hover:bg-eclipse-hover-bg focus:outline-none focus:ring-2 focus:ring-eclipse-accent ${className}`,
        ...props
      },
      icon
    )
  );
};

export default IconButton;