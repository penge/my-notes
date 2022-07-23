import { h, Fragment } from "preact";
import { Notification as OneNotification, NotificationType } from "shared/storage/schema";
import { t } from "i18n";

interface NotificationProps {
  notification: OneNotification
  onClose: () => void
}

const Notification = ({ notification, onClose }: NotificationProps): h.JSX.Element => (
  <div className="notification">
    {notification.type === NotificationType.NEW_VERSION && (
      <Fragment>
        <div>{t("Notifications.New version installed", { version: `<span class="version">${notification.payload}</span>` })}</div>
        <div>
          <a
            href="https://github.com/penge/my-notes/releases"
            target="_blank"
            rel="noreferrer"
          >
            {t("Notifications.What's new")}
          </a>
          {", "}

          <a
            href="https://www.buymeacoffee.com/penge"
            target="_blank"
            rel="noreferrer"
          >
            {t("Buy me a coffee")}
          </a>
          {", "}

          <a
            href="#close"
            onClick={(event) => {
              event.preventDefault();
              onClose();
            }}
          >
            {t("Notifications.Close")}
          </a>
        </div>
      </Fragment>
    )}
  </div>
);

export default Notification;
