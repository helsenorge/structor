import React, { useState } from 'react';

type AccordionProps = {
    title: string;
};

const Accordion = ({ title }: AccordionProps): JSX.Element => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div>
                <h2 onClick={() => setOpen(!open)}>
                    {title} <span className="pull-right">+</span>
                </h2>
            </div>
            {open && <div>Content</div>}
        </>
    );
};

export default Accordion;
