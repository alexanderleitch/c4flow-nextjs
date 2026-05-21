/**
 * GA4 event tracking utilities.
 *
 * These helpers fire custom events into Google Analytics.
 * They're safe to call anywhere — they no-op if gtag isn't loaded.
 *
 * Google Ads conversion tracking can be layered on top by
 * mapping these events to conversions in the GA4 → Google Ads link.
 */

type GtagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
};

function sendEvent({ action, category, label, value, ...rest }: GtagEvent) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  });
}

// ── Booking ──

export function trackBookNow(className?: string, source?: string) {
  sendEvent({
    action: "book_now_click",
    category: "booking",
    label: className || "general",
    source: source || "unknown",
  });
}

// ── WhatsApp ──

export function trackWhatsAppClick() {
  sendEvent({
    action: "whatsapp_click",
    category: "contact",
    label: "floating_button",
  });
}

// ── Gallery ──

export function trackGalleryOpen(imageIndex: number) {
  sendEvent({
    action: "gallery_image_view",
    category: "engagement",
    label: `image_${imageIndex}`,
    value: imageIndex,
  });
}

// ── Navigation ──

export function trackNavClick(label: string) {
  sendEvent({
    action: "nav_click",
    category: "navigation",
    label,
  });
}

// ── Announcement Banner ──

export function trackBannerClick() {
  sendEvent({
    action: "banner_click",
    category: "promotion",
    label: "announcement_bar",
  });
}

export function trackBannerDismiss() {
  sendEvent({
    action: "banner_dismiss",
    category: "promotion",
    label: "announcement_bar",
  });
}

// ── Outbound Links (for Google Ads) ──

export function trackOutboundLink(url: string, label?: string) {
  sendEvent({
    action: "outbound_click",
    category: "outbound",
    label: label || url,
    transport_type: "beacon",
    event_callback: () => {},
  });
}

// ── TypeScript global augmentation ──

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
