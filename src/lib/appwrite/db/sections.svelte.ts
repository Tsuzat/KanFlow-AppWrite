import { AppwriteException, Query, type Models } from 'appwrite';
import type { Board } from './boards.svelte';
import { databases, ID } from '..';
import { PUBLIC_DATABASE_ID, PUBLIC_SECTIONS_TABLE_ID } from '$env/static/public';
import { toast } from 'svelte-sonner';
import { getContext, setContext } from 'svelte';

export enum Status {
	Active = 'active',
	InReview = 'inreview',
	Completed = 'completed',
	Archived = 'archived'
}

/**
 * Section Interface which extends the Appwrite Document interface with following properties
 * @property {string} name - Section name
 * @property {string} color - Section color
 * @property {number} order - Section order
 * @property {Status} status - Section status
 * @property {Board} board - Board
 */
export interface Section extends Models.DefaultRow {
	name: string;
	color?: string;
	order: number;
	status?: Status;
	board: Board | string;
}

class Sections {
	#sections = $state<Section[]>([]);

	get sections() {
		return this.#sections;
	}

	async fetch(boardId: string) {
		try {
			const res = await databases.listRows<Section>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: PUBLIC_SECTIONS_TABLE_ID,
				queries: [Query.equal('board', boardId)]
			});
			this.#sections = res.rows;
		} catch (error) {
			//! TODO: Add error logging here
			console.error(error);
			if (error instanceof AppwriteException) {
				toast.error(error.message);
			} else {
				toast.error('Something went wrong');
			}
		}
	}

	async create(section: Partial<Section> & { name: string; board: string }): Promise<boolean> {
		try {
			const res = await databases.createRow<Section>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: PUBLIC_SECTIONS_TABLE_ID,
				rowId: ID.unique(),
				data: section
			});
			this.#sections = [...this.#sections, res];
			return true;
		} catch (error) {
			console.error(error);
			if (error instanceof AppwriteException) {
				toast.error(error.message);
			} else {
				toast.error('Something went wrong');
			}
			return false;
		}
	}

	async delete(sectionId: string) {
		toast.promise(
			databases.deleteRow({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: PUBLIC_SECTIONS_TABLE_ID,
				rowId: sectionId
			}),
			{
				loading: 'Deleting section',
				success: () => {
					this.#sections = this.#sections.filter((s) => s.$id !== sectionId);
					return 'Deleted Successfully';
				},
				error: (err) => {
					//! TODO: Add Logger here
					console.error(err);
					if (err instanceof AppwriteException) return err.message;
					else return 'Something went wrong when deleting section';
				}
			}
		);
	}
}

const GLOBALSECTIONSKEY = Symbol('GLOBALSECTIONSKEY');

export const setSections = () => {
	return setContext(GLOBALSECTIONSKEY, new Sections());
};

export const useSections = () => {
	return getContext<ReturnType<typeof setSections>>(GLOBALSECTIONSKEY);
};
