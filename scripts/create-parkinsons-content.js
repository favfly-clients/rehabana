/**
 * Seeds the conditions section with its first pillar: the /conditions hub,
 * Parkinson's Disease, and five Parkinson's topics.
 *
 *   node_modules/.bin/jiti scripts/create-parkinsons-content.js
 *
 * Needs PRISMIC_WRITE_TOKEN in .env.local (.env is tracked by git here, so a
 * secret must not go in it).
 *
 * The Migration API writes into a MIGRATION RELEASE, not straight to the live
 * documents. After this finishes, open Prismic -> Releases -> "Migration
 * Release", review, and publish it — nothing changes on the site before that.
 *
 * Run it once. A document that is already PUBLISHED is updated in place; one
 * still sitting unpublished in the release is invisible to this script and
 * would be created a second time, so publish (or discard) the release first.
 *
 * This is the national layer: no city names in the copy. Kolkata lives on the
 * existing service page, which the condition links to through `local_page`.
 * The text is a starting draft for the team to edit in Prismic — it should
 * be read by a clinician before it is published.
 */

import dotenv from "dotenv";
import * as prismic from "@prismicio/client";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import sm from "../slicemachine.config.json";

const REPOSITORY =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

const CONDITION_UID = "parkinsons-disease";
const LOCAL_PAGE_UID = "parkinsons-treatment-in-kolkata";

// ---------------------------------------------------------------------------
// Rich text and slice builders
// ---------------------------------------------------------------------------

const node = (type, text) => ({ type, text, spans: [] });
const h1 = (text) => [node("heading1", text)];
const h2 = (text) => [node("heading2", text)];
const paras = (...texts) => texts.map((text) => node("paragraph", text));

/**
 * The shared slices' description fields allow ONE paragraph only, so several
 * paragraphs go in as one, split by a blank line — the same way the existing
 * service pages store them. The renderer turns the line breaks into <br>.
 */
const para = (...texts) => [node("paragraph", texts.join("\n\n"))];
const list = (...items) => items.map((text) => node("list-item", text));

/** Inner-page hero: the same background every inner page on the site uses. */
const hero = (heading, description, backgroundImage) => ({
  slice_type: "hero_section",
  variation: "secondary",
  primary: {
    heading: h1(heading),
    description: para(description),
    background_image: backgroundImage,
  },
  items: [],
});

const about = ({ subheading, heading, description, items, image, swap }) => ({
  slice_type: "about_section",
  variation: "default",
  primary: {
    subheading,
    heading: h2(heading),
    description: para(...description),
    list: items ? list(...items) : [],
    image,
    swap_layout: Boolean(swap),
  },
  items: [],
});

const faq = (heading, questions) => ({
  slice_type: "faq_section",
  variation: "default",
  primary: {
    subheading: "FAQs",
    heading: h2(heading),
    description: [],
    items: questions.map(([question, answer]) => ({
      title: [node("heading3", question)],
      details: paras(answer),
    })),
  },
  items: [],
});

const cta = ({ subheading, heading, description, button }) => ({
  slice_type: "cta_section",
  variation: "default",
  primary: {
    subheading,
    heading: h2(heading),
    description: para(description),
    primary_button: button || { link_type: "Any" },
  },
  items: [],
});

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const HUB = {
  meta_title: "Neurological Conditions | Rehabilitation Guides | Rehabana",
  meta_description:
    "Doctor-reviewed guides to Parkinson's, stroke, spinal cord injury and other neurological conditions: symptoms, rehabilitation and support for families.",
  grid_subheading: "Conditions",
  grid_heading: h2("Neurological conditions we help people live with"),
  grid_description: paras(
    "Each guide explains the condition in plain language, what rehabilitation can do, and how families can help at home.",
  ),
  build: (img) => [
    hero(
      "Neurological Conditions",
      "Clear, doctor-led guides to the conditions we treat every day, written for patients and the people who care for them.",
      img.hero,
    ),
    about({
      subheading: "Why these guides exist",
      heading: "Rehabilitation starts with understanding",
      description: [
        "A neurological diagnosis brings many questions at once: what is happening, what will change, and what can actually be done. These guides answer them in plain language.",
        "Every condition has its own page, and every page leads to deeper topics such as mobility, speech, daily care and support for caregivers.",
      ],
      items: [
        "Written around real questions from patients and families",
        "Focused on what rehabilitation can realistically achieve",
        "Updated as our clinical team reviews new evidence",
      ],
      image: img.about[0],
    }),
  ],
};

