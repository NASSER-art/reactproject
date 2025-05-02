import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Configure head elements
document.title = "CineStream - Découvrez où regarder vos films et séries";

// Add Google Fonts link
const addFontLink = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Montserrat:wght@500;600;700;800&family=Poppins:wght@400;500;600&display=swap';
  document.head.appendChild(link);
};

// Add Remix icons
const addRemixIcons = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
  document.head.appendChild(link);
};

// Add favicon
const addFavicon = () => {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎬</text></svg>';
  document.head.appendChild(link);
};

// Add head elements
addFontLink();
addRemixIcons();
addFavicon();

createRoot(document.getElementById("root")!).render(<App />);
