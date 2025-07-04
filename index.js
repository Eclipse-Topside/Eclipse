import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-eclipse-sidebar-bg p-8 rounded shadow text-eclipse-text-primary">
        <h1 className="text-2xl font-bold mb-4">Eclipse AI Chat</h1>
        <p className="text-eclipse-text-secondary">Your app is running with local node modules!</p>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);

"scripts": {
  "dev": "vite"
}