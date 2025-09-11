import { toast } from 'svelte-sonner';
import { account } from '.';
import { invalidateAll } from '$app/navigation';
import { OAuthProvider } from 'appwrite';
import { PUBLIC_FRONTEND_URL } from '$env/static/public';

export function signInWithGoogle() {
	account.createOAuth2Token({
		provider: OAuthProvider.Google,
		success: `${PUBLIC_FRONTEND_URL}/verify`,
		failure: `${PUBLIC_FRONTEND_URL}/failed`
	});
}

export function signInWithGithub() {
	account.createOAuth2Token({
		provider: OAuthProvider.Github,
		success: `${PUBLIC_FRONTEND_URL}/verify`,
		failure: `${PUBLIC_FRONTEND_URL}/failed`
	});
}

export async function signOut() {
	const id = toast.loading('Signing out...');
	await account.deleteSessions();
	await invalidateAll();
	toast.success('Signed out successfully', { id });
	window.location.replace('/');
}

export async function createSessionWithIDAndScrete(userId: string, secret: string) {
	await account.createSession({
		userId,
		secret
	});
}
