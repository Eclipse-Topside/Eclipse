import React, { useEffect } from 'react';
import IconButton from './IconButton';
import { IconXMark, IconDownload } from '../constants';

const ImageFullScreenView = ({ imageUrl, onClose, altText = "Full screen image" }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1) || 'generated-image.jpg';
    link.download = filename.startsWith("data:") ? "generated-image.jpg" : filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!imageUrl) return null;

  return (
    React.createElement('div', 
      { 
        className: "fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4",
        role: "dialog",
        'aria-modal': "true",
        'aria-labelledby': "fullscreen-image-title",
        onClick: onClose 
      },
      React.createElement('div', 
        { 
          className: "relative max-w-full max-h-full flex flex-col items-center",
          onClick: (e) => e.stopPropagation() 
        },
        React.createElement('img', {
          src: imageUrl,
          alt: altText,
          className: "block max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl",
          'aria-describedby': "fullscreen-image-description"
        }),
        React.createElement('div', { id: "fullscreen-image-title", className: "sr-only" }, altText),
        React.createElement('div', { id: "fullscreen-image-description", className: "sr-only" }, "Image in full screen view. Press Escape or click the close button to exit."),
        React.createElement('div', { className: "absolute top-0 right-0 m-2 flex space-x-2 md:m-4" },
            React.createElement(IconButton, {
                icon: React.createElement(IconDownload, { className: "w-6 h-6" }),
                onClick: handleDownload,
                label: "Download image",
                className: "bg-black/50 text-white hover:bg-black/75 p-2 rounded-full"
            }),
            React.createElement(IconButton, {
                icon: React.createElement(IconXMark, { className: "w-6 h-6" }),
                onClick: onClose,
                label: "Close full screen image view",
                className: "bg-black/50 text-white hover:bg-black/75 p-2 rounded-full"
            })
        )
      )
    )
  );
};

export default ImageFullScreenView;