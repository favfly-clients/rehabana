import { asText } from "@prismicio/client";

export const organizationSchema = {
  "@type": "Organization",
  "@id": "https://rehabana.com/#organization",
  name: "Rehabana",
  url: "https://rehabana.com",
  logo: {
    "@type": "ImageObject",
    url: "https://images.prismic.io/rehabana/aXtRwQIvOtkhCEZu_Rehabana-logo.webp?auto=format%2Ccompress&rect=0%2C0%2C574%2C434&w=640&fit=max",
    width: 640,
    height: 434,
  },
  description:
    "Rehabana is East India's first dedicated doctor-led Neuro Rehabilitation Center in Kolkata, helping patients recover after stroke, spinal cord injury, brain injury, Parkinson's disease, and other neurological conditions.",
  email: "rehabana.care@gmail.com",
  sameAs: [
    "https://www.facebook.com/rehabana.care",
    "https://www.youtube.com/@Rehabana",
    "https://x.com/RehabanaKolkata",
    "https://www.instagram.com/rehabana.care/",
    "https://www.linkedin.com/company/rehabana/",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-9836746565",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Bengali"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+91-9073746565",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Bengali"],
    },
  ],
};

export const saltlakeLocationSchema = {
  "@type": "MedicalBusiness",
  "@id": "https://rehabana.com/#saltlake",
  name: "Rehabana Neuro Rehab Center - Salt Lake",
  image:
    "https://images.prismic.io/rehabana/aYmkzN0YXLCxVmf7_20260107_121620.jpg?auto=format%2Ccompress&rect=0%2C211%2C2644%2C3041&w=1920&fit=max",
  url: "https://rehabana.com",
  telephone: "+91-9836746565",
  email: "rehabana.care@gmail.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "DL210, DL Block, Sector II, Salt Lake City",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    postalCode: "700091",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 22.5726,
    longitude: 88.4159,
  },
  areaServed: [
    { "@type": "City", name: "Kolkata" },
    { "@type": "State", name: "West Bengal" },
    { "@type": "Country", name: "India" },
  ],
  parentOrganization: { "@id": "https://rehabana.com/#organization" },
  medicalSpecialty: "PhysicalMedicine_Rehabilitation",
};

export const kalighatLocationSchema = {
  "@type": "MedicalBusiness",
  "@id": "https://rehabana.com/#kalighat",
  name: "Rehabana Neuro Rehab Center - Kalighat",
  image:
    "https://images.prismic.io/rehabana/aYmkzN0YXLCxVmf7_20260107_121620.jpg?auto=format%2Ccompress&rect=0%2C211%2C2644%2C3041&w=1920&fit=max",
  url: "https://rehabana.com",
  telephone: "+91-9073746565",
  email: "rehabana.care@gmail.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1/1 Lake Avenue, Mudiali",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    postalCode: "700026",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 22.5205,
    longitude: 88.3439,
  },
  areaServed: [
    { "@type": "City", name: "Kolkata" },
    { "@type": "State", name: "West Bengal" },
    { "@type": "Country", name: "India" },
  ],
  parentOrganization: { "@id": "https://rehabana.com/#organization" },
  medicalSpecialty: "PhysicalMedicine_Rehabilitation",
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": "https://rehabana.com/#website",
  url: "https://rehabana.com",
  name: "Rehabana",
  description:
    "Best Neuro Rehabilitation Centre in Kolkata — Doctor-led recovery programs for stroke, spinal cord injury, Parkinson's, brain injury and more.",
  publisher: { "@id": "https://rehabana.com/#organization" },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://rehabana.com/blog?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

/**
 * @param {{ name: string; url: string }[]} items
 * @returns {object}
 */
