/**
 * Replaces the body of /conditions/parkinsons-disease with the copy the client
 * supplied, fitted to the page's slices.
 *
 *   node_modules/.bin/jiti scripts/set-parkinsons-client-content.js
 *
 * Needs PRISMIC_WRITE_TOKEN in .env.local. Writes into the Migration Release —
 * publish it in Prismic before anything changes on the site.
 *
 * The client's wording is kept. What changed on the way in:
 *  - "Explore next" links point at the real URLs (/conditions/... prefix, the
 *    site-tree slugs gait-and-mobility and caregiver-guide, /robotic-rehab);
 *    links to /assessments and /locations are dropped until those pages exist.
 *  - Notes addressed to Rehabana ("not supplied for this draft", "confirm
 *    before publishing", the source list and SEO phrase list) are left out.
 *  - The "Next steps in Kolkata" block is one closing call to action; the
 *    Kolkata keywords stay with /parkinsons-treatment-in-kolkata.
 *  - Typos fixed ("observeed", "à" arrows), and "early detection can slow
 *    down the progression" softened to what rehabilitation can claim.
 *
 * Only the slices and SEO fields are replaced; name, summary, order, Kolkata
 * page link and the topics-grid heading are left as they are in Prismic.
 */

import dotenv from "dotenv";
import * as prismic from "@prismicio/client";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import sm from "../slicemachine.config.json";
import {
  about,
  cta,
  faq,
  hero,
  process as processSection,
} from "./lib/prismic-content";

const REPOSITORY =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

const CONDITION_UID = "parkinsons-disease";
const LOCAL_PAGE_UID = "parkinsons-treatment-in-kolkata";

const T = (slug) => `/conditions/parkinsons-disease/${slug}`;
const LINK = {
  symptoms: ["Symptoms of Parkinson's disease", T("symptoms")],
  treatments: ["Parkinson's treatment", T("treatments")],
  nonMotor: ["Non-motor symptoms", T("non-motor-symptoms")],
  gait: ["Walking and gait", T("gait-and-mobility")],
  rehab: ["Parkinson's disease rehabilitation", T("rehabilitation")],
  caregiver: ["Caregiver support", T("caregiver-guide")],
  physio: ["Physiotherapy", T("physiotherapy")],
  ot: ["Occupational therapy", T("occupational-therapy")],
  speech: ["Speech and swallowing support", T("speech-swallowing")],
  robotic: ["Robotic rehabilitation services", "/robotic-rehab"],
  kolkata: ["Parkinson's treatment in Kolkata", `/${LOCAL_PAGE_UID}`],
};

const SEO = {
  meta_title: "Parkinson's Disease Rehabilitation | Stages & Care | Rehabana",
  meta_description:
    "How Parkinson's disease affects daily life, the Hoehn & Yahr stages, and how a step-by-step rehabilitation plan with assessment and follow-up helps.",
};

