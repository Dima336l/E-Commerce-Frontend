// API Configuration
// This file centralizes API URLs for easy deployment configuration

// Determine the API base URL based on environment
// In production (GitHub Pages), this will be set to the deployed backend URL
// In development, it uses localhost

const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     (import.meta.env.PROD 
                       ? 'https://e-commerce-backend-w46y.onrender.com'  // Deployed backend URL
                       : 'http://localhost:3000')

export { API_BASE_URL }

