import Act01Message from "./Act01_Message";
import Act02Process from "./Act02_Process";
import Act03Notifications from "./Act03_Notifications";

export default function ScrollStory() {
  return (
    <div
      aria-label="Wie wir arbeiten — drei Akte"
      className="bg-bg"
    >
      <Act01Message />
      <Act02Process />
      <Act03Notifications />
    </div>
  );
}
