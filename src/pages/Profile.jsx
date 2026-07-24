import { useEffect, useState } from "react";
import { FiMail, FiPhone, FiEdit3, FiAward, FiBookOpen } from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/api";

const Profile = () => {
  const { user, updateProfile, uploadAvatar, updatePassword } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    userService
      .getProfile()
      .then((data) => {
        if (!active) return;
        const next = data || user;
        setProfile(next);
        setForm({
          full_name: next?.full_name || "",
          email: next?.email || "",
          phone: next?.phone || "",
          bio: next?.bio || "",
        });
      })
      .catch((error) => setStatus({ type: "error", message: error.message }))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user?.id]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });
    const result = await updateProfile({
      full_name: form.full_name,
      phone: form.phone,
      bio: form.bio,
    });
    if (result.success) {
      setProfile(result.profile);
      setEditing(false);
      setStatus({ type: "success", message: "Profile updated successfully." });
    } else setStatus({ type: "error", message: result.error });
    setSaving(false);
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setSaving(true);
    const result = await updatePassword(password);
    setStatus(
      result.success
        ? { type: "success", message: "Password updated successfully." }
        : { type: "error", message: result.error },
    );
    if (result.success) setPassword({ currentPassword: "", newPassword: "" });
    setSaving(false);
  };

  const selectAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const result = await uploadAvatar(file);
    setStatus(
      result.success
        ? { type: "success", message: "Avatar updated successfully." }
        : { type: "error", message: result.error },
    );
  };

  const displayProfile = profile || user || {};
  const initials = (displayProfile.full_name || displayProfile.email || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-secondary-50 px-4 py-6 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">Profile</h1>
              <p className="mt-2 text-sm text-white/80 md:text-base">
                Manage your personal information and account security.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditing((value) => !value)}
              className="btn bg-white/20 text-white hover:bg-white/30"
            >
              <FiEdit3 className="mr-2 inline" />
              {editing ? "Cancel" : "Edit profile"}
            </button>
          </div>
        </div>
        {status.message && (
          <div
            className={`rounded-xl p-4 ${status.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
          >
            {status.message}
          </div>
        )}
        {loading ? (
          <div className="rounded-xl bg-white p-8 text-secondary-500 dark:bg-dark-card">
            Loading profile...
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <DashboardCard title="About you" subtitle="Core profile details">
              {editing ? (
                <form onSubmit={saveProfile} className="space-y-4">
                  {[
                    ["full_name", "Full name"],
                    ["email", "Email"],
                    ["phone", "Phone"],
                    ["bio", "Bio"],
                  ].map(([key, label]) => (
                    <label key={key} className="block text-sm font-medium">
                      <span>{label}</span>
                      <input
                        className="mt-1 w-full rounded-lg border p-3 dark:bg-dark-bg"
                        value={form[key]}
                        disabled={key === "email"}
                        onChange={(event) =>
                          setForm({ ...form, [key]: event.target.value })
                        }
                      />
                    </label>
                  ))}
                  <button
                    disabled={saving}
                    className="btn btn-primary"
                    type="submit"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </form>
              ) : (
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-2xl font-semibold text-white">
                    {displayProfile.avatar_url ? (
                      <img
                        src={displayProfile.avatar_url}
                        alt="Profile avatar"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                    <label className="absolute -bottom-2 -right-2 cursor-pointer rounded-full bg-white p-2 text-primary-700 shadow">
                      <FiEdit3 />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={selectAvatar}
                      />
                    </label>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="text-xl font-semibold text-secondary-900 dark:text-white">
                        {displayProfile.full_name || "User"}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {displayProfile.role || "Student"}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-secondary-600 dark:text-secondary-300">
                      <div className="flex items-center gap-2">
                        <FiMail className="h-4 w-4" />
                        {displayProfile.email || "Not provided"}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone className="h-4 w-4" />
                        {displayProfile.phone || "Not provided"}
                      </div>
                    </div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-300">
                      {displayProfile.bio ||
                        "Add a short bio from Edit profile."}
                    </p>
                  </div>
                </div>
              )}
            </DashboardCard>
            <DashboardCard
              title="Security"
              subtitle="Change your account password"
            >
              <form onSubmit={changePassword} className="space-y-4">
                <input
                  required
                  type="password"
                  placeholder="Current password"
                  className="w-full rounded-lg border p-3 dark:bg-dark-bg"
                  value={password.currentPassword}
                  onChange={(event) =>
                    setPassword({
                      ...password,
                      currentPassword: event.target.value,
                    })
                  }
                />
                <input
                  required
                  minLength={8}
                  type="password"
                  placeholder="New password"
                  className="w-full rounded-lg border p-3 dark:bg-dark-bg"
                  value={password.newPassword}
                  onChange={(event) =>
                    setPassword({
                      ...password,
                      newPassword: event.target.value,
                    })
                  }
                />
                <button
                  disabled={saving}
                  className="btn btn-primary"
                  type="submit"
                >
                  {saving ? "Updating..." : "Update password"}
                </button>
              </form>
            </DashboardCard>
            <DashboardCard
              title="Achievements"
              subtitle="Completed milestones and badges"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-secondary-100 p-4 dark:border-dark-border">
                  <FiBookOpen className="text-primary-700" />
                  <span className="font-semibold">Learning progress</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-secondary-100 p-4 dark:border-dark-border">
                  <FiAward className="text-primary-700" />
                  <span className="font-semibold">
                    Certificates appear here when earned
                  </span>
                </div>
              </div>
            </DashboardCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
