export interface Task {
    uuid: string;
    title: string;
    description?: string;
    date?: string;
    score: number;
    done: boolean;
}