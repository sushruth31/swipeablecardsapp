// Create React App inlines REACT_APP_* at build time; a missing value silently
// becomes undefined, so assert it here and fail on the first import instead of
// letting the app render an empty board against "undefined/cards".
const apiUrl = process.env.REACT_APP_API_URL;

if (!apiUrl) {
  throw new Error("Missing REACT_APP_API_URL. Copy frontend/.env.example to frontend/.env and set it.");
}

export const cardsEndpoint = `${apiUrl.replace(/\/+$/, "")}/cards`;
