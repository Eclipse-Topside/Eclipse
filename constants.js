import React from 'react';

export const SuggestionType = {
  CREATE_IMAGE: 'CREATE_IMAGE',
  EDIT_IMAGE: 'EDIT_IMAGE',
  LATEST_NEWS: 'LATEST_NEWS',
  PERSONAS: 'PERSONAS',
  BRAINSTORM: 'BRAINSTORM',
  SUMMARIZE_TEXT: 'SUMMARIZE_TEXT',
  GET_ADVICE: 'GET_ADVICE',
  MAKE_A_PLAN: 'MAKE_A_PLAN',
};

export const IconMenu = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" })
  )
);

export const IconPencilSquare = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" })
  )
);

export const IconSparkles = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.875 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09l2.846.813-.813 2.846a4.5 4.5 0 0 0-3.09 3.09ZM18.25 7.5l.813-2.846a.75.75 0 0 0-1.06-1.06L15.156 5.25l-.813 2.846a.75.75 0 0 0 1.06 1.06l2.846.813-.813 2.846a.75.75 0 0 0 1.06 1.06l2.846-.813.813-2.846a.75.75 0 0 0-1.06-1.06L18.25 7.5Z" })
  )
);

// IconBan is used as the main App Logo (Ø symbol)
export const IconBan = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" }),
    React.createElement('circle', { cx: "12", cy: "12", r: "9", strokeLinecap: "round", strokeLinejoin: "round" })
  )
);

export const IconSearch = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" })
  )
);

export const IconClock = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" })
  )
);

export const IconCube = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" })
  )
);

// Icon for collapsing sidebar (e.g., <-|)
export const IconCollapseSidebar = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 19.5 3 12m0 0 7.5-7.5M3 12h13.5M16.5 3v18" })
  )
);

// Icon for expanding sidebar (e.g., |->)
export const IconExpandSidebar = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "m13.5 4.5 7.5 7.5-7.5 7.5M21 12H7.5M7.5 3v18" })
  )
);


export const IconChevronDown = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "m19.5 8.25-7.5 7.5-7.5-7.5" })
  )
);

export const IconPlus = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" })
  )
);

export const IconBolt = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" })
  )
);

export const IconArrowUp = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" })
  )
);

export const IconMicrophone = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" })
  )
);

export const IconPhoto = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.225.225 0 0 1 .225.225V8.7a.225.225 0 0 1-.45 0V8.475a.225.225 0 0 1 .225-.225Z" })
  )
);

export const IconNewspaper = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25H5.625a2.25 2.25 0 0 1-2.25-2.25V7.125c0-.621.504-1.125 1.125-1.125H9M7.5 11.25h3M7.5 14.25h3" })
  )
);

export const IconUserCircle = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" })
  )
);

export const IconLightBulb = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 18a.75.75 0 0 0 .75-.75V11.382l6.993-2.621a.75.75 0 0 0 .421-1.019l-1.026-3.075a.75.75 0 0 0-1.019-.421L12 6.75Zm0 0a.75.75 0 0 1 .75.75v3.379M9.75 9.75c0-1.505 1.024-2.753 2.449-2.956M5.602 12.635a.75.75 0 0 0-1.13.14L3.13 15.39a.75.75 0 0 0 .14 1.13l2.844 1.422a.75.75 0 0 0 .99-.101l1.248-2.313a.75.75 0 0 0-.102-.99L5.602 12.635Zm7.646 5.603a.75.75 0 0 0 .14 1.13l1.342 2.615a.75.75 0 0 0 1.13-.14l1.422-2.844a.75.75 0 0 0-.101-.99l-2.313-1.248a.75.75 0 0 0-.99.102L13.248 18.238Z" })
  )
);

export const IconArrowPath = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" })
  )
);

export const IconXMark = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18 18 6M6 6l12 12" })
  )
);

export const IconDownload = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" })
  )
);

export const IconAdjustmentsHorizontal = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 6h9.75M10.5 6a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM10.5 6v1.5a2.25 2.25 0 1 0 4.5 0V6A2.25 2.25 0 1 0 10.5 6Zm0 9.75h9.75M10.5 15.75a2.25 2.25 0 1 0-4.5 0 2.25 2.25 0 0 0 4.5 0Zm0 0V14.25a2.25 2.25 0 1 1 4.5 0v1.5a2.25 2.25 0 1 1-4.5 0Z" }),
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 6h4.5M3.75 15.75h4.5" })
  )
);

export const IconAdjustmentsVertical = (props) => ( 
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 10.5V3.75m0 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm0 6.75V20.25m6-16.5V6.75m0 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm0 6.75V20.25m6-16.5V10.5m0 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm0 6.75V20.25" }),
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 10.5h4.5M10.5 6.75h4.5M17.25 10.5h4.5" })
  )
);

export const IconTrash = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0a48.108 48.108 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" })
  )
);

export const IconSpinner = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", ...props, className: `animate-spin ${props.className || ''}` },
    React.createElement('circle', { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
    React.createElement('path', { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
  )
);

export const IconArrowLeft = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" }) // Using ArrowLongLeft path
  )
);

export const IconShare = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" })
  )
);


export const SUGGESTIONS = [
  { id: SuggestionType.CREATE_IMAGE, label: 'Create Images', icon: IconPhoto, promptPrefix: '/image ' },
  { id: SuggestionType.EDIT_IMAGE, label: 'Edit Image', icon: IconPencilSquare, promptPrefix: 'Edit this image to ' },
  { id: SuggestionType.LATEST_NEWS, label: 'Latest News', icon: IconNewspaper, promptPrefix: 'What is the latest news about ' },
  { id: SuggestionType.PERSONAS, label: 'Personas', icon: IconUserCircle, promptPrefix: 'Act as a ', hasDropdown: true },
];

export const INPUT_BAR_BUTTONS_LEFT = [
    { id: 'deep_search', label: 'DeepSearch', icon: IconBolt, hasDropdown: true, action: () => console.log("DeepSearch clicked") },
    { id: 'think', label: 'Think', icon: IconLightBulb, action: () => console.log("Think clicked") },
];

export const MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
export const MODEL_IMAGE = 'imagen-3.0-generate-002';

export const SYSTEM_INSTRUCTION_ECLIPSE = "You are Eclipse, an AI assistant developed by Topside and owned by Nihal. Be helpful, concise, and friendly. When answering questions, use Google Search to provide current and relevant information.";
export const SYSTEM_INSTRUCTION_IMAGE_BOT = "You are an image generation assistant. When asked to generate an image, respond only with the image description, do not add any conversational fluff. For example, if asked 'a cat playing piano', respond 'a cat playing piano'.";
export const TITLE_GENERATION_PROMPT = "Based on the following first message, suggest a very short, concise title for this conversation (max 5 words). First message: ";

export const DEFAULT_CHAT_TITLE = "New Chat";