// ===== import style registry  =====
import StyledJsxRegistry from "@/lib/styledJsx/StyleRegistry";

//  ==== import styles ====
import "@/styles/bootstrap.min.css";
import "@/styles/style.css";
import "@/styles/custom.css";
import "@splidejs/react-splide/css";

//  ==== import fonts ====
import { Poppins } from "next/font/google";

//  ==== define fonts ====
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

//  ==== import components ====
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactModalPopup from "@/components/form/ContactModalPopup";

import { createClient } from "@/prismicio";
import NextTopLoader from "nextjs-toploader";
import { GoogleTagManager } from "@next/third-parties/google";
import SchemaMarkup from "@/components/schema-markup";
import {
  organizationSchema,
  websiteSchema,
  saltlakeLocationSchema,
  kalighatLocationSchema,
} from "@/lib/schema-data";

const GTM_ID = "GTM-WH4QWRD6";

//  ==== define metadata ====
export const metadata = {
  title: "Rehabana",
  description: "Rehabana is a platform for rehabilitation and therapy",
};

//  ==== define layout ====
const RootLayout = async ({ children }) => {
  const client = createClient();
  const doc = await client.getSingle("layout");

  return (
    <html lang="en">
      <GoogleTagManager gtmId={GTM_ID} />
      <body className={poppins.variable}>
        <StyledJsxRegistry>
          <SchemaMarkup
            data={[
              organizationSchema,
              websiteSchema,
              saltlakeLocationSchema,
              kalighatLocationSchema,
            ]}
          />
          <NextTopLoader color="#7f1f60" />
          <Header data={doc.data} />
          {children}
          <Footer data={doc.data} />
          <ContactModalPopup />
        </StyledJsxRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
