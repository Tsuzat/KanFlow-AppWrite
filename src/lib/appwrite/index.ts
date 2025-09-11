import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';
import { Client, Account } from 'appwrite';

export const client = new Client();

client.setEndpoint(PUBLIC_APPWRITE_ENDPOINT).setProject(PUBLIC_APPWRITE_PROJECT_ID);
export const account = new Account(client);
export { ID } from 'appwrite';
