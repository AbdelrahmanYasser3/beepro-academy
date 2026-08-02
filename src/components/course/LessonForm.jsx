import Button from "../ui/Button";

const LessonForm = ({
  form,
  onChange,
  onSubmit,
  loading,
  onCancel,
  mode = "create",
}) => {
  const updateField = (field, value) => onChange(field, value);

  return (
    <div className="mt-6 border border-secondary-200 dark:border-dark-border rounded-xl p-4 bg-secondary-50 dark:bg-dark-border">
      <h4 className="font-semibold mb-4">
        {mode === "edit" ? "Edit Lesson" : "New Lesson"}
      </h4>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="label">Lesson Title</label>
          <input
            type="text"
            value={form.title || ""}
            onChange={(event) => updateField("title", event.target.value)}
            className="input w-full"
            placeholder="Lesson title"
          />
        </div>
        <div>
          <label className="label">Description</label>
          <input
            type="text"
            value={form.description || ""}
            onChange={(event) => updateField("description", event.target.value)}
            className="input w-full"
            placeholder="Optional lesson description"
          />
        </div>
        <div>
          <label className="label">Content Type</label>
          <select
            value={form.contentType || "video"}
            onChange={(event) => updateField("contentType", event.target.value)}
            className="input w-full"
          >
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="article">Article</option>
            <option value="file">File</option>
          </select>
        </div>
        <div>
          <label className="label">Content URL</label>
          <input
            type="text"
            value={form.contentUrl || ""}
            onChange={(event) => updateField("contentUrl", event.target.value)}
            className="input w-full"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="label">Duration (minutes)</label>
          <input
            type="number"
            value={form.duration || 0}
            onChange={(event) => updateField("duration", event.target.value)}
            className="input w-full"
            min="0"
          />
        </div>
        <div className="flex items-center gap-3 mt-6">
          <input
            id={`free-${form.id || "lesson"}`}
            type="checkbox"
            checked={Boolean(form.isFree)}
            onChange={(event) => updateField("isFree", event.target.checked)}
            className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor={`free-${form.id || "lesson"}`} className="text-sm">
            Make lesson free
          </label>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={onSubmit} loading={loading}>
          {mode === "edit" ? "Save Changes" : "Create Lesson"}
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

export default LessonForm;
