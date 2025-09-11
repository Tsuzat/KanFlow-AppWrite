import { AppwriteException, type Models } from 'appwrite';
import { getContext, setContext } from 'svelte';
import { databases, ID } from '..';
import { PUBLIC_BOARDS_TABLE_ID, PUBLIC_DATABASE_ID } from '$env/static/public';
import { toast } from 'svelte-sonner';

/**
 * Board Interface which extends the Appwrite Document interface with following properties
 * @property {string} icon - Board icon
 * @property {string} name - Board name
 * @property {string} description - Board description
 * @property {string} owner_id - Board owner id
 * @property {boolean} pinned - Board pinned status
 * @property {string[]} tags - Board tags
 */
export interface Board extends Models.Row {
	icon: string;
	name: string;
	description?: string;
	owner: string;
	pinned?: boolean;
	tags?: string[];
}

class Boards {
	#boards = $state<Board[]>([]);

	constructor(boards: Board[]) {
		this.#boards = boards;
	}
	get boards() {
		return this.#boards;
	}
	set boards(boards: Board[]) {
		this.#boards = boards;
	}

	async fetch() {
		try {
			const res = await databases.listRows<Board>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: PUBLIC_BOARDS_TABLE_ID
			});
			this.#boards = res.rows;
			console.log('BOARDS = ', this.#boards);
		} catch (error) {
			if (error instanceof AppwriteException) {
				//! TODO: Add a logger here
				toast.error(error.message);
			} else {
				toast.error('Something went wrong');
			}
		}
	}

	async create(
		board: Partial<Board> & { icon: string; name: string; owner: string }
	): Promise<boolean> {
		try {
			const res = await databases.createRow({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: PUBLIC_BOARDS_TABLE_ID,
				rowId: ID.unique(),
				data: board
			});
			const newBoard: Board = { ...board, ...res };
			this.boards = [...this.#boards, newBoard];
			return true;
		} catch (error) {
			if (error instanceof AppwriteException) {
				//! TODO: Add a logger here
				toast.error(error.message);
			} else {
				toast.error('Something went wrong');
			}
			return false;
		}
	}

	async delete(boardId: string) {
		toast.promise(
			databases.deleteRow({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: PUBLIC_BOARDS_TABLE_ID,
				rowId: boardId
			}),
			{
				loading: 'Deleting board...',
				success: () => {
					this.#boards = this.#boards.filter((b) => b.$id !== boardId);
					return 'Deleted Board Successfully';
				},
				error: (err) => {
					//! Add a logger here
					if (err instanceof AppwriteException) {
						return err.message;
					} else {
						return 'Something went wrong';
					}
				}
			}
		);
	}
	async update(board: Board) {
		try {
			const res = await databases.updateRow({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: PUBLIC_BOARDS_TABLE_ID,
				rowId: board.$id,
				data: board
			});
			const updatedBoard: Board = { ...board, ...res };
			this.boards = this.boards.map((b) => (b.$id === board.$id ? updatedBoard : b));
		} catch (error) {
			if (error instanceof AppwriteException) {
				//! TODO: Add a logger here
				toast.error(error.message);
			} else {
				toast.error('Something went wrong');
			}
		}
	}
}

const GLOBALBOARDID = Symbol('GLOBALBOARDID');

export const setBoards = (boards: Board[] = []) => {
	return setContext(GLOBALBOARDID, new Boards(boards));
};

export const useBoards = () => {
	return getContext<ReturnType<typeof setBoards>>(GLOBALBOARDID);
};