const build = ({ hero: heroImage, photos: p, steps: s }) => [
  hero(
    "Parkinson's Disease Rehabilitation",
    "Parkinson's disease affects slowness of movement and the ability to initiate and perform intentional movements, and can also affect communication, sleep, mood and everyday activities. Rehabilitation supports function through an individual plan; it does not replace medical care or promise to stop the disease.",
    heroImage,
  ),
  about({
    subheading: "Understanding the condition",
    heading: "What is Parkinson's disease?",
    description: [
      "Parkinson's is a progressive neurological condition, defined by a gradual decrease in the production of dopamine, that can affect movement and many parts of daily life.",
      "It is associated with changes in brain cells involved in movement control. People may experience slowness, stiffness, tremor or changes in balance, but symptoms and their impact vary. Non-motor changes can also occur, sometimes before or alongside movement changes.",
      "Parkinson's treatment is planned with a doctor and may include medicines and other options. Rehabilitation complements that care by focusing on activities, safety and participation that matter to the person.",
    ],
    links: [LINK.symptoms, LINK.treatments],
    image: p[0],
  }),
  about({
    subheading: "Hoehn & Yahr scale",
    heading: "Stages of Parkinson's disease",
    description: [
      "Staging of Parkinson's disease uses the Hoehn & Yahr scale. At Rehabana, we assess each patient's disease severity and movement difficulties using this scale.",
      "Unfortunately, most patients visit Rehabana at Stage 3 or Stage 4 because of poor awareness. Early detection and rehabilitation can help preserve independence for a longer period.",
    ],
    items: [
      "Stage 0: No sign of disease",
      "Stage 1: Unilateral symptoms only",
      "Stage 1.5: Unilateral and axial involvement",
      "Stage 2: Bilateral symptoms, no impairment of balance",
      "Stage 2.5: Mild bilateral disease with recovery on pull test",
      "Stage 3: Mild to moderate bilateral disease, some postural instability, physically independent",
      "Stage 4: Severe disability, still able to walk or stand unassisted",
      "Stage 5: Wheelchair bound or bedridden unless aided",
    ],
    image: p[1],
    swap: true,
  }),
  about({
    subheading: "Symptoms",
    heading: "Symptoms and non-motor changes",
    description: [
      "Parkinson's symptoms differ from person to person and can change over time.",
      "Movement changes may include slowness, stiffness, tremor, freezing of gait, smaller steps, difficulty starting a step or turning, and changes in standing balance. Some people also notice softer speech, reduced facial expression, handwriting changes or difficulty with hand movements.",
      "Non-motor symptoms may involve sleep, mood, thinking, bowel or bladder function, pain, fatigue or other concerns. Tell the care team about changes, even when they do not seem connected to movement.",
    ],
    links: [LINK.nonMotor, LINK.gait],
    image: p[2],
  }),
  about({
    subheading: "Daily life",
    heading: "Problems that can affect everyday life",
    description: [
      "A symptom becomes a practical problem when it makes an important activity harder, less safe or less comfortable.",
      "Rehabana has observed that a person might find it harder to get out of bed or a chair, turn in a narrow space, dress, prepare a meal, write, join a conversation or swallow comfortably. The same symptom can affect people differently depending on their routines, home, work and support.",
      "Not every difficulty needs the same therapy. A conversation with the person and their care team can identify which challenges deserve attention first.",
    ],
    links: [LINK.rehab],
    image: p[3],
    swap: true,
  }),
  about({
    subheading: "Personal priorities",
    heading: "Functional impact and personal priorities",
    description: [
      "Rehabilitation starts with what the person wants or needs to do in daily life.",
      "Rehabana first identifies the problems, such as changes in bed mobility (for example, moving from lying on the back to the side, or rolling), standing with or without support, transfers, walking speed, standing and walking balance, hand use, speech or energy, that can affect independence, increase agitation, and limit social participation, work, hobbies and confidence. Family members may notice changes too, but the person's own priorities should guide the plan.",
      "Examples of goals might include moving around the home more confidently, making dressing easier, being understood in conversation or discussing swallowing concerns with a clinician. Goals should be specific, meaningful and reviewed together.",
    ],
    links: [LINK.caregiver],
    image: p[4],
  }),
  processSection({
    subheading: "How rehabilitation can help",
    heading: "Rehabana's step-by-step rehabilitation goals",
    description: [
      "Parkinson's disease rehabilitation adapts therapy to a person's symptoms, abilities and goals. Rehabana aims to improve patients' functional abilities through a systematic, goal-oriented approach, helping every patient progress step by step from basic mobility to greater independence in daily life.",
    ],
    links: [LINK.physio, LINK.ot, LINK.speech],
    steps: [
      ["Bed mobility", "Improve bed mobility.", s[0]],
      ["Sit to stand", "Achieve sit-to-stand ability.", s[1]],
      ["Transfers", "Improve transfers from bed to chair and back.", s[2]],
      ["Standing balance", "Improve static and dynamic standing balance.", s[3]],
      ["Walking", "Achieve walking with or without an assistive device.", s[0]],
      ["Gait training", "Improve gait using big-step cueing and dual-task training.", s[1]],
      ["Community walking", "Achieve safe and independent community walking, according to the patient's ability.", s[2]],
    ],
  }),
  about({
    subheading: "Assessment",
    heading: "Rehabana's assessment and rehabilitation planning process",
    description: [
      "An assessment helps the rehabilitation team understand current function and the person's priorities.",
      "First, our doctor takes the patient's basic history, medical history and any history of falls to identify potential risks and plan an appropriate rehabilitation programme. Next, our multidisciplinary therapy team conducts a detailed assessment using standardised tools.",
      "The findings help our team set individualised rehabilitation goals, decide the next steps in the programme, and monitor progress through regular reassessment and ongoing therapy.",
    ],
    items: [
      "Physical ability: Timed Up and Go (TUG), Berg Balance Scale (BBS) and Five Times Sit-to-Stand Test (5xSTS)",
      "Functional ability: Functional Independence Measure (FIM) and Nine-Hole Peg Test (9HPT)",
      "Cognitive ability: Montreal Cognitive Assessment (MoCA)",
      "Swallowing ability: Gugging Swallowing Screen (GUSS)",
    ],
    image: p[5],
    swap: true,
  }),
  about({
    subheading: "Baseline goals",
    heading: "Agreeing what matters",
    description: [
      "Baseline goals turn assessment findings into practical, shared priorities.",
      "The person and clinician can agree on a small number of goals tied to daily life, such as practising a safer transfer strategy or making a chosen activity more manageable. Goals should reflect current ability, preferences and relevant clinical advice.",
      "We do not focus only on baseline goals; we also aim to prevent further injuries and complications through appropriate rehabilitation.",
    ],
    links: [LINK.rehab],
    image: p[6],
  }),
  about({
    subheading: "Interventions",
    heading: "A plan shaped around the person",
    description: [
      "Interventions may combine guided practice, education and strategies for everyday activities.",
      "Our physiotherapy team may address movement, walking or balance; our occupational therapy team may explore task changes, routines or the environment; our speech and language therapy team may address communication or swallowing after assessment; and our psychology team may address poor cognition and aggressive behaviour. A plan can include practice between visits when a clinician considers it suitable.",
      "Robotic rehabilitation or other equipment may be relevant only for selected people and goals. Ask the treating team what a service includes, who it may suit and what evidence supports it.",
    ],
    links: [LINK.robotic, LINK.physio, LINK.ot],
    image: p[7],
    swap: true,
  }),
  about({
    subheading: "Reassessment",
    heading: "Checking and adjusting",
    description: [
      "Reassessment helps the team review progress, new difficulties and whether the plan still fits.",
      "Before each follow-up, our multidisciplinary team discusses the patient's progress, remaining impairments and unmet goals, then reassesses the patient and sets new rehabilitation goals. At follow-up, the person and clinician can revisit goals, discuss what is helping or difficult, and decide whether to continue, adjust or seek another opinion.",
      "Parkinson's symptoms and life circumstances can change, so plans may need to change too. The timing of reviews depends on clinical need and the service plan.",
    ],
    image: p[0],
  }),
  about({
    subheading: "Outcomes",
    heading: "Meaningful changes in daily life",
    description: [
      "Useful outcomes are changes that matter to the person, measured in ways agreed with the care team.",
      "Outcomes may relate to a goal, such as completing a chosen task with a strategy or taking part in an activity. Progress can look different for each person and may include maintaining a skill, adapting an activity or identifying a new support need.",
    ],
    image: p[1],
    swap: true,
  }),
  about({
    subheading: "Coordinated care",
    heading: "Review and coordination of care",
    description: [
      "Parkinson's rehabilitation works best as part of coordinated care that reflects changing needs.",
      "The person may discuss rehabilitation with their neurologist or other treating clinician, especially when symptoms change or new concerns arise. With the person's agreement, rehabilitation professionals can share relevant observations with the wider care team.",
      "Medication decisions and diagnosis belong with qualified medical professionals. Rehabilitation recommendations should be coordinated with the person's clinical advice.",
    ],
    links: [LINK.kolkata],
    image: p[2],
  }),
  about({
    subheading: "Caregivers",
    heading: "Caregiver support",
    description: [
      "Caregivers can support daily routines while also sharing observations and looking after their own wellbeing.",
      "A family member or care partner may help communicate priorities, notice changes and practise agreed strategies. Their role should be discussed with the person and care team, respecting the person's preferences and independence.",
      "If caregiving feels difficult, ask the care team about practical support, education and local resources. Support needs can change as the condition and family circumstances change.",
    ],
    links: [LINK.caregiver],
    image: p[3],
    swap: true,
  }),
  about({
    subheading: "Evidence",
    heading: "Evidence and clinical guidance",
    description: [
      "Professional guidance supports considering early physiotherapy, occupational therapy and speech and language therapy assessment, with therapy offered for relevant movement, daily activity, communication or swallowing problems. Recommendations depend on individual needs.",
      "For more detail, explore the focused pages on symptoms, rehabilitation, walking, communication, swallowing and caregiver support.",
    ],
    links: [LINK.rehab, LINK.symptoms, LINK.treatments],
    image: p[4],
  }),
  faq("Frequently asked questions", [
    [
      "What is Parkinson's disease and how can rehabilitation help?",
      "Parkinson's disease is a progressive neurological condition, and rehabilitation can support function and everyday participation.",
      "It may affect movement and non-motor aspects of health. Depending on a person's needs, rehabilitation can include physiotherapy, occupational therapy, or speech and swallowing support, alongside medical care.",
    ],
    [
      "What does Parkinson's disease rehabilitation involve?",
      "It usually begins with understanding the person's concerns, abilities and goals.",
      "A clinician may assess relevant movement, daily activities, communication or swallowing, then agree on an individual plan. The plan and follow-up depend on clinical need.",
    ],
    [
      "When should rehabilitation for Parkinson's disease begin?",
      "Discuss rehabilitation early, including around diagnosis, and revisit it when needs or goals change.",
      "A clinician can advise whether assessment or therapy is appropriate now. Do not wait for a crisis to raise a new difficulty; tell the treating team about changes in movement, daily activities, communication or swallowing.",
    ],
  ]),
];

