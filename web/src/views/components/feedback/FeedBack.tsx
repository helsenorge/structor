import NotificationPanel, {
  NotificationPanelVariants,
} from "@helsenorge/designsystem-react/components/NotificationPanel";

type Props = {
  text: string;
  show?: boolean;
  variant?: NotificationPanelVariants;
};
const FeedBack = ({
  text,
  show,
  variant = "info",
}: Props): React.JSX.Element | null => {
  if (!show) return null;
  return (
    <NotificationPanel role="alert" variant={variant}>
      {text}
    </NotificationPanel>
  );
};

export default FeedBack;
