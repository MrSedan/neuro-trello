import "../assets/modal.css";
import { Task } from "./Interfaces";

interface modalCategoryProps {
    type: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    tasks: Task[];
}

export default function ModalEdit({ type, setOpen, tasks }: modalCategoryProps) {
    return (
        <dialog open className='popUp'>
            <h1>Edit {type}</h1>
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
