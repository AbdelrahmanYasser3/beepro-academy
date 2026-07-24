function toCertificateDTO(certificate) {
  if (!certificate) return null;

  return {
    id: certificate.id,
    user_id: certificate.user_id,
    course_id: certificate.course_id,
    certificate_number: certificate.certificate_number,
    issued_at: certificate.issued_at,
    status: certificate.status || "issued",
  };
}

function toCertificateListDTO(result) {
  if (!result)
    return { items: [], pagination: { total: 0, limit: 20, offset: 0 } };

  return {
    items: (result.items || []).map(toCertificateDTO),
    pagination: result.pagination || { total: 0, limit: 20, offset: 0 },
  };
}

module.exports = { toCertificateDTO, toCertificateListDTO };
