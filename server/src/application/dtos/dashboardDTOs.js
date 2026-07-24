function toDashboardDTO(data) {
  return {
    student: data?.student || null,
    teacher: data?.teacher || null,
    admin: data?.admin || null,
  };
}

module.exports = { toDashboardDTO };
