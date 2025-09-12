import { APPWRITE_API_KEY } from '$env/static/private';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';
import { Client, TablesDB } from 'node-appwrite';

const sdkClient = new Client()
	.setEndpoint(PUBLIC_APPWRITE_ENDPOINT) // Your API Endpoint
	.setProject(PUBLIC_APPWRITE_PROJECT_ID) // Your project ID
	.setKey(APPWRITE_API_KEY); // Your secret API key

export const sdkDB = new TablesDB(sdkClient);
