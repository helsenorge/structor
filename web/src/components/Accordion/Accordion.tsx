import React, { useState, MouseEvent } from "react";
import "./Accordion.css";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const Accordion = (props: AccordionProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    setOpen(!open);
  };

  return (
    <>
      <button
        className={`accordion${open ? " active" : ""}`}
        onClick={handleClick}
      >
        {props.title}
      </button>
      <div className={`panel${open ? " active" : ""}`}>
        {open && (
          <div className={`content ${props.className}`}>{props.children}</div>
        )}
      </div>
    </>
  );
};

export default Accordion;