async function main() {
  const writeToken = process.env.PRISMIC_WRITE_TOKEN;
  if (!writeToken) {
    throw new Error("PRISMIC_WRITE_TOKEN is not set — add it to .env.local.");
  }

  const client = prismic.createWriteClient(REPOSITORY, {
    writeToken,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  const [condition, servicesPage, localPage, servicePages, contactPage] =
    await Promise.all([
      client.getByUID("condition", CONDITION_UID),
      client.getSingle("services_page"),
      client.getByUID("service_page", LOCAL_PAGE_UID),
      client.getAllByType("service_page"),
      client.getSingle("contact_page").catch(() => null),
    ]);

  // Photos come from the media library already in use on the service pages,
  // de-duplicated so the long page doesn't repeat the same four images.
  const seen = new Set();
  const photos = servicePages
    .flatMap((page) => page.data.slices)
    .filter((slice) => slice.slice_type === "about_section")
    .map((slice) => slice.primary.image)
    .filter((image) => image?.id && !seen.has(image.id) && seen.add(image.id))
    .slice(0, 8);

  const steps = localPage.data.slices
    .filter((slice) => slice.slice_type === "process_section")
    .flatMap((slice) => slice.primary.items ?? [])
    .map((item) => item.image)
    .filter((image) => image?.url);

  const img = {
    hero: servicesPage.data.slices.find(
      (slice) => slice.slice_type === "hero_section",
    )?.primary.background_image,
    photos: [...Array(8)].map((_, i) => photos[i % photos.length]),
    steps: [...Array(4)].map((_, i) => steps[i % steps.length]),
  };

  const closing = cta({
    subheading: "Next steps",
    heading: "Arrange a Parkinson's rehabilitation assessment",
    description:
      "A first conversation can help you understand available services and the next appropriate step. Contact Rehabana to confirm current services, location and how to arrange an assessment, and ask whether the service can address the person's goals and coordinate with their treating doctor.",
    links: [LINK.kolkata],
    button: contactPage && {
      ...prismic.documentToLinkField(contactPage),
      text: "Contact Rehabana",
    },
  });

  const migration = prismic.createMigration();
  migration.updateDocument(
    {
      ...condition,
      data: { ...condition.data, ...SEO, slices: [...build(img), closing] },
    },
    condition.data.name || CONDITION_UID,
  );

  console.log(`  update  condition  ${CONDITION_UID}`);
  console.log(`  photos: ${photos.length} distinct, step images: ${steps.length}`);

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
