import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';
import { Client, Account, Avatars, TablesDB } from 'appwrite';

export const client = new Client();

client.setEndpoint(PUBLIC_APPWRITE_ENDPOINT).setProject(PUBLIC_APPWRITE_PROJECT_ID);
export const account = new Account(client);
export { ID } from 'appwrite';
export const avatars = new Avatars(client);
export const databases = new TablesDB(client);

export const getUserInitals = (userName: string) => {
	try {
		const words = userName.split(' ');
		if (words.length > 1) {
			return words[0][0] + words[1][0];
		} else if (words.length === 1 && words[0].length > 1) {
			return words[0][0] + words[0][1];
		} else {
			return words[0][0];
		}
	} catch {
		return '?';
	}
};
