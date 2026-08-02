export const TOAST_EVENT = "beepro:toast";

export function emitToast(message, type = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: { message, type },
    }),
  );
}

export function toastSuccess(message) {
  emitToast(message, "success");
}

export function toastError(message) {
  emitToast(message, "error");
}
