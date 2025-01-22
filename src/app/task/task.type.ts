export interface Task {
    id: number;
    title: string;
    description?: string;
    date?: string;
    score: number;
    done: boolean;
}