export const generateBreadcrumbSchema = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const services = [
  {
    name: "Occupational Therapy",
    url: "https://rehabana.com/occupational-therapy-in-kolkata",
    description:
      "Expert occupational therapy in Kolkata to help patients regain daily living skills, hand function, and independence after neurological conditions.",
    image:
      "https://images.prismic.io/rehabana/aY8zaFWLo0XkEf15_20260108_131709-3-.jpg?auto=format%2Ccompress&rect=0%2C500%2C4000%2C2000&w=3840&fit=max",
  },
  {
    name: "Psychotherapy",
    url: "https://rehabana.com/psychotherapy-in-kolkata",
    description:
      "Professional psychotherapy and counseling services in Kolkata for emotional and mental health support during rehabilitation.",
    image:
      "https://images.prismic.io/rehabana/aZ1M2sFoBIGEgtWq_DSC_2424.JPG?auto=format%2Ccompress&rect=0%2C500%2C6000%2C3000&w=3840&fit=max",
  },
  {
    name: "Speech Therapy",
    url: "https://rehabana.com/speech-therapy-in-kolkata",
    description:
      "Top speech therapy in Kolkata for all ages — swallowing difficulties, speech disorders, and communication recovery after stroke or brain injury.",
    image:
      "https://images.prismic.io/rehabana/aZ1sgMFoBIGEgtkA_IMG_20260220_131921.jpg.jpeg?auto=format%2Ccompress&rect=384%2C42%2C3238%2C1619&w=3840&fit=max",
  },
  {
    name: "Robotic Rehabilitation",
    url: "https://rehabana.com/robotic-rehab",
    description:
      "Advanced robotic rehabilitation using automated therapy machines for faster neurological recovery and improved mobility.",
  },
  {
    name: "Treatment of Traumatic Brain Injury",
    url: "https://rehabana.com/treatment-of-traumatic-brain-injury-in-kolkata",
    description:
      "Specialized traumatic brain injury treatment and rehabilitation in Kolkata with doctor-led recovery programs.",
  },
  {
    name: "Peripheral Neuropathy Treatment",
    url: "https://rehabana.com/peripheral-neuropathy-treatment-in-kolkata",
    description:
      "Expert peripheral neuropathy treatment in Kolkata to manage nerve damage symptoms and improve quality of life.",
  },
  {
    name: "Animal Assisted Therapy",
    url: "https://rehabana.com/animal-assisted-therapy-centre-in-kolkata",
    description:
      "Animal assisted therapy centre in Kolkata providing therapeutic interactions with animals for emotional and physical rehabilitation.",
  },
  {
    name: "Physiotherapy",
    url: "https://rehabana.com/physiotherapy-in-kolkata",
    description:
      "Best physiotherapy in Kolkata for pain management, mobility improvement, and post-surgical rehabilitation.",
    image:
      "https://images.prismic.io/rehabana/aZW2pFWLo0XkEoWA_DSC_1243.JPG?auto=format%2Ccompress&rect=0%2C500%2C6000%2C3000&w=3840&fit=max",
  },
  {
    name: "Spinal Cord Injury Rehabilitation",
    url: "https://rehabana.com/spinal-cord-rehabilitation-in-kolkata",
    description:
      "Comprehensive spinal cord injury rehabilitation in Kolkata with advanced technology and personalized recovery plans.",
  },
  {
    name: "Parkinson's Disease Treatment",
    url: "https://rehabana.com/parkinsons-treatment-in-kolkata",
    description:
      "Specialized Parkinson's disease treatment and rehabilitation in Kolkata to manage symptoms and maintain independence.",
  },
  {
    name: "Paralysis Rehabilitation",
    url: "https://rehabana.com/paralysis-rehabilitation-in-kolkata",
    description:
      "Expert paralysis rehabilitation in Kolkata for hemiplegia, paraplegia, and quadriplegia recovery programs.",
  },
  {
    name: "Stroke Rehabilitation",
    url: "https://rehabana.com/stroke-rehabilitation-in-kolkata",
    description:
      "Best stroke rehabilitation centre in Kolkata offering comprehensive post-stroke recovery with advanced therapy and robotics.",
  },
  {
    name: "Inpatient Neuro Rehabilitation",
    url: "https://rehabana.com/in-patient-module",
    description:
      "Intensive inpatient neuro rehabilitation module with round-the-clock care and structured daily therapy sessions.",
  },
  {
    name: "Garden Therapy",
    url: "https://rehabana.com/garden-therapy",
    description:
      "Therapeutic garden-based rehabilitation activities for emotional wellbeing and functional recovery.",
  },
  {
    name: "Pain & Spasticity Treatment",
    url: "https://rehabana.com/pain-spasticity",
    description:
      "Specialized pain management and spasticity treatment for neurological conditions and chronic pain relief.",
  },
  {
    name: "Digital Rehab",
    url: "https://rehabana.com/digital-rehab",
    description:
      "Technology-enabled digital rehabilitation solutions including VR-assisted balance training and tele-rehabilitation.",
  },
  {
    name: "PMR / Rehab Physician Consultation",
    url: "https://rehabana.com/pmr-rehab-physician",
    description:
      "Expert PMR / Rehab Physician consultation in Kolkata for accurate diagnosis and personalized rehabilitation plans.",
  },
];

/**
 * @param {{ name: string; url: string; description: string; image?: string }} service
 * @returns {object}
 */
