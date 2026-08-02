export const PAYMENTS_ENABLED =
  import.meta.env.VITE_ENABLE_PAYMENTS !== "false";

export const isPaymentsEnabled = () => PAYMENTS_ENABLED;
