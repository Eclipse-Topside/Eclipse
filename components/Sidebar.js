






import React, { useState, useEffect } from 'react';
import { 
  IconSearch, 
  IconArrowPath, 
  IconClock, 
  IconCube, 
  IconMenu, 
  IconCollapseSidebar,
  IconExpandSidebar,
  IconPencilSquare, 
  IconTrash,
  IconPhoto,
  IconArrowLeft,
  IconShare,
  IconSun,
  IconMoon,
  IconCodeBracket,
  IconDownload,
  IconArrowsPointingOut
} from '../constants';
import UserAvatar from './UserAvatar';
import IconButton from './IconButton';
import { DEFAULT_CHAT_TITLE } from '../constants';


const NavItem = ({ icon, label, isActive, onClick, isOpen, isHeading, className = '' }) => {
  const showIcon = !(isOpen && isHeading); 

  return (
    React.createElement('button', {
      onClick: onClick,
      className: `flex items-center w-full h-10 px-3 py-2 my-0.5 rounded-md transition-colors
        ${isActive ? 'bg-eclipse-active-bg text-eclipse-text-primary font-medium' : 'text-eclipse-text-secondary hover:bg-eclipse-hover-bg hover:text-eclipse-text-primary'}
        ${isHeading ? 'text-eclipse-text-primary font-semibold mt-2 mb-1 cursor-default hover:bg-transparent' : ''}
        ${!isOpen ? 'justify-center' : ''} ${className}`,
      title: isOpen ? undefined : label,
      disabled: isHeading && isOpen, 
      'aria-current': isActive ? 'page' : undefined,
    },
      showIcon && React.createElement('div', { className: `flex-shrink-0 w-5 h-5 ${(isOpen && !isHeading) ? 'mr-3' : ''}` }, icon),
      isOpen && React.createElement('span', { className: `truncate text-sm ${isHeading ? 'font-semibold' : ''}` }, label)
    )
  );
};


