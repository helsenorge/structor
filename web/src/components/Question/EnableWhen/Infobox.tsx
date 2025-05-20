import React from "react";

type Props = {
  title: string;
  children: React.JSX.Element | React.JSX.Element[];
};

const Infobox = ({ title, children }: Props): React.JSX.Element => {
  return (
    <div className="infobox">
      <p>{title}</p>
      {children}
    </div>
  );
};

export default Infobox;
