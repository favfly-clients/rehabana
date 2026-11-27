/**
 * The numbers the site offers for calls, one per centre. They match the two
 * Google Business Profiles (checked in the Nov-26 SEO audit), so every
 * tap-to-call on the site rings a number Google also shows.
 */
export const CALL_NUMBERS = [
  { centre: "Salt Lake", tel: "+919836746565", label: "+91 98367 46565" },
  { centre: "Kalighat", tel: "+919073746565", label: "+91 90737 46565" },
];

/**
 * WhatsApp number in international form, digits only (e.g. "919836746565").
 *
 * Empty until the client confirms which number answers WhatsApp (SEO audit
 * ClickUp 14zdwxwrjz4). While it is empty no WhatsApp button is shown. To turn
 * it on, set NEXT_PUBLIC_WHATSAPP_NUMBER in Vercel (Production) and redeploy;
 * no code change is needed.
 */
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "")
  .replace(/\D/g, "");

/** A wa.me link for WHATSAPP_NUMBER, or null while there is none. */
export const whatsappUrl = () =>
  WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : null;
