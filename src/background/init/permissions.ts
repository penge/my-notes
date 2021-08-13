import { Log } from "shared/logger";
import { havingPermission } from "shared/permissions";
import { MessageType } from "shared/storage/schema";
import { handleGoogleDriveMessage } from "./google-drive";

type OptionalPermission = "identity";

const optionalPermissions: OptionalPermission[] = ["identity"];

type PermissionHandlers = {
  [permissionName in OptionalPermission]: (having: boolean) => void
}

const __handlers: PermissionHandlers = {
  identity: (having: boolean) => handleGoogleDriveMessage({ type: having
    ? MessageType.SYNC_INITIATE
    : MessageType.SYNC_STOP
  }),
};

const handlePermissions = (permissionHandlers: PermissionHandlers, permissions: chrome.permissions.Permissions, { having }: { having: boolean }): void => {
  const diffPermissions = permissions.permissions;
  if (!diffPermissions) {
    return;
  }

  Object
    .keys(permissionHandlers)
    .filter((permissionName) => diffPermissions.includes(permissionName as OptionalPermission))
    .forEach((permissionName) => {
      Log(`Permissions - Acting on ${having ? "added" : "removed"} permission "${permissionName}"`);
      permissionHandlers[permissionName as OptionalPermission](having);
    });
};

export const handleChangedPermissions = (): void => {
  optionalPermissions.forEach((optionalPermission) => {
    havingPermission(optionalPermission).then((having) => !having && __handlers[optionalPermission](having));
  });

  chrome.permissions.onAdded.addListener((permissions) => handlePermissions(__handlers, permissions, { having: true }));
  chrome.permissions.onRemoved.addListener((permissions) => handlePermissions(__handlers, permissions, { having: false }));
};
