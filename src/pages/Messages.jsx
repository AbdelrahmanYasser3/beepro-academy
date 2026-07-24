import { useEffect, useMemo, useState } from "react";
import { FiMessageCircle, FiSend, FiSearch } from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";
import { chatService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      setMessages(await chatService.getStudentChatInbox());
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      messages.filter((item) =>
        `${item.content || ""} ${item.title || ""}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [messages, search],
  );
  const send = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    try {
      const result = await chatService.sendMessage({
        conversationId: "support",
        senderId: user?.id,
        content: text.trim(),
      });
      setMessages((current) => [...current, result]);
      setText("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 px-4 py-6 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white md:p-8">
          <h1 className="text-2xl font-bold md:text-3xl">Messages</h1>
          <p className="mt-2 text-sm text-white/80 md:text-base">
            Stay in touch with instructors, mentors, and support teams.
          </p>
        </div>
        <DashboardCard
          title="Inbox"
          subtitle="Messages from your BeePro community"
        >
          <div className="flex items-center gap-3 rounded-xl border border-secondary-100 bg-secondary-50 px-3 py-3 dark:border-dark-border dark:bg-dark-card">
            <FiSearch className="text-secondary-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search messages"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">
              {error}
              <button type="button" onClick={load} className="ml-3 underline">
                Retry
              </button>
            </div>
          )}
          {loading ? (
            <div className="p-8 text-secondary-500">Loading messages...</div>
          ) : (
            <>
              <div className="mt-6 min-h-64 space-y-3">
                {filtered.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center text-secondary-500">
                    No messages found.
                  </div>
                ) : (
                  filtered.map((message) => (
                    <div
                      key={message.id}
                      className="rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          {message.sender_id === user?.id ? "You" : "Message"}
                        </span>
                        <span className="text-xs text-secondary-500">
                          {message.created_at
                            ? new Date(message.created_at).toLocaleString()
                            : ""}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-300">
                        {message.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <form
                onSubmit={send}
                className="mt-6 flex items-center gap-3 rounded-xl border border-secondary-100 bg-secondary-50 px-3 py-3 dark:border-dark-border dark:bg-dark-card"
              >
                <input
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Type a message"
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-primary-600 p-2 text-white"
                  aria-label="Send message"
                >
                  <FiSend className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </DashboardCard>
      </div>
    </div>
  );
};

export default Messages;