export const generateMedicalServiceSchema = (service) => ({
  "@type": "MedicalProcedure",
  name: service.name,
  url: service.url,
  description: service.description,
  ...(service.image && { image: service.image }),
  procedureType: "TherapeuticProcedure",
  howPerformed: "Doctor-led rehabilitation with advanced technology",
  provider: { "@id": "https://rehabana.com/#organization" },
  availableService: {
    "@type": "MedicalTherapy",
    name: service.name,
    description: service.description,
  },
});

export const homepageFaqSchema = {
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How soon should we start rehabilitation after stroke or injury?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In most cases, early rehabilitation helps improve recovery, once your doctor says it is safe. If your loved one has been discharged from hospital and you're confused about the next step, call us – we'll guide you.",
      },
    },
    {
      "@type": "Question",
      name: "How do we book an appointment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Booking an appointment with Rehabana is simple. You can call or WhatsApp us at 9088746565, email us at rehabana.care@gmail.com, or visit our website and fill out the contact form. Our team will help schedule an assessment and answer any questions you may have.",
      },
    },
    {
      "@type": "Question",
      name: "Can elderly patients or those with paralysis benefit from therapy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, absolutely. Even elderly patients and those with long-standing paralysis or chronic stroke can benefit from rehabilitation. Our customized therapy programs focus on reducing stiffness, improving balance, enhancing mobility, and increasing independence in daily activities at a pace that is safe and realistic.",
      },
    },
    {
      "@type": "Question",
      name: "Is Rehabana only for patients in Kolkata?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our main center is located in Salt Lake, Kolkata, but we care for patients from many regions. This includes other parts of West Bengal, Eastern India, neighbouring states, and even out-of-state or international patients through medical tourism.",
      },
    },
    {
      "@type": "Question",
      name: "How long will the rehabilitation journey take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rehabilitation timelines vary from person to person. Recovery depends on factors such as the type and severity of the condition, how early rehab is started, other health issues, and the effort put in at home between sessions. We never promise unrealistic timelines. Instead, we set clear goals, track progress regularly, and keep patients and families informed at every stage.",
      },
    },
    {
      "@type": "Question",
      name: "What types of therapies are offered at Rehabana?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer a complete range of rehabilitation services including neuro rehabilitation, physiotherapy, occupational therapy, speech therapy, and pain management. All therapies are designed to help improve mobility, coordination, communication, and confidence in daily life, under proper medical guidance.",
      },
    },
    {
      "@type": "Question",
      name: "Why should I choose Rehabana for my recovery journey?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rehabana combines evidence-based rehabilitation, experienced therapists, and compassionate care under doctor-led supervision. Our goal is not only physical improvement but also restoring confidence, dignity, and quality of life for both patients and their families.",
      },
    },
  ],
};

/**
 * @param {{ title: string; description: string; url: string; image: string; datePublished: string; dateModified?: string; authorName?: string }} article
 * @returns {object}
 */
export const generateArticleSchema = (article) => ({
  "@type": "Article",
  headline: article.title,
  description: article.description,
  url: article.url,
  image: article.image,
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  author: {
    "@type": "Organization",
    name: article.authorName || "Rehabana",
    url: "https://rehabana.com",
  },
  publisher: {
    "@type": "Organization",
    name: "Rehabana",
    logo: {
      "@type": "ImageObject",
      url: "https://images.prismic.io/rehabana/aXtRwQIvOtkhCEZu_Rehabana-logo.webp?auto=format%2Ccompress&rect=0%2C0%2C574%2C434&w=640&fit=max",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": article.url,
  },
});

/**
 * @param {{ name: string; description: string; url: string }} page
 * @returns {object}
 */
export const generateWebPageSchema = (page) => ({
  "@type": "WebPage",
  "@id": page.url,
  url: page.url,
  name: page.name,
  description: page.description,
  isPartOf: { "@id": "https://rehabana.com/#website" },
  about: { "@id": "https://rehabana.com/#organization" },
});

/**
 * Content an editor has actually supplied, as opposed to a prompt standing in
 * for it. "To be added" is fine on the page — it tells the client what is
 * outstanding — but it must never reach structured data, where Google would
 * read it as a fact about a named physician.
 */
const isRealValue = (value) =>
  Boolean(value) && !/^(to be added|tbd|placeholder)/i.test(value.trim());

/**
 * Physician profile schema for an individual doctor page.
 * Google uses this for doctor knowledge panels and rich results.
 *
 * @param {object} doctor - A normalised profile from `lib/doctors.js`
 * @returns {object}
 */
export const generatePhysicianSchema = (doctor) => {
  const url = `https://rehabana.com/team/${doctor.slug}`;

  const alumni = (doctor.education ?? [])
    .map((item) => item.institution)
    .filter(isRealValue)
    .map((institution) => ({
      "@type": "EducationalOrganization",
      name: institution,
    }));

  const memberOf = (doctor.memberships ?? [])
    .filter(isRealValue)
    .map((membership) => ({ "@type": "Organization", name: membership }));

  const languages = (doctor.languages ?? []).filter(isRealValue);

  // Every profile link the editor has filled in — `sameAs` is how Google ties
  // the page to the same person elsewhere.
  const sameAs = Object.values(doctor.social ?? {}).filter(
    (link) => link && link !== "#",
  );

  return {
    "@type": "Physician",
    "@id": `${url}#physician`,
    url,
    name: doctor.name,
    honorificSuffix: doctor.credentials,
    jobTitle: doctor.designation,
    description: doctor.seo?.description ?? doctor.lead,
    image: doctor.image?.url,
    medicalSpecialty: "PhysicalMedicineAndRehabilitation",
    ...(languages.length > 0 && { knowsLanguage: languages }),
    ...(alumni.length > 0 && { alumniOf: alumni }),
    ...(memberOf.length > 0 && { memberOf }),
    ...(doctor.conditions?.length > 0 && {
      knowsAbout: doctor.conditions.map((item) => item.label),
    }),
    worksFor: { "@id": "https://rehabana.com/#organization" },
    affiliation: { "@id": "https://rehabana.com/#organization" },
    ...(sameAs.length > 0 && { sameAs }),
  };
};

export const servicesListSchema = {
  "@type": "ItemList",
  name: "Neuro Rehabilitation Services at Rehabana",
  description:
    "Complete list of doctor-led neuro rehabilitation services offered at Rehabana, Kolkata.",
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: service.name,
    url: service.url,
    description: service.description,
  })),
};

export const contactPageSchema = {
  "@type": "ContactPage",
  name: "Contact Rehabana",
  url: "https://rehabana.com/contact",
  description:
    "Contact Rehabana Neuro Rehab Center in Kolkata. Book an appointment for neuro rehabilitation, physiotherapy, and more.",
  mainEntity: { "@id": "https://rehabana.com/#organization" },
};

export const aggregateRatingSchema = {
  "@type": "MedicalBusiness",
  "@id": "https://rehabana.com/#reviews",
  name: "Rehabana",
  url: "https://rehabana.com",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "500",
    reviewCount: "200",
  },
};

/**
 * @param {{ name: string; description: string; thumbnailUrl: string; uploadDate: string; contentUrl?: string; embedUrl?: string }} video
 * @returns {object}
 */
export const generateVideoSchema = (video) => ({
  "@type": "VideoObject",
  name: video.name,
  description: video.description,
  thumbnailUrl: video.thumbnailUrl,
  uploadDate: video.uploadDate,
  ...(video.contentUrl && { contentUrl: video.contentUrl }),
  ...(video.embedUrl && { embedUrl: video.embedUrl }),
  publisher: { "@id": "https://rehabana.com/#organization" },
});

/**
 * The condition a /conditions page is about. Topic pages point back to the
 * same node through `about`, so every page in a condition's branch is tied to
 * one entity.
 *
 * @param {{ name: string; url: string; description?: string }} condition
 * @returns {object}
 */
export const generateMedicalConditionSchema = (condition) => ({
  "@type": "MedicalCondition",
  "@id": `${condition.url}#condition`,
  name: condition.name,
  url: condition.url,
  ...(condition.description && { description: condition.description }),
});

/**
 * @param {{ name: string; description?: string; url: string; aboutId?: string }} page
 * @returns {object}
 */
export const generateMedicalWebPageSchema = (page) => ({
  "@type": "MedicalWebPage",
  "@id": page.url,
  url: page.url,
  name: page.name,
  ...(page.description && { description: page.description }),
  isPartOf: { "@id": "https://rehabana.com/#website" },
  ...(page.aboutId && { about: { "@id": page.aboutId } }),
  publisher: { "@id": "https://rehabana.com/#organization" },
});

/**
 * FAQPage built from whatever FAQ slices a page has, so the schema always
 * matches the questions on screen. Null when there are none.
 *
 * @param {object[]} slices - A Prismic slice zone
 * @returns {object | null}
 */
export const generateFaqSchemaFromSlices = (slices = []) => {
  const mainEntity = slices
    .filter((slice) => slice.slice_type === "faq_section")
    .flatMap((slice) => slice.primary?.items ?? [])
    .map((item) => ({ name: asText(item.title), text: asText(item.details) }))
    .filter((item) => item.name && item.text)
    .map((item) => ({
      "@type": "Question",
      name: item.name,
      acceptedAnswer: { "@type": "Answer", text: item.text },
    }));

  return mainEntity.length ? { "@type": "FAQPage", mainEntity } : null;
};
