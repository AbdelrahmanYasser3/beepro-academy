import { useEffect, useState } from "react";
import { FiCreditCard, FiDownload } from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";
import { paymentService } from "../services/paymentAPI";

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      setTransactions(await paymentService.getStudentPaymentSubmissions());
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

  return (
    <div className="min-h-screen bg-secondary-50 px-4 py-6 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white md:p-8">
          <h1 className="text-2xl font-bold md:text-3xl">Payments</h1>
          <p className="mt-2 text-sm text-white/80 md:text-base">
            Review your real payment history and transaction status.
          </p>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <DashboardCard
            title="Billing overview"
            subtitle="Recent transactions and invoice history"
          >
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">
                {error}
                <button type="button" onClick={load} className="ml-3 underline">
                  Retry
                </button>
              </div>
            )}
            {loading ? (
              <div className="p-6 text-secondary-500">Loading payments...</div>
            ) : transactions.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-secondary-500">
                No payments found.
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                  >
                    <div>
                      <div className="font-semibold">
                        {item.title ||
                          `Course payment${item.course_id ? ` · ${item.course_id}` : ""}`}
                      </div>
                      <div className="mt-1 text-sm text-secondary-500">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : ""}{" "}
                        · {item.status || "pending"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {item.amount ?? 0} {item.currency || "USD"}
                      </div>
                      <button
                        type="button"
                        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary-600"
                      >
                        <FiDownload />
                        Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>
          <DashboardCard
            title="Payment method"
            subtitle="Available payment methods"
          >
            <div className="rounded-2xl border border-secondary-100 p-5 dark:border-dark-border">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  <FiCreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Payment methods</div>
                  <div className="text-sm text-secondary-500">
                    Payment details are managed during checkout.
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Payments;
