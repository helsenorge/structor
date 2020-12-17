import React from 'react';

type Props = {
    title: string;
    children: JSX.Element | JSX.Element[];
};

const Infobox = ({ title, children }: Props): JSX.Element => {
    return (
        <div className="infobox">
            <p>{title}</p>
            {children}
        </div>
    );
};

export default Infobox;