const CONDITION = {
  name: "Parkinson's Disease",
  summary:
    "A progressive movement disorder. Learn the symptoms, the stages, and how rehabilitation helps people stay active and independent.",
  order: 1,
  meta_title: "Parkinson's Disease: Symptoms, Stages & Rehabilitation | Rehabana",
  meta_description:
    "Understand Parkinson's disease: early signs, motor and non-motor symptoms, stages, and how physiotherapy, speech and occupational therapy help.",
  topics_subheading: "Explore",
  topics_heading: h2("Living with Parkinson's"),
  topics_description: paras(
    "Practical guides on the parts of daily life Parkinson's affects most.",
  ),
  build: (img) => [
    hero(
      "Parkinson's Disease",
      "What Parkinson's is, how it changes over time, and how rehabilitation helps people keep moving, speaking and living independently.",
      img.hero,
    ),
    about({
      subheading: "Understanding the condition",
      heading: "What is Parkinson's disease?",
      description: [
        "Parkinson's disease is a progressive neurological condition. It develops when nerve cells in a part of the brain called the substantia nigra gradually stop producing enough dopamine, a chemical messenger that helps control smooth, coordinated movement.",
        "It usually begins after the age of 60, though some people are diagnosed earlier. Symptoms start slowly, often on one side of the body, and change over years rather than weeks. There is no cure yet, but medicines and rehabilitation together can control symptoms well for a long time.",
      ],
      image: img.about[0],
    }),
    about({
      subheading: "Signs to look for",
      heading: "Common symptoms",
      description: [
        "Parkinson's is best known for its effect on movement, but it is more than a tremor. The main movement (motor) symptoms are:",
      ],
      items: [
        "Tremor, often in one hand, at rest",
        "Slowness of movement (bradykinesia)",
        "Stiffness in the arms, legs or trunk",
        "Problems with balance and walking, including shuffling and freezing",
        "A softer voice, smaller handwriting and reduced facial expression",
      ],
      image: img.about[1],
      swap: true,
    }),
    about({
      subheading: "How it progresses",
      heading: "The stages of Parkinson's",
      description: [
        "Doctors often describe Parkinson's in stages. In the early stage, symptoms are mild and affect one side of the body. In the middle stage, both sides are affected and balance becomes less reliable. In the advanced stage, walking and daily tasks need more help.",
        "Every person moves through these stages at a different pace, and many live well for many years. Starting rehabilitation early, while symptoms are mild, builds habits and strength that pay off later.",
      ],
      image: img.about[2],
    }),
    about({
      subheading: "What helps",
      heading: "How rehabilitation helps in Parkinson's",
      description: [
        "Medicines prescribed by a neurologist replace or mimic dopamine. Rehabilitation works alongside them, training the body and brain to use movement, voice and daily routines more effectively.",
      ],
      items: [
        "Physiotherapy for walking, balance, posture and fall prevention",
        "Speech and swallowing therapy for a clearer voice and safer eating",
        "Occupational therapy for dressing, writing and home safety",
        "Exercise programmes matched to the stage of the condition",
        "Guidance and support for the family and caregivers",
      ],
      image: img.about[3],
      swap: true,
    }),
    faq("Parkinson's disease: common questions", [
      [
        "Is Parkinson's disease hereditary?",
        "Most cases are not inherited. A small proportion are linked to specific genes, and having a close relative with Parkinson's slightly raises the risk, but the majority of people have no family history.",
      ],
      [
        "Can Parkinson's be cured?",
        "Not yet. Treatment controls symptoms, and many people continue to work, travel and stay active for years after diagnosis. Regular exercise and rehabilitation are among the most useful things a person can do.",
      ],
      [
        "Does everyone with Parkinson's have a tremor?",
        "No. Around a third of people never develop a noticeable tremor. Slowness and stiffness are more consistent signs.",
      ],
      [
        "When should rehabilitation start?",
        "As soon as possible after diagnosis. Early physiotherapy and exercise help keep movement, balance and confidence for longer, rather than waiting until problems appear.",
      ],
      [
        "Which doctor diagnoses Parkinson's?",
        "A neurologist usually makes the diagnosis, based on a clinical examination and history. Scans are sometimes used to rule out other conditions.",
      ],
    ]),
  ],
};

