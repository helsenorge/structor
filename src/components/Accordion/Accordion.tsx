import React, { useState, MouseEvent } from 'react';
import './Accordion.css';

type AccordionProps = {
    title: string;
    children: React.ReactNode;
};

const Accordion = (props: AccordionProps): JSX.Element => {
    const [open, setOpen] = useState(false);
    const [maxHeight, setMaxHeight] = useState(0);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const panel = event.currentTarget.nextElementSibling;
        if (panel && !open) {
            setMaxHeight(panel.scrollHeight);
        } else {
            setMaxHeight(0);
        }
        setOpen(!open);
    };

    return (
        <>
            <button className={`accordion${open ? ' active' : ''}`} onClick={handleClick}>
                {props.title}
            </button>
            <div className={`panel${open ? ' active' : ''}`} style={{ maxHeight }}>
                <div className="content">{props.children}</div>
            </div>
        </>
    );
};

export default Accordion;
