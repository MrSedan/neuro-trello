import "../assets/modal.css";
import { Task } from "./Interfaces";

interface modalCategoryProps {
    catName: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    tasks: Task[];
}

export default function ModalCategory({ catName, setOpen, tasks }: modalCategoryProps) {
    return (
        <dialog open className='popUp'>
            <h1>Category {catName}</h1>
            <button
                id='close'
                onClick={() => {
                    setOpen(false);
                }}
            >
                X
            </button>
            {tasks.map((item) => {
                return (
                    <div key={item.id}>
                        {item.name}
                        <br />
                        {item.description}
                    </div>
                );
            })}
        </dialog>
    );
}
