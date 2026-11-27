"use client";

import { useEffect } from "react";

/**
 * Reports every tap on a phone or WhatsApp link to Google Tag Manager
 * (GTM-WH4QWRD6) as a dataLayer event, so GA4 can count calls and chats as
 * key events (SEO audit ClickUp 14zdwxwrjz5).
 *
 * One listener on the document covers links anywhere: the mobile contact bar,
 * the footer, doctor pages and phone links editors add in Prismic rich text.
 *
 * Events pushed:
 *   { event: "phone_click",    contact_number, contact_location, link_text, page_path }
 *   { event: "whatsapp_click", contact_number, contact_location, link_text, page_path }
 *
 * GTM still needs a Custom Event trigger + GA4 Event tag per event, and GA4
 * needs both marked as key events (see the PR description).
 */

const WHATSAPP_LINK = /^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i;

/** Which kind of contact link `href` is, or null for any other link. */
const contactEvent = (href) => {
  if (/^tel:/i.test(href)) return "phone_click";
  if (WHATSAPP_LINK.test(href) || /^whatsapp:/i.test(href)) return "whatsapp_click";
  return null;
};

/** The dialled number, digits only (with a leading + if there was one). */
const contactNumber = (href) => {
  if (/^tel:/i.test(href)) {
    const raw = decodeURIComponent(href.slice(4));
    return `${raw.trim().startsWith("+") ? "+" : ""}${raw.replace(/\D/g, "")}`;
  }
  const match = href.match(/wa\.me\/(\d+)|[?&]phone=(\d+)/i);
  return match ? match[1] || match[2] : "";
};

/** Where on the page the link sits, for the GA4 report. */
const contactLocation = (link) =>
  link.closest("[data-contact-location]")?.dataset.contactLocation ||
  (link.closest("footer") ? "footer" : link.closest("header") ? "header" : "content");

const ContactClickTracking = () => {
  useEffect(() => {
    const onClick = (event) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const name = contactEvent(href);
      if (!name) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: name,
        contact_number: contactNumber(href),
        contact_location: contactLocation(link),
        link_text: (link.textContent || link.getAttribute("aria-label") || "").trim().slice(0, 100),
        page_path: window.location.pathname,
      });
    };

    // Capture phase, so a link whose own handler stops propagation still counts.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
};

export default ContactClickTracking;
