import "../assets/modal.css";
interface modalCreateProps {
    name: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onConfirm: () => void;
    inputRef: React.RefObject<HTMLInputElement>;
}
export default function ModalCreate({ name, setOpen, onConfirm, inputRef }: modalCreateProps) {
    return (
        <dialog open className='popUp'>
            <h1>Create new {name}</h1>
            <button
                id='close'
                onClick={() => {
                    setOpen(false);
                }}
            >
                X
            </button>
            <input
                ref={inputRef}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onConfirm();
                        setOpen(false);
                    }
                }}
                placeholder={`${name} name`}
            />
            <button
                onClick={() => {
                    onConfirm();
                    setOpen(false);
                }}
            >
                Confirm
            </button>
        </dialog>
    );
}
