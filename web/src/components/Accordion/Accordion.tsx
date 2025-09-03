import React, { useState, MouseEvent } from "react";

import styles from "./accordion.module.scss";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
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
        className={`${styles.accordion} ${open ? styles.active : ""}`}
        onClick={handleClick}
      >
        {props.title}
      </button>
      <div className={`${styles.panel} ${open ? styles.active : ""}`}>
        {open && <div className={styles.content}>{props.children}</div>}
      </div>
    </>
  );
};

export default Accordion;
