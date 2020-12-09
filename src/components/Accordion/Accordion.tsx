import React, { useState, MouseEvent } from 'react';
import './Accordion.css';

type AccordionProps = {
    title: string;
};

const Accordion = ({ title }: AccordionProps): JSX.Element => {
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
                {title}
            </button>
            <div className={`panel${open ? ' active' : ''}`} style={{ maxHeight }}>
                <div className="content">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>
            </div>
        </>
    );
};

export default Accordion;
