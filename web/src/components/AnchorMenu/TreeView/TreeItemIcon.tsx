import type { QuestionnaireItem } from "fhir/r4";

import Icon, { IconSize } from "@helsenorge/designsystem-react/components/Icon";
import Attachment from "@helsenorge/designsystem-react/components/Icons/Attachment";
import Calendar from "@helsenorge/designsystem-react/components/Icons/Calendar";
import Check from "@helsenorge/designsystem-react/components/Icons/Check";
import Gallery from "@helsenorge/designsystem-react/components/Icons/Gallery";
import HelpSign from "@helsenorge/designsystem-react/components/Icons/HelpSign";
import InfoSignStroke from "@helsenorge/designsystem-react/components/Icons/InfoSignStroke";
import List from "@helsenorge/designsystem-react/components/Icons/List";
import Scale from "@helsenorge/designsystem-react/components/Icons/Scale";
import SpeechBubble from "@helsenorge/designsystem-react/components/Icons/SpeechBubble";
import Watch from "@helsenorge/designsystem-react/components/Icons/Watch";

export const TreeItemIcon = ({
  type,
}: {
  type?: QuestionnaireItem["type"];
}): JSX.Element => {
  switch (type) {
    case "question":
      return <Icon size={IconSize.XSmall} svgIcon={HelpSign} />;
    case "choice":
    case "open-choice":
      return <Icon size={IconSize.XSmall} svgIcon={List} />;
    case "text":
    case "string":
      return <Icon size={IconSize.XSmall} svgIcon={SpeechBubble} />;
    case "group":
      return <Icon size={IconSize.XSmall} svgIcon={Gallery} />;
    case "quantity":
      return <Icon size={IconSize.XSmall} svgIcon={Scale} />;
    case "boolean":
      return <Icon size={IconSize.XSmall} svgIcon={Check} />;
    case "date":
    case "dateTime":
      return <Icon size={IconSize.XSmall} svgIcon={Calendar} />;
    case "time":
      return <Icon size={IconSize.XSmall} svgIcon={Watch} />;
    case "display":
      return <Icon size={IconSize.XSmall} svgIcon={InfoSignStroke} />;
    case "attachment":
      return <Icon size={IconSize.XSmall} svgIcon={Attachment} />;
    default:
      return <Icon size={IconSize.XSmall} svgIcon={HelpSign} />;
  }
};
