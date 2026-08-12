/**
 * App-wide notification display behavior - imported once (for its
 * side-effect) from the root layout. Without this, a scheduled
 * notification that fires while the app happens to be open in the
 * foreground is delivered silently instead of shown, which would make the
 * "confirm it fires at the right time" test step unreliable whenever the
 * app is left open past the trigger time.
 */
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
