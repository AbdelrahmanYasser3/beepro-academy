function toReportDTO(report) {
  if (!report) return null;

  return {
    id: report.id,
    title: report.title,
    type: report.type,
    status: report.status || "pending",
    generated_at: report.generated_at,
    metadata: report.metadata || {},
  };
}

function toReportListDTO(result) {
  if (!result)
    return { items: [], pagination: { total: 0, limit: 20, offset: 0 } };

  return {
    items: (result.items || []).map(toReportDTO),
    pagination: result.pagination || { total: 0, limit: 20, offset: 0 },
  };
}

module.exports = { toReportDTO, toReportListDTO };
