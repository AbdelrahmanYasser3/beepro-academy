import Button from "../ui/Button";

const AssessmentForm = ({
  form,
  onChange,
  onSubmit,
  loading,
  onCancel,
  mode = "create",
}) => {
  return (
    <div className="rounded-xl border border-secondary-200 dark:border-dark-border bg-white dark:bg-dark-card p-4">
      <h3 className="font-semibold mb-4">Assessment</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Assessment Title</label>
          <input
            value={form.title || ""}
            onChange={(event) => onChange("title", event.target.value)}
            className="input w-full"
          />
        </div>
        <div>
          <label className="label">Time Limit (minutes)</label>
          <input
            type="number"
            value={form.durationMinutes || form.duration_minutes || 0}
            onChange={(event) =>
              onChange("durationMinutes", event.target.value)
            }
            className="input w-full"
            min="0"
          />
        </div>
        <div>
          <label className="label">Passing Grade (%)</label>
          <input
            type="number"
            value={form.passingGrade || form.passing_grade || 0}
            onChange={(event) => onChange("passingGrade", event.target.value)}
            className="input w-full"
            min="0"
            max="100"
          />
        </div>
        <div>
          <label className="label">Status</label>
          <select
            value={form.status || "draft"}
            onChange={(event) => onChange("status", event.target.value)}
            className="input w-full"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label className="label">Questions</label>
        <textarea
          value={form.questionsText || ""}
          onChange={(event) => onChange("questionsText", event.target.value)}
          className="input w-full"
          rows="4"
          placeholder="Optional structured questions payload"
        />
      </div>
      <div className="mt-4 flex gap-3">
        <Button onClick={onSubmit} loading={loading}>
          {mode === "edit" ? "Save Changes" : "Save Assessment"}
        </Button>
        {onCancel && (
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssessmentForm;
