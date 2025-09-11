import { account } from '$lib/appwrite';
import { redirect } from '@sveltejs/kit';

export const ssr = false;

export const load = async () => {
	try {
		const user = await account.get();
		return { user };
	} catch (err) {
		console.log(err);
		throw redirect(308, '/login');
	}
};
