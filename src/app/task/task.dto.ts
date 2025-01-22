export interface TaskCreateDTO {
    title: string;
    description?: string;
    date?: string;
    score: number;
    done: boolean;
}

export interface TaskUpdateDTO extends TaskCreateDTO {
    uuid: string;
}