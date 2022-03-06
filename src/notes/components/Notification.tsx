import { h, Fragment } from "preact";
import { Notification, NotificationType } from "shared/storage/schema";
import { t } from "i18n";

interface NotificationProps {
  notification: Notification
  onClose: () => void
}

const Notification = ({ notification, onClose }: NotificationProps): h.JSX.Element => (
  <div class="notification">
    {notification.type === NotificationType.NEW_VERSION && (
      <Fragment>
        <div>{t("Notifications.New version installed", { version: `<span class="version">${notification.payload}</span>` })}</div>
        <div>
          <a href="https://github.com/penge/my-notes/releases" target="_blank">{t("Notifications.What's new")}</a><span>{", "}</span>
          <a href="https://www.buymeacoffee.com/penge" target="_blank">{t("Buy me a coffee")}</a><span>{", "}</span>
          <a href="#" onClick={(event) => {
            event.preventDefault();
            onClose();
          }}>{t("Notifications.Close")}</a>
        </div>
      </Fragment>
    )}
  </div>
);

export default Notification;
