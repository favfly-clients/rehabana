import { FaPhone, FaWhatsapp } from "react-icons/fa6";
import { CALL_NUMBERS, whatsappUrl } from "@/lib/contact";

/**
 * Tap-to-call bar fixed to the bottom of the screen on phones (hidden from
 * 768px up, see `.rc_mobile_contact_bar` in styles/custom.css). One button
 * per centre, plus WhatsApp once a number is configured in lib/contact.js.
 *
 * Clicks are reported to GTM by ContactClickTracking, which listens for every
 * tel: and WhatsApp link on the page; `data-contact-location` tells the two
 * apart from links in the footer or in page content.
 */
const MobileContactBar = () => {
  const whatsapp = whatsappUrl();

  return (
    <nav className="rc_mobile_contact_bar" aria-label="Call Rehabana">
      {CALL_NUMBERS.map(({ centre, tel, label }) => (
        <a
          key={tel}
          href={`tel:${tel}`}
          className="rc_mobile_contact_btn"
          data-contact-location="mobile_bar"
          aria-label={`Call Rehabana ${centre}, ${label}`}
        >
          <FaPhone aria-hidden="true" />
          <span>Call {centre}</span>
        </a>
      ))}
      {whatsapp && (
        <a
          href={whatsapp}
          className="rc_mobile_contact_btn rc_mobile_contact_btn_whatsapp"
          data-contact-location="mobile_bar"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message Rehabana on WhatsApp"
        >
          <FaWhatsapp aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
      )}
    </nav>
  );
};

export default MobileContactBar;
