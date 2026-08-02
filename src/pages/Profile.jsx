import { useEffect, useState } from "react";
import { FiMail, FiPhone, FiAward, FiBookOpen } from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/api";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const role = (profile?.role || user?.role || "").toLowerCase();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

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
                View your account information. Profile editing is temporarily disabled.
              </p>
            </div>
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
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-2xl font-semibold text-white">
                  {displayProfile.avatar_url ? (
                    <img
                      src={displayProfile.avatar_url}
                      alt="Profile avatar"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    initials
                  )}
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
                    {displayProfile.bio || "No bio provided yet."}
                  </p>
                </div>
              </div>
            </DashboardCard>
            <DashboardCard
              title="Security"
              subtitle="Password changes are temporarily disabled"
            >
              <div className="rounded-xl border border-dashed p-6 text-secondary-500">
                Security settings will reappear when the backend profile mutation contract is finalized.
              </div>
            </DashboardCard>
             {role === "student" && (
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
           )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
