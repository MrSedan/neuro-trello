export interface Task{
    id: number;
    name: string;
    categoryId: number;
    description: string | null;
}
export interface Category{
    id: number;
    name: string;
}