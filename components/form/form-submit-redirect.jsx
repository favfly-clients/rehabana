"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CONTACT_FORM_SLUG } from "@/components/form/ContactModal";

/**
 * Sends the visitor to the thank-you page after any OpnForm embed is submitted.
 * Mounted once in the layout, so all embeds share one listener.
 */

export const THANK_YOU_PATH = "/thank-you";
const OPNFORM_ORIGIN = "https://opnform.com";
const FORM_SUBMITTED_TYPE = "form-submitted";

const FormSubmitRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Ignore messages from any other site; only OpnForm's iframe is trusted
    const onMessage = (event) => {
      if (event.origin !== OPNFORM_ORIGIN) return;
      if (event.data?.type !== FORM_SUBMITTED_TYPE) return;
      if (event.data?.form?.slug !== CONTACT_FORM_SLUG) return;

      router.push(THANK_YOU_PATH);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  return null;
};

export default FormSubmitRedirect;