const TOPICS = [
  {
    slug: "caregiver-guide",
    title: "Caregiver Guide",
    summary:
      "Practical advice for families: daily routines, safety at home, medicines, and looking after yourself.",
    meta_title: "Parkinson's Caregiver Guide: Daily Care & Support | Rehabana",
    meta_description:
      "A practical guide for families caring for someone with Parkinson's: routines, home safety, medicine timing, communication and caregiver wellbeing.",
    build: (img) => [
      hero(
        "Parkinson's Caregiver Guide",
        "How to support someone with Parkinson's day to day, and how to look after yourself while you do.",
        img.hero,
      ),
      about({
        subheading: "Everyday routines",
        heading: "Building a steady daily routine",
        description: [
          "People with Parkinson's usually do best with a predictable day. Movement is often easiest an hour or so after a dose of medicine, so plan bathing, exercise and outings for those times.",
        ],
        items: [
          "Give medicines at the same times every day; set alarms if needed",
          "Allow extra time for dressing, eating and getting out of the house",
          "Encourage the person to do what they can, rather than doing it for them",
          "Keep a simple diary of good and bad periods to share with the doctor",
        ],
        image: img.about[0],
      }),
      about({
        subheading: "Safety at home",
        heading: "Making the home safer",
        description: [
          "Falls are one of the biggest risks in Parkinson's. Small changes at home make a large difference.",
        ],
        items: [
          "Remove loose rugs and clutter from walking paths",
          "Fit grab bars in the bathroom and beside the bed",
          "Use night lights between the bedroom and the bathroom",
          "Choose a firm chair with armrests that is easy to stand up from",
        ],
        image: img.about[1],
        swap: true,
      }),
      about({
        subheading: "Your wellbeing",
        heading: "Caring for the caregiver",
        description: [
          "Caring for someone with a long-term condition is demanding. Tiredness, worry and frustration are normal, and they are a signal to ask for help, not a failure.",
          "Share tasks among the family, take regular breaks, and keep up your own health appointments. A rehabilitation team can teach safe ways to help with transfers and walking, which protects your back as well as theirs.",
        ],
        image: img.about[2],
      }),
      faq("Caregiver questions", [
        [
          "How can I help when they freeze while walking?",
          "Stay calm and avoid pulling them forward. Ask them to shift their weight from side to side, then step over an imaginary line or walk to a counted rhythm. A physiotherapist can teach cues that work for that person.",
        ],
        [
          "Why are some days better than others?",
          "Symptoms can change with medicine timing, sleep, stress and illness. Fluctuations are common; note them down and discuss them with the neurologist.",
        ],
        [
          "When should we call a doctor urgently?",
          "Seek help quickly for a fall with injury, choking or repeated coughing while eating, sudden confusion, or hallucinations that are new or distressing.",
        ],
      ]),
    ],
  },
  {
    slug: "gait-and-mobility",
    title: "Gait, Balance and Mobility",
    summary:
      "Why walking changes in Parkinson's, what freezing is, and the exercises that help prevent falls.",
    meta_title: "Parkinson's Gait, Balance & Mobility | Fall Prevention | Rehabana",
    meta_description:
      "How Parkinson's affects walking and balance: shuffling, freezing of gait and falls, and the physiotherapy techniques that help people move safely.",
    build: (img) => [
      hero(
        "Gait, Balance and Mobility in Parkinson's",
        "How Parkinson's changes the way people walk, and what can be done to keep moving safely.",
        img.hero,
      ),
      about({
        subheading: "What changes",
        heading: "How Parkinson's affects walking",
        description: [
          "Walking normally happens automatically. In Parkinson's, that automatic control weakens, so steps become shorter, arm swing reduces and the body tends to stoop forward.",
        ],
        items: [
          "Short, shuffling steps",
          "Freezing: feet feel stuck to the floor, often at doorways or turns",
          "Festination: steps speeding up and getting shorter",
          "Difficulty turning and getting up from a chair",
          "Reduced balance reactions, which raises the risk of falls",
        ],
        image: img.about[0],
      }),
      about({
        subheading: "What helps",
        heading: "Physiotherapy for gait and balance",
        description: [
          "Rehabilitation teaches the brain to control movement consciously, bypassing some of the automatic control that Parkinson's disrupts.",
        ],
        items: [
          "Cueing: rhythm, counting or floor lines to start and keep walking",
          "Big, deliberate movements to counter small, slow ones",
          "Balance training to improve recovery from a stumble",
          "Strength and flexibility work for the legs and trunk",
          "Practice of turning, standing up and getting in and out of bed",
        ],
        image: img.about[1],
        swap: true,
      }),
      faq("Mobility questions", [
        [
          "Will a walking stick help?",
          "Sometimes, but the wrong aid can make freezing worse. A physiotherapist should assess walking before a stick or walker is chosen.",
        ],
        [
          "How much exercise is recommended?",
          "Regular activity on most days of the week, combining walking, strength and balance work, matched to the person's stage and safety.",
        ],
        [
          "Can falls be prevented?",
          "The risk can be reduced significantly with balance training, home changes, good footwear and reviewing medicines with the doctor.",
        ],
      ]),
    ],
  },
  {
    slug: "non-motor-symptoms",
    title: "Non-Motor Symptoms",
    summary:
      "Sleep, mood, memory, constipation and other symptoms that are not about movement but matter just as much.",
    meta_title: "Non-Motor Symptoms of Parkinson's: Sleep, Mood & More | Rehabana",
    meta_description:
      "Parkinson's is more than movement. Learn about non-motor symptoms such as sleep problems, low mood, anxiety, memory changes, constipation and fatigue.",
    build: (img) => [
      hero(
        "Non-Motor Symptoms of Parkinson's",
        "The symptoms people don't always connect with Parkinson's, and why they deserve as much attention as tremor or stiffness.",
        img.hero,
      ),
      about({
        subheading: "Beyond movement",
        heading: "What are non-motor symptoms?",
        description: [
          "Parkinson's affects more than the parts of the brain that control movement. Many people notice changes in sleep, mood, digestion or thinking, sometimes years before any tremor appears.",
        ],
        items: [
          "Sleep problems, including acting out dreams",
          "Low mood, anxiety and loss of motivation",
          "Constipation and bladder urgency",
          "Loss of sense of smell",
          "Tiredness and low energy",
          "Slower thinking, memory or attention changes",
          "Dizziness on standing up",
        ],
        image: img.about[0],
      }),
      about({
        subheading: "What helps",
        heading: "Managing non-motor symptoms",
        description: [
          "Many of these symptoms can be treated, but only if they are mentioned. Keep a list and bring it to every appointment, because they are easy to forget when the focus is on movement.",
          "Regular exercise improves sleep, mood and energy. Psychological support helps with anxiety and depression, and a dietitian can help with constipation. Cognitive exercises and structured routines support memory and attention.",
        ],
        image: img.about[1],
        swap: true,
      }),
      faq("Non-motor symptom questions", [
        [
          "Is depression part of Parkinson's?",
          "It is common, and it is partly caused by the changes in the brain, not only by the stress of the diagnosis. It is treatable and should always be raised with the doctor.",
        ],
        [
          "Can Parkinson's affect memory?",
          "Some people develop slower thinking or problems with attention and planning, especially later on. Not everyone does, and support can help.",
        ],
        [
          "Why does my relative feel dizzy when standing?",
          "Parkinson's and some of its medicines can cause blood pressure to drop on standing. Stand up slowly, drink enough fluids, and tell the doctor.",
        ],
      ]),
    ],
  },
  {
    slug: "speech-and-swallowing",
    title: "Speech and Swallowing",
    summary:
      "Why the voice gets softer and swallowing gets harder, and how speech therapy helps.",
    meta_title: "Parkinson's Speech & Swallowing Problems | Therapy | Rehabana",
    meta_description:
      "How Parkinson's affects the voice and swallowing, the warning signs of swallowing difficulty, and how speech and language therapy helps.",
    build: (img) => [
      hero(
        "Speech and Swallowing in Parkinson's",
        "How Parkinson's affects the voice and swallowing, and how therapy helps people stay heard and eat safely.",
        img.hero,
      ),
      about({
        subheading: "Speech",
        heading: "How the voice changes",
        description: [
          "Many people with Parkinson's speak more softly than they realise. Speech can also become monotone, rushed or slurred, and facial expression may reduce, which makes conversation harder for everyone.",
          "Speech therapy trains a louder, clearer voice through intensive, repeated practice, and teaches strategies for busy or noisy settings.",
        ],
        image: img.about[0],
      }),
      about({
        subheading: "Swallowing",
        heading: "Signs of swallowing difficulty",
        description: [
          "Swallowing problems (dysphagia) can develop as Parkinson's progresses. They matter because food or drink entering the airway can cause chest infections.",
        ],
        items: [
          "Coughing or choking during or after meals",
          "A wet or gurgly voice after drinking",
          "Food sticking in the throat",
          "Taking much longer to finish meals",
          "Drooling or difficulty managing saliva",
          "Unexplained weight loss or chest infections",
        ],
        image: img.about[1],
        swap: true,
      }),
      faq("Speech and swallowing questions", [
        [
          "When should we see a speech therapist?",
          "Ideally early, before problems become severe. A baseline assessment makes it easier to notice and treat changes later.",
        ],
        [
          "Are there safer ways to eat and drink?",
          "Yes. Sitting upright, taking small mouthfuls, eating slowly and avoiding distractions help. A therapist may also recommend changing the texture of some foods or drinks.",
        ],
        [
          "Do speech exercises really work?",
          "Structured, intensive voice therapy has good evidence in Parkinson's. The key is regular practice at home between sessions.",
        ],
      ]),
    ],
  },
  {
    slug: "physiotherapy",
    title: "Physiotherapy and Exercise",
    summary:
      "How physiotherapy and regular exercise help people with Parkinson's stay strong, flexible and independent.",
    meta_title: "Physiotherapy & Exercise for Parkinson's Disease | Rehabana",
    meta_description:
      "Why exercise matters in Parkinson's, what a physiotherapy programme includes at each stage, and how to exercise safely at home.",
    build: (img) => [
      hero(
        "Physiotherapy and Exercise for Parkinson's",
        "Why staying active is one of the most effective things a person with Parkinson's can do, and how physiotherapy guides it safely.",
        img.hero,
      ),
      about({
        subheading: "Why it matters",
        heading: "Exercise is part of the treatment",
        description: [
          "Regular exercise improves strength, flexibility, balance and walking, and supports mood and sleep. It works best alongside medicine, not instead of it.",
          "A physiotherapist designs a programme for the person's stage, abilities and goals, then progresses it as they improve.",
        ],
        image: img.about[0],
      }),
      about({
        subheading: "What it includes",
        heading: "A typical physiotherapy programme",
        description: [
          "Programmes change with each stage of Parkinson's, but they usually combine:",
        ],
        items: [
          "Large-amplitude movement training",
          "Walking practice with cues for rhythm and step length",
          "Balance and fall-prevention exercises",
          "Strength training for legs, trunk and posture",
          "Stretching to reduce stiffness",
          "A home exercise plan the family can support",
        ],
        image: img.about[1],
        swap: true,
      }),
      faq("Physiotherapy questions", [
        [
          "Is it safe to exercise with Parkinson's?",
          "For most people, yes, once a doctor or physiotherapist has checked balance and heart health. The programme is adjusted to keep the risk of falls low.",
        ],
        [
          "How long before results show?",
          "Many people feel steadier and more confident within a few weeks of regular practice. Benefits last only as long as the exercise continues.",
        ],
        [
          "Can exercise slow Parkinson's down?",
          "Exercise clearly improves symptoms and function. Research into whether it slows the disease itself is ongoing and encouraging.",
        ],
      ]),
    ],
  },
];

