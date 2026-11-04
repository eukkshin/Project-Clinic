import type { MouseEvent } from "react";

/**
 * Call from any client component to open the shared login dialog.
 * A normal <a href="/register/login"> remains useful for direct navigation.
 */
export function openLoginModal() {
  window.dispatchEvent(new Event("ahns:open-login-modal"));
}

/** Preserve Ctrl/Cmd/Shift/Alt-click, allowing opening the standalone page in a new tab. */
export function handleLoginLinkClick(event: MouseEvent<HTMLAnchorElement>) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  event.preventDefault();
  openLoginModal();
}
