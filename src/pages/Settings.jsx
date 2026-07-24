import { useEffect, useState } from "react";
import { FiShield, FiBell, FiGlobe } from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";
import { settingsService } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";

const Settings = () => {
  const { language, changeLanguage } = useLanguage();
  const [settings, setSettings] = useState({
    notifications_enabled: true,
    email_notifications: true,
    dark_mode: false,
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    settingsService
      .getSettings()
      .then(
        (data) =>
          active && data && setSettings((current) => ({ ...current, ...data })),
      )
      .catch((error) => active && setStatus(error.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const update = async (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    setStatus("");
    try {
      await settingsService.updateSettings({ [key]: value });
      setStatus("Settings updated successfully.");
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 px-4 py-6 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white md:p-8">
          <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
          <p className="mt-2 text-sm text-white/80 md:text-base">
            Manage your preferences, privacy, and notification controls.
          </p>
        </div>
        {status && (
          <div className="rounded-xl bg-green-50 p-4 text-green-700">
            {status}
          </div>
        )}
        {loading ? (
          <div className="rounded-xl bg-white p-8 text-secondary-500 dark:bg-dark-card">
            Loading settings...
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            <DashboardCard
              title="Preferences"
              subtitle="Tune your workspace experience"
            >
              <div className="space-y-4">
                <label className="flex items-center justify-between rounded-xl border border-secondary-100 p-4 dark:border-dark-border">
                  <span className="font-semibold">Email notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.email_notifications}
                    onChange={(event) =>
                      update("email_notifications", event.target.checked)
                    }
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-secondary-100 p-4 dark:border-dark-border">
                  <span className="font-semibold">In-app notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications_enabled}
                    onChange={(event) =>
                      update("notifications_enabled", event.target.checked)
                    }
                  />
                </label>
              </div>
            </DashboardCard>
            <DashboardCard
              title="Language"
              subtitle="Choose your preferred language"
            >
              <label className="flex items-center justify-between rounded-xl border border-secondary-100 p-4 dark:border-dark-border">
                <span className="flex items-center gap-2 font-semibold">
                  <FiGlobe />
                  Language
                </span>
                <select
                  value={language}
                  onChange={(event) => changeLanguage(event.target.value)}
                  className="rounded-lg border p-2 dark:bg-dark-bg"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </label>
            </DashboardCard>
            <DashboardCard title="Security" subtitle="Protect your account">
              <div className="flex items-center gap-3 rounded-xl border border-secondary-100 p-4 dark:border-dark-border">
                <FiShield className="text-primary-700" />
                <span className="font-semibold">
                  Password and account security are managed from Profile.
                </span>
              </div>
            </DashboardCard>
            <DashboardCard
              title="Notifications"
              subtitle="Control how BeePro contacts you"
            >
              <div className="flex items-center gap-3 rounded-xl border border-secondary-100 p-4 dark:border-dark-border">
                <FiBell className="text-primary-700" />
                <span className="font-semibold">
                  Notification preferences are saved to your account.
                </span>
              </div>
            </DashboardCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