// ---------------------------------------------------------------------------
// Migration
// ---------------------------------------------------------------------------

const seo = (entry, featuredImage) => ({
  meta_title: entry.meta_title,
  meta_description: entry.meta_description,
  ...(featuredImage && { featured_image: featuredImage }),
});

const strip = ({ build, slug, ...rest }) => rest;

async function main() {
  const writeToken = process.env.PRISMIC_WRITE_TOKEN;
  if (!writeToken) {
    throw new Error(
      "PRISMIC_WRITE_TOKEN is not set — add it to .env.local. Generate one at\n" +
        `  https://${REPOSITORY}.prismic.io/settings/ (API & Security -> Migration API)`,
    );
  }

  const client = prismic.createWriteClient(REPOSITORY, {
    writeToken,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  // Images are reused from what is already in the media library: the inner
  // page hero background every page shares, and the photos on the Parkinson's
  // service page. The team can swap any of them in Prismic later.
  const [servicesPage, localPage, contactPage] = await Promise.all([
    client.getSingle("services_page"),
    client.getByUID("service_page", LOCAL_PAGE_UID),
    client.getSingle("contact_page").catch(() => null),
  ]);

  const heroImage = servicesPage.data.slices.find(
    (slice) => slice.slice_type === "hero_section",
  )?.primary.background_image;

  const aboutImages = localPage.data.slices
    .filter((slice) => slice.slice_type === "about_section")
    .map((slice) => slice.primary.image)
    .filter((image) => image?.url);

  const img = {
    hero: heroImage,
    about: [0, 1, 2, 3].map((i) => aboutImages[i % aboutImages.length]),
  };

  const lang = localPage.lang;

  const button = contactPage && {
    ...prismic.documentToLinkField(contactPage),
    text: "Talk to our team",
  };

  const closingCta = cta({
    subheading: "Have a question?",
    heading: "Talk to a rehabilitation specialist",
    description:
      "Our doctors and therapists can explain what rehabilitation could do in your situation.",
    button,
  });

  const migration = prismic.createMigration();

  // Create, or update when a published document with that UID already exists.
  const upsert = async (type, uid, data, title) => {
    const existing = uid
      ? await client.getByUID(type, uid).catch(() => null)
      : await client.getSingle(type).catch(() => null);

    console.log(`  ${existing ? "update" : "create"}  ${type}  ${uid || ""}`);

    return existing
      ? migration.updateDocument({ ...existing, data }, title)
      : migration.createDocument(
          { type, ...(uid && { uid }), lang, data },
          title,
        );
  };

  await upsert(
    "conditions_page",
    null,
    {
      ...strip(HUB),
      ...seo(HUB, heroImage),
      slices: [...HUB.build(img), closingCta],
    },
    "Conditions",
  );

  const condition = await upsert(
    "condition",
    CONDITION_UID,
    {
      ...strip(CONDITION),
      ...seo(CONDITION, localPage.data.featured_image),
      local_page: prismic.documentToLinkField(localPage),
      slices: [...CONDITION.build(img), closingCta],
    },
    CONDITION.name,
  );

  for (const [index, topic] of TOPICS.entries()) {
    await upsert(
      "condition_topic",
      `${CONDITION_UID}-${topic.slug}`,
      {
        ...strip(topic),
        order: index + 1,
        condition,
        ...seo(topic, img.about[index % img.about.length]),
        slices: [...topic.build(img), closingCta],
      },
      `${CONDITION.name}: ${topic.title}`,
    );
  }

  await client.migrate(migration, {
    reporter: (event) => console.log(`  ${event.type}`),
  });

  console.log(
    `\nDone. Review and publish the Migration Release at\n` +
      `  https://${REPOSITORY}.prismic.io/releases`,
  );
}

main().catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exitCode = 1;
});