const Sidebar = ({ 
  theme,
  toggleTheme,
  isOpen, 
  toggleSidebar,
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onEditChatTitle,    
  onDeleteChat,
  imageLibrary,
  onSelectImageFromLibrary,
  onDeleteImageFromLibrary,
  onShareImageFromLibrary,
  onDownloadImageFromLibrary,
  isCodeSpaceActive,
  onToggleCodeSpace,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('chats'); // 'chats' or 'images'

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm(''); 
    }
  }, [isOpen]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const sortedChats = [...chats].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const filteredChats = searchTerm
    ? sortedChats.filter(chat =>
        (chat.title || DEFAULT_CHAT_TITLE).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sortedChats;
  
  const sortedImageLibrary = [...(imageLibrary || [])].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Max height calculations based on known fixed elements' heights
  // Approx: Logo(48+12) + Search(36+12 if open) + UserAvatarSection(60+border) + NavItems.
  // This might need fine-tuning if heights of non-scrolling parts change significantly.
  const baseScreenHeightOffset = isOpen ? 200 : 180; // Base offset for logo, user info etc.
  const searchHeight = isOpen && currentView === 'chats' ? 48 : 0; // Search bar height + margin
  const navItemsHeightEstimate = isOpen ? (currentView === 'images' ? 80 : 200) : (currentView === 'images' ? 80 : 120) ; // Rough estimate

  // Fallback fixed values if calculation is too complex or for simplicity
  const listMaxHeightExpanded = 'max-h-[calc(100vh-220px)]'; // General expanded
  const listMaxHeightCollapsed = 'max-h-[calc(100vh-200px)]'; // General collapsed
  const imageListMaxHeightExpanded = 'max-h-[calc(100vh-180px)]'; // If fewer nav items in image view
  const imageListMaxHeightCollapsed = 'max-h-[calc(100vh-160px)]';


  return (
    React.createElement('div', { 
      className: `
        bg-eclipse-sidebar-bg text-eclipse-text-primary shadow-lg 
        flex flex-col 
        fixed inset-y-0 left-0 z-40 
        h-screen 
        transition-all duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 md:w-20'} 
        md:sticky md:top-0 
        md:translate-x-0 
        ${isOpen ? 'md:w-72' : 'md:w-20'}
      `
    },
      React.createElement('div', { className: "flex flex-col flex-grow p-3 overflow-y-hidden" }, // Main container for sidebar content
        React.createElement('div', { className: `flex items-center ${isOpen ? 'justify-start px-1' : 'justify-center'} h-12 mb-3` },
          React.createElement('img', { 
            src: './eclipsepro.png', 
            alt: 'Eclipse AI Logo', 
            className: `w-8 h-8 rounded-full object-cover transition-all duration-300 ${isOpen ? 'transform scale-100' : 'transform scale-90'}` 
          })
        ),

        isOpen && currentView === 'chats' && (
          React.createElement('div', { className: "relative mb-3 px-1" },
            React.createElement('div', { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" },
              React.createElement(IconSearch, { className: "w-4 h-4 text-eclipse-text-secondary" })
            ),
            React.createElement('input', {
              type: "text",
              placeholder: "Search chats... Ctrl+K",
              value: searchTerm,
              onChange: handleSearchChange,
              className: "w-full bg-eclipse-input-bg text-eclipse-text-primary placeholder-eclipse-text-secondary text-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-eclipse-accent"
            })
          )
        ),
        !isOpen && currentView === 'chats' && ( 
          React.createElement(NavItem, { 
            icon: React.createElement(IconSearch, { className: "w-5 h-5" }), 
            label: "Search", 
            onClick: () => { if (toggleSidebar) toggleSidebar(); }, 
            isOpen: isOpen, 
            className: "mb-1"
          })
        ),
        
        React.createElement('nav', { className: "flex-grow flex flex-col overflow-y-hidden" }, 
          React.createElement('div', {className: "space-y-0.5"}, // NavItems container
            currentView === 'images' ? (
                React.createElement(React.Fragment, null,
                    React.createElement(NavItem, { 
                        icon: React.createElement(IconArrowLeft, { className: "w-5 h-5" }), 
                        label: "Back to Chats", 
                        onClick: () => setCurrentView('chats'), 
                        isOpen: isOpen, 
                    }),
                    React.createElement(NavItem, { 
                        icon: React.createElement(IconPhoto, { className: "w-5 h-5" }), 
                        label: "Image Library", 
                        onClick: () => {}, // No-op, it's the current view
                        isOpen: isOpen,
                        isActive: true,
                        isHeading: isOpen, // Treat as a title when open
                        className: isOpen ? 'text-eclipse-text-primary' : ''
                    })
                )
            ) : ( // currentView === 'chats'
                React.createElement(React.Fragment, null,
                    React.createElement(NavItem, { 
                        icon: React.createElement(IconArrowPath, { className: "w-5 h-5" }), 
                        label: "Chat", 
                        onClick: () => { onNewChat(); setCurrentView('chats'); }, 
                        isOpen: isOpen, 
                        isActive: currentView === 'chats' && !activeChatId && !isCodeSpaceActive && (!chats.find(c => c.id === activeChatId) || chats.find(c => c.id === activeChatId)?.messages.length === 0) 
                    }),
                    React.createElement(NavItem, { 
                        icon: React.createElement(IconPhoto, { className: "w-5 h-5" }), 
                        label: "Image Library", 
                        onClick: () => setCurrentView('images'), 
                        isOpen: isOpen,
                        isActive: false // currentView is 'chats' here
                    }),
                    React.createElement(NavItem, { icon: React.createElement(IconClock, { className: "w-5 h-5" }), label: "Tasks", onClick: () => alert("Tasks clicked (placeholder)"), isOpen: isOpen }),
                    React.createElement(NavItem, { icon: React.createElement(IconCube, { className: "w-5 h-5" }), label: "Workspaces", onClick: () => alert("Workspaces clicked (placeholder)"), isOpen: isOpen }),
                    React.createElement(NavItem, { 
                        icon: React.createElement(IconCodeBracket, { className: "w-5 h-5" }), 
                        label: "Code Space", 
                        onClick: onToggleCodeSpace, 
                        isOpen: isOpen,
                        isActive: isCodeSpaceActive,
                    }),
                    React.createElement(NavItem, { icon: React.createElement(IconMenu, { className: "w-5 h-5" }), label: "History", isOpen: isOpen, isHeading: true })
                )
            )
          ),
          
          // Scrollable content area
          React.createElement('div', { 
            className: `flex-grow overflow-y-auto custom-scrollbar 
                       ${currentView === 'images' ? (isOpen ? imageListMaxHeightExpanded + ' p-2' : imageListMaxHeightCollapsed + ' pt-1') : (isOpen ? listMaxHeightExpanded : listMaxHeightCollapsed)}`
            },
            currentView === 'chats' && React.createElement(React.Fragment, null,
              isOpen && searchTerm && filteredChats.length === 0 && React.createElement('p', { className: "text-xs text-eclipse-text-secondary px-2 py-1 text-center" }, `No chats match "${searchTerm}".`),
              isOpen && !searchTerm && sortedChats.length === 0 && React.createElement('p', { className: "text-xs text-eclipse-text-secondary px-2 py-1 text-center" }, "No chats yet."),
              React.createElement('ul', {className: `${!isOpen ? 'mt-1' : ''}`}, // Added margin for collapsed indicators
                filteredChats.map(chat => (
                  React.createElement('li', { 
                      key: chat.id,
                      className: `group flex items-center justify-between w-full h-9 rounded-md transition-colors
                                  ${activeChatId === chat.id ? 'bg-eclipse-active-bg' : 'hover:bg-eclipse-hover-bg'}`
                  },
                    React.createElement('button', {
                      onClick: () => onSelectChat(chat.id),
                      title: chat.title || DEFAULT_CHAT_TITLE,
                      'aria-current': activeChatId === chat.id ? 'page' : undefined,
                      className: `flex-grow h-full px-3 py-2 truncate text-sm 
                                  ${activeChatId === chat.id ? 'text-eclipse-text-primary font-medium' : 'text-eclipse-text-secondary group-hover:text-eclipse-text-primary'}
                                  ${!isOpen ? 'justify-center' : 'text-left'}`
                    },
                      isOpen ? (
                        React.createElement('span', { className: "truncate" }, chat.title || DEFAULT_CHAT_TITLE)
                      ) : (
                        React.createElement('span', { className: `w-1.5 h-1.5 rounded-full ${activeChatId === chat.id ? 'bg-eclipse-accent' : 'bg-eclipse-text-secondary'}`})
                      )
                    ),
                    isOpen && React.createElement('div', { className: "flex-shrink-0 flex items-center pr-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity" },
                      React.createElement(IconButton, {
                        icon: React.createElement(IconPencilSquare, { className: "w-4 h-4 text-eclipse-text-secondary hover:text-eclipse-text-primary" }),
                        label: "Edit chat name",
                        onClick: (e) => { e.stopPropagation(); onEditChatTitle(chat.id, chat.title || DEFAULT_CHAT_TITLE); },
                        className: "p-1 hover:bg-eclipse-input-bg" 
                      }),
                      React.createElement(IconButton, {
                        icon: React.createElement(IconTrash, { className: "w-4 h-4 text-eclipse-text-secondary hover:text-red-500" }),
                        label: "Delete chat",
                        onClick: (e) => { e.stopPropagation(); onDeleteChat(chat.id); },
                        className: "p-1 hover:bg-eclipse-input-bg"
                      })
                    )
                  )
                ))
              )
            ),
            currentView === 'images' && React.createElement(React.Fragment, null,
              isOpen ? (
                sortedImageLibrary.length > 0 ? (
                  React.createElement('div', { className: "grid grid-cols-2 gap-2" }, 
                    sortedImageLibrary.map(img => (
                      React.createElement('div', {
                          key: img.messageId,
                          className: "group relative aspect-square bg-eclipse-input-bg rounded-md overflow-hidden",
                          title: `Prompt: ${img.promptText.substring(0, 100)}...`
                      },
                          React.createElement('img', {
                              src: img.imageUrl,
                              alt: `Generated image for: ${img.promptText.substring(0, 30)}...`,
                              className: "w-full h-full object-cover cursor-pointer",
                              onClick: () => onSelectImageFromLibrary(img.imageUrl)
                          }),
                          React.createElement('div', {
                              className: "absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2"
                          },
                              React.createElement('div', { className: "grid grid-cols-2 gap-2" },
                                  React.createElement(IconButton, {
                                      icon: React.createElement(IconArrowsPointingOut, { className: "w-5 h-5 text-white" }),
                                      label: "Full Screen",
                                      onClick: (e) => { e.stopPropagation(); onSelectImageFromLibrary(img.imageUrl); },
                                      className: "p-2 hover:bg-black/75 rounded-lg"
                                  }),
                                  React.createElement(IconButton, {
                                      icon: React.createElement(IconShare, { className: "w-5 h-5 text-white" }),
                                      label: "Share image",
                                      onClick: (e) => { e.stopPropagation(); onShareImageFromLibrary(img.imageUrl, img.promptText); },
                                      className: "p-2 hover:bg-black/75 rounded-lg"
                                  }),
                                  React.createElement(IconButton, {
                                      icon: React.createElement(IconDownload, { className: "w-5 h-5 text-white" }),
                                      label: "Download image",
                                      onClick: (e) => { e.stopPropagation(); onDownloadImageFromLibrary(img.imageUrl); },
                                      className: "p-2 hover:bg-black/75 rounded-lg"
                                  }),
                                  React.createElement(IconButton, {
                                      icon: React.createElement(IconTrash, { className: "w-5 h-5 text-white" }),
                                      label: "Delete image",
                                      onClick: (e) => { e.stopPropagation(); onDeleteImageFromLibrary(img.messageId); },
                                      className: "p-2 hover:bg-red-500/75 rounded-lg"
                                  })
                              )
                          )
                      )
                    ))
                  )
                ) : (
                  React.createElement('p', { className: "text-xs text-eclipse-text-secondary px-2 py-1 text-center" }, "No images generated yet.")
                )
              ) : ( // Collapsed view for image library
                  React.createElement('p', { className: "text-xs text-eclipse-text-secondary px-1 py-1 text-center" }, 
                    `${sortedImageLibrary.length} image${sortedImageLibrary.length !== 1 ? 's' : ''}`
                  )
              )
            )
          )
        )
      ),
      React.createElement('div', { className: "p-3 border-t border-eclipse-border" },
        isOpen ? (
          // Expanded view
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement(UserAvatar, { name: "Eclipse", size: "sm", bgColorClassName: "bg-teal-500" }),
            React.createElement('div', { className: 'flex items-center space-x-1' },
              React.createElement(IconButton, {
                icon: theme === 'light' 
                  ? React.createElement(IconMoon, { className: "w-5 h-5 text-eclipse-text-secondary" }) 
                  : React.createElement(IconSun, { className: "w-5 h-5 text-eclipse-text-secondary" }),
                onClick: toggleTheme,
                label: `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`,
                className: "hover:text-eclipse-text-primary"
              }),
              React.createElement(IconButton, { 
                icon: React.createElement(IconCollapseSidebar, { className: "w-5 h-5 text-eclipse-text-secondary" }), 
                onClick: toggleSidebar, 
                label: "Collapse sidebar",
                className: "hover:text-eclipse-text-primary" 
              })
            )
          )
        ) : (
          // Collapsed view
          React.createElement('div', { className: 'flex flex-col items-center space-y-2' },
            React.createElement(UserAvatar, { name: "Eclipse", size: "md", bgColorClassName: "bg-teal-500" }),
            React.createElement(IconButton, {
              icon: theme === 'light' 
                ? React.createElement(IconMoon, { className: "w-5 h-5 text-eclipse-text-secondary" }) 
                : React.createElement(IconSun, { className: "w-5 h-5 text-eclipse-text-secondary" }),
              onClick: toggleTheme,
              label: `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`,
              className: "hover:text-eclipse-text-primary"
            }),
            React.createElement(IconButton, { 
              icon: React.createElement(IconExpandSidebar, { className: "w-5 h-5 text-eclipse-text-secondary" }), 
              onClick: toggleSidebar, 
              label: "Expand sidebar",
              className: "hover:text-eclipse-text-primary" 
            })
          )
        )
      ),
      React.createElement('style', null, `
        .custom-scrollbar::-webkit-scrollbar {
          width: ${isOpen ? '6px' : '3px'};
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4A4A4F;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `)
    )
  );
};

export default Sidebar;