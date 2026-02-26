import type { QuestionnaireItem } from "fhir/r4";

import Icon, { IconSize } from "@helsenorge/designsystem-react/components/Icon";
import Attachment from "@helsenorge/designsystem-react/components/Icons/Attachment";
import Calendar from "@helsenorge/designsystem-react/components/Icons/Calendar";
import Check from "@helsenorge/designsystem-react/components/Icons/Check";
import Gallery from "@helsenorge/designsystem-react/components/Icons/Gallery";
import HelpSign from "@helsenorge/designsystem-react/components/Icons/HelpSign";
import InfoSignStroke from "@helsenorge/designsystem-react/components/Icons/InfoSignStroke";
import Scale from "@helsenorge/designsystem-react/components/Icons/Scale";
import SpeechBubble from "@helsenorge/designsystem-react/components/Icons/SpeechBubble";
import Watch from "@helsenorge/designsystem-react/components/Icons/Watch";

import ChoiceIcon from "../icons/ChoiceIcon";
import NumberIcon from "../icons/NumberIcon";

export const TreeItemIcon = ({
  type,
  size = IconSize.XSmall,
}: {
  type?: QuestionnaireItem["type"];
  size?: IconSize;
}): JSX.Element => {
  switch (type) {
    case "question":
      return <Icon size={size} svgIcon={HelpSign} />;
    case "choice":
    case "open-choice":
      return <Icon size={size} svgIcon={ChoiceIcon} />;
    case "text":
    case "string":
      return <Icon size={size} svgIcon={SpeechBubble} />;
    case "group":
      return <Icon size={size} svgIcon={Gallery} />;
    case "quantity":
      return <Icon size={size} svgIcon={Scale} />;
    case "integer":
    case "decimal":
      return <Icon size={size} svgIcon={NumberIcon} />;
    case "boolean":
      return <Icon size={size} svgIcon={Check} />;
    case "date":
    case "dateTime":
      return <Icon size={size} svgIcon={Calendar} />;
    case "time":
      return <Icon size={size} svgIcon={Watch} />;
    case "display":
      return <Icon size={size} svgIcon={InfoSignStroke} />;
    case "attachment":
      return <Icon size={size} svgIcon={Attachment} />;
    default:
      return <Icon size={size} svgIcon={HelpSign} />;
  }
};
