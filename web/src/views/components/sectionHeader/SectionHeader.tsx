import { useNavigate, Link } from "react-router-dom";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import ArrowRight from "@helsenorge/designsystem-react/components/Icons/ArrowRight";

import styles from "./sectionHeader.module.scss";

type Props = {
  id: string | undefined;
  headline: string;
  linkText: string;
};

const SectionHeader = ({
  id,
  headline,
  linkText,
}: Props): React.JSX.Element => {
  const navigate = useNavigate();
  return (
    <header className={styles.sectionHeader}>
      <h2>{headline}</h2>
      <Link to={`/formbuilder/${id}`}>
        <Button
          onClick={() => navigate(`/formbuilder/${id}`)}
          variant="borderless"
        >
          {linkText}
          <Icon svgIcon={ArrowRight} />
        </Button>
      </Link>
    </header>
  );
};
export default SectionHeader;
