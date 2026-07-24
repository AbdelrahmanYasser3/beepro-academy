function toPaymentDTO(payment) {
  if (!payment) return null;

  return {
    id: payment.id,
    user_id: payment.user_id,
    course_id: payment.course_id,
    amount: payment.amount,
    currency: payment.currency || "USD",
    status: payment.status || "pending",
    payment_method: payment.payment_method,
    payment_reference: payment.payment_reference,
    created_at: payment.created_at,
    updated_at: payment.updated_at,
  };
}

function toPaymentListDTO(result) {
  if (!result)
    return { items: [], pagination: { total: 0, limit: 20, offset: 0 } };

  return {
    items: (result.items || []).map(toPaymentDTO),
    pagination: result.pagination || { total: 0, limit: 20, offset: 0 },
  };
}

module.exports = { toPaymentDTO, toPaymentListDTO };
