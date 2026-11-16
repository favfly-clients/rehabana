import { FaCircleCheck } from "react-icons/fa6";
import { Button } from "@/components/ui";

export const metadata = {
  title: "Thank you | Rehabana",
  description: "Your message has reached the Rehabana team.",
  robots: { index: false, follow: false },
};

const ThankYouPage = () => (
  <section className="cs_thank_you_section">
    <div className="cs_height_120 cs_height_lg_80" />
    <div className="container">
      <div className="cs_thank_you text-center">
        <div className="cs_thank_you_icon cs_accent_bg cs_center mx-auto">
          <FaCircleCheck />
        </div>
        <h1 className="cs_fs_40 cs_semibold mt-4 mb-3">
          Thank you for reaching out
        </h1>
        <p className="cs_thank_you_text mx-auto mb-5">
          We have your message. Our team will get back to you soon.
        </p>
        <div className="cs_thank_you_actions d-flex flex-wrap justify-content-center">
          <Button href="/">Back to home</Button>
          <Button variant="text" href="/blog">
            Read our blog
          </Button>
        </div>
      </div>
    </div>
    <div className="cs_height_120 cs_height_lg_80" />
  </section>
);

export default ThankYouPage;
