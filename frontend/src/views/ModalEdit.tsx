import { useEffect, useRef } from "react";
import "../assets/modal.css";
import { Category, Task } from "./Interfaces";

interface modalEditProps {
    item: Task | Category;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onConfirm: (item: Task | Category) => void;
    onDelete: () => void;
}

export default function ModalEdit({ item, setOpen, onConfirm, onDelete }: modalEditProps) {
    const nameInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (nameInputRef.current) nameInputRef.current.value = item.name;
        if (descriptionInputRef.current) descriptionInputRef.current.value = (item as Task).description || "";
    }, [item, nameInputRef, descriptionInputRef]);
    return (
        <dialog open className='popUp'>
            <h1>Edit {item.name}</h1>
            <button
                id='close'
                onClick={() => {
                    setOpen(false);
                }}
            >
                X
            </button>
            <input placeholder={item.name} ref={nameInputRef} />
            {"categoryId" in item ? <textarea placeholder={item.description || ""} ref={descriptionInputRef} /> : null}
            <button
                id='delete'
                onClick={() => {
                    onDelete();
                }}
            >
                DELETE
            </button>
            <button
                id='confirm'
                onClick={() => {
                    const sendItem = structuredClone(item);
                    sendItem.name = nameInputRef.current?.value || item.name;
                    if ("categoryId" in item) {
                        (sendItem as Task).description = item.description || descriptionInputRef.current?.value || "";
                    }
                    onConfirm(sendItem);
                    setOpen(false);
                }}
            >
                Confirm
            </button>
        </dialog>
    );
}
