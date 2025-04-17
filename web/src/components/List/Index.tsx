import React, {
  createContext,
  useContext,
  ReactNode,
  HTMLAttributes,
  LiHTMLAttributes,
} from "react";
import "./list-style.css";

type Variant = "lightest" | "light" | "medium" | "dark";

interface ListProps extends HTMLAttributes<HTMLUListElement> {
  dense?: boolean;
  variant?: Variant;
  dividers?: boolean;
  children: ReactNode;
}

interface ListContextProps {
  dense: boolean;
  variant: Variant;
  dividers: boolean;
}
const ListContext = createContext<ListContextProps>({
  dense: false,
  variant: "light",
  dividers: false,
});

// ——— The root List component ———
const ListRoot: React.FC<ListProps> = ({
  dense = false,
  variant = "light",
  dividers = false,
  children,
  className = "",
  ...ulProps
}) => {
  const classes = [
    "mui-list",
    `mui-list--${variant}`,
    dense && "mui-list--dense",
    dividers && "mui-list--dividers",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ListContext.Provider value={{ dense, variant, dividers }}>
      <ul className={classes} {...ulProps}>
        {children}
      </ul>
    </ListContext.Provider>
  );
};

// ——— <List.Item> ———
interface ItemProps extends LiHTMLAttributes<HTMLLIElement> {
  children: ReactNode;
  onClick?: () => void;
}
const Item: React.FC<ItemProps> = ({ children, onClick, ...liProps }) => {
  const { dense } = useContext(ListContext);

  return (
    <li className={`mui-list-item${dense ? " dense" : ""}`} {...liProps}>
      {onClick ? (
        <button
          type="button"
          className="mui-list-item-button"
          onClick={onClick}
        >
          {children}
        </button>
      ) : (
        <div className="mui-list-item-button">{children}</div>
      )}
    </li>
  );
};

// ——— <List.Avatar> ———
interface AvatarProps {
  src?: string;
  alt?: string;
  children?: ReactNode;
}
const Avatar: React.FC<AvatarProps> = ({ src, alt, children }) => (
  <div className="mui-list-item-avatar">
    {src ? (
      <img className="avatar-img" src={src} alt={alt} />
    ) : (
      <div className="avatar-fallback">{children}</div>
    )}
  </div>
);

// ——— <List.Content> ———
interface ContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
const Content: React.FC<ContentProps> = ({ children, ...props }) => (
  <div className="mui-list-item-content" {...props}>
    {children}
  </div>
);

// ——— <List.Text> ———
interface TextProps {
  primary: ReactNode;
  secondary?: ReactNode;
}
const Text: React.FC<TextProps> = ({ primary, secondary }) => (
  <div className="mui-list-item-text">
    <div className="primary">{primary}</div>
    {secondary && <div className="secondary">{secondary}</div>}
  </div>
);

// ——— <List.Actions> ———
interface ActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
const Actions: React.FC<ActionsProps> = ({ children, ...props }) => (
  <div className="mui-list-item-secondary-action" {...props}>
    {children}
  </div>
);
interface DeviderProps extends HTMLAttributes<HTMLDivElement> {
  p?: number;
  m?: number;
}
/**
 * Divider component to separate list items.
 * It accepts padding and margin as props.
 * @param p - Padding value in rem.
 * @param m - Margin value in rem.
 **/
const Divider = ({ p, m }: DeviderProps): React.JSX.Element => {
  return (
    <li
      className="mui-list-divider"
      style={{
        ...(p ? { padding: `${p}rem` } : {}),
        ...(m ? { margin: `${m}rem` } : {}),
      }}
      role="separator"
    />
  );
};
// Attach sub‑components and export
export const List = Object.assign(ListRoot, {
  Item,
  Avatar,
  Content,
  Text,
  Actions,
  Divider,
});
