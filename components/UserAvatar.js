import React from 'react';

const UserAvatar = ({ name, size = 'md', className, bgColorClassName }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const background = bgColorClassName || 'bg-eclipse-accent';

  return (
    React.createElement('div',
      {
        className: `flex items-center justify-center rounded-full ${background} text-white font-semibold ${sizeClasses[size]} ${className}`,
        title: name
      },
      initial
    )
  );
};

export default UserAvatar;