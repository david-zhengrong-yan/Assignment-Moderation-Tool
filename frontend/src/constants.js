const DEPLOY_API="https://assignment-moderation-tool.onrender.com"
export function getApiBaseUrl() {
    return import.meta.env.VITE_API_URL ?  import.meta.env.VITE_API_URL : DEPLOY_API;
}