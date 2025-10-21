
const DEPLOY_API="https://68d69d40-72ab-4896-bc17-b3c190219391-dev.e1-us-east-azure.choreoapis.dev/assignment-moderation/backend/v1.0"

export function getApiBaseUrl() {
    return import.meta.env.VITE_API_URL ?  import.meta.env.VITE_API_URL : DEPLOY_API;
}