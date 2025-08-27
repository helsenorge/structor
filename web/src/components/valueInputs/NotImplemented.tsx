type Props = {
  type: string;
  value: unknown;
};
export const NotImplemented = ({ type, value }: Props): React.JSX.Element => {
  return (
    <div>
      <p>
        <strong>{type}</strong>
      </p>
      <pre>
        <code>{JSON.stringify(value, null, 2)}</code>
      </pre>
      <p style={{ color: "red" }}>
        {"This input type is not yet implemented."}
      </p>
    </div>
  );
};
