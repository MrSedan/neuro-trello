import "../assets/modal.css";
interface modalCreateProps {
    name: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onConfirm: () => void;
    nameInputRef: React.RefObject<HTMLInputElement>;
    descriptionInputRef: React.RefObject<HTMLTextAreaElement> | null;
}
export default function ModalCreate({ name, setOpen, onConfirm, nameInputRef, descriptionInputRef }: modalCreateProps) {
    return (
        <div className='modalBackground'>
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
                    ref={nameInputRef}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onConfirm();
                            setOpen(false);
                        }
                    }}
                    placeholder={`${name} name`}
                />
                {descriptionInputRef ? <textarea placeholder='description' ref={descriptionInputRef} /> : null}
                <button
                    onClick={() => {
                        onConfirm();
                        setOpen(false);
                    }}
                >
                    Confirm
                </button>
            </dialog>
        </div>
    );
}
