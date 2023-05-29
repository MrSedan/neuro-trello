import { DragEvent } from "react";
import { Task, Category } from "../views/Interfaces";
import axios from "../tools/api";
import { AxiosError } from "axios";

export function dragStartHandler(
    e: DragEvent<HTMLDivElement>,
    card: Category,
    task: Task,
    setCurrentCard: React.Dispatch<React.SetStateAction<Category | undefined>>,
    setCurrentTaskCard: React.Dispatch<React.SetStateAction<Task | undefined>>,
) {
    if (setCurrentCard && setCurrentTaskCard) {
        setCurrentCard(card);
        setCurrentTaskCard(task);
    }
}
export function dragOverHandler(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
}
export async function dropHandler(e: DragEvent<HTMLDivElement>, card: Category | undefined, task: Task | undefined) {
    e.preventDefault();
    if(card && task){
    const pass = localStorage.getItem("Password") || "";
    const url = "/task/move";
    try {
        const result = await axios.post(url, {id: task.id, category_id: card.id}, {
            headers: { Authorization: pass },
        });
        
        console.log(result);
    } catch (error) {
        if ((error as AxiosError).response) {
            console.error("Error", error);
        }
    }
}

}
