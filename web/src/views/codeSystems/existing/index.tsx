import { CodeSystem } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { useDownloadFile } from "src/hooks/useDownloadFile";

import Button from "@helsenorge/designsystem-react/components/Button";
import { Icon } from "@helsenorge/designsystem-react/components/Icon/Icon";
import Download from "@helsenorge/designsystem-react/components/Icons/Download";

type Props = {
  scrollToTarget: () => void;
};

const ExistingCodeSystems = ({ scrollToTarget }: Props): React.JSX.Element => {
  const { download } = useDownloadFile();
  const { t } = useTranslation();

  return <div>{"existing code systems"}</div>;
};

export default ExistingCodeSystems;
