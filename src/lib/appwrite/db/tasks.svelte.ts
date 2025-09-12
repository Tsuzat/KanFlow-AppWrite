import { AppwriteException, Query, type Models } from 'appwrite';
import type { Board } from './boards.svelte';
import type { Section } from './sections.svelte';
import { getContext, setContext } from 'svelte';
import { databases, ID } from '..';
import { toast } from 'svelte-sonner';
import { PUBLIC_DATABASE_ID, PUBLIC_TASKS_TABLE_ID } from '$env/static/public';

export enum Priority {
	Low = 'low',
	Medium = 'medium',
	High = 'high'
}

/**
 * Task Interface which extends the Appwrite Row interface with following properties
 * @property {string} name - Card name
 * @property {string} description - Card description
 * @property {Board} board_id - Board id
 * @property {Section} section_id - Section id
 * @property {string} due_date - Card due date
 * @property {number} order - Card order
 * @property {string[]} tags - Card tags
 * @property {CardPriority} priority - Card priority
 * @property {BoardStatus} status - Card status
 */
export interface Task extends Models.DefaultRow {
	name: string;
	description?: string;
	board: Board | string;
	section: Section | string;
	due_date?: string;
	order: string;
	tags?: string[];
	priority: Priority;
}

class Tasks {
	#tasks = $state<Task[]>([]);

	get tasks() {
		return this.#tasks;
	}

	async fetch(boardId: string) {
		try {
			const res = await databases.listRows<Task>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: PUBLIC_TASKS_TABLE_ID,
				queries: [Query.equal('board', boardId)]
			});
			this.#tasks = res.rows;
			console.log('TASKS = ', res);
		} catch (error) {
			//! TODO: Add logger for error
			console.error(error);
			if (error instanceof AppwriteException) {
				toast.error(error.message);
			} else {
				toast.error('Something went wrong when fetching tasks for board');
			}
		}
	}

	async create(
		task: Partial<Task> & {
			name: string;
			board: string;
			section: string;
			order: string;
			priority: Priority;
		}
	) {
		try {
			const res = await databases.createRow<Task>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: PUBLIC_TASKS_TABLE_ID,
				rowId: ID.unique(),
				data: task
			});
			this.#tasks = [...this.#tasks, res];
		} catch (error) {
			//! TODO: Add logger for error
			console.error(error);
			if (error instanceof AppwriteException) {
				toast.error(error.message);
			} else {
				toast.error('Something went wrong when creating task');
			}
		}
	}

	async update(task: Task) {
		try {
			const res = await databases.updateRow<Task>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: PUBLIC_TASKS_TABLE_ID,
				rowId: task.$id,
				data: task
			});
			this.#tasks = this.#tasks.map((t) => (t.$id === task.$id ? res : t));
		} catch (error) {
			//! TODO: Add logger for error
			console.error(error);
			if (error instanceof AppwriteException) {
				toast.error(error.message);
			} else {
				toast.error('Something went wrong when updating task');
			}
		}
	}

	async delete(taskId: string) {
		toast.promise(
			databases.deleteRow({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: PUBLIC_TASKS_TABLE_ID,
				rowId: taskId
			}),
			{
				loading: 'Deleting the tasks',
				success: () => {
					this.#tasks = this.#tasks.filter((t) => t.$id !== taskId);
					return 'Deleted Task successfully';
				},
				error: (err) => {
					if (err instanceof AppwriteException) return err.message;
					else return 'Something went wrong when deleting task';
				}
			}
		);
	}
}

const GLOBALTASKSKEY = Symbol('GLOBALTASKSKEY');

export const setTasks = () => {
	return setContext(GLOBALTASKSKEY, new Tasks());
};

export const useTasks = () => {
	return getContext<ReturnType<typeof setTasks>>(GLOBALTASKSKEY);
};
