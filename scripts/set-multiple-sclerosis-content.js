/**
 * Creates (or refreshes) the Multiple Sclerosis condition page —
 * /conditions/multiple-sclerosis — from the copy the client supplied in
 * "conditions dash multiple-sclerosis.docx" (ClickUp task "Multiple
 * Sclerosis", RC - AI_SEO list).
 *
 *   node_modules/.bin/jiti scripts/set-multiple-sclerosis-content.js
 *
 * Needs PRISMIC_WRITE_TOKEN in .env.local, and the two diagrams from the docx
 * in docs/conditions/multiple-sclerosis/ (docs/ is gitignored — once uploaded
 * they live in the Prismic media library). Writes into the Migration Release;
 * publish it in Prismic before anything changes on the site.
 *
 * The client's wording is kept. What changed on the way in:
 *  - "Read more" / "Explore" links to MS topic pages, assessments, experts and
 *    a Kolkata MS page are left out: none of those pages exist yet. The one
 *    that does, /robotic-rehab, is linked.
 *  - "The Wider Rehabana MS Ecosystem" is left out: it describes the site
 *    plan ("this structure allows the pillar page to become...") and links to
 *    sections that don't exist yet.
 *  - "MS Rehabilitation in Kolkata" and "Start With an MS Rehabilitation
 *    Assessment" become the closing call to action.
 *  - Each H2's bold lead line opens its section's text; small typos fixed.
 *
 * Runs on a published document only. If the page already exists, its slices
 * and SEO fields are replaced and everything else is kept.
 */

import fs from "node:fs";
import dotenv from "dotenv";
import * as prismic from "@prismicio/client";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import sm from "../slicemachine.config.json";
import { about, cta, faq, fullImage, h2, hero, paras } from "./lib/prismic-content";

const REPOSITORY =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

const UID = "multiple-sclerosis";
const IMAGE_DIR = "docs/conditions/multiple-sclerosis";

const DIAGRAMS = {
  neuron: {
    file: "neuron-parts-and-ms.png",
    alt: "Parts of a neuron (dendrites, cell body, axon, myelin sheath, nodes of Ranvier, axon terminals) and why they matter in multiple sclerosis",
  },
  demyelination: {
    file: "how-ms-affects-neurons.png",
    alt: "How a nerve signal jumps between nodes of Ranvier, and how immune damage to myelin in multiple sclerosis slows or blocks the signal",
  },
};

const FIELDS = {
  name: "Multiple Sclerosis",
  summary:
    "A long-term condition of the brain and spinal cord. Learn how MS affects the nervous system and how structured rehabilitation helps.",
  // Site-tree order: Parkinson's, Stroke, Spinal Cord Injury, TBI, MS, MND.
  order: 5,
  topics_subheading: "Explore",
  topics_heading: h2("Living with multiple sclerosis"),
  topics_description: paras(
    "Focused guides on the parts of daily life MS affects most.",
  ),
  meta_title: "Multiple Sclerosis Rehabilitation: MS Symptoms & Care | Rehabana",
  meta_description:
    "What multiple sclerosis is, how it affects the nervous system and daily life, and how assessment-led MS rehabilitation helps people stay independent.",
};

const build = ({ hero: heroImage, photos: p, diagrams: d }) => [
  hero(
    "Multiple Sclerosis Rehabilitation",
    "A structured rehabilitation approach can help people with MS manage symptoms, maintain function and work towards greater independence.",
    heroImage,
  ),
  about({
    subheading: "Overview",
    heading: "Rehabilitation built around daily life",
    description: [
      "Multiple sclerosis (MS) is a neurological condition that can affect movement, balance, sensation, vision, thinking, speech, swallowing, bladder and bowel function, energy levels and everyday activities. The way MS affects a person varies considerably. Rehabilitation focuses not only on the symptoms themselves, but on how those symptoms affect daily life, independence and participation. Treatment for MS may include medical management as well as rehabilitation and supportive care.",
      "At Rehabana, MS rehabilitation is organised around assessment, meaningful functional goals, targeted interventions and regular reassessment. The aim is to understand what is limiting the person today and build a practical plan around what they want to do in everyday life.",
    ],
    image: p[0],
  }),
  about({
    heading: "What is multiple sclerosis?",
    description: [
      "MS affects the nervous system, but its impact is different for every person.",
      "Multiple sclerosis (MS) is a long-term neurological condition that affects cells of the central nervous system (CNS): the brain and spinal cord. It can cause different combinations of symptoms, and symptoms may change over time. Some people experience problems that are clearly visible, such as difficulty walking, while others may experience less visible problems such as fatigue, cognitive difficulties or pain. There is currently no cure for MS, but medical treatment and rehabilitation can help manage the condition and its effects.",
      "To understand MS, it helps to first understand how nerve cells normally carry messages around the body. The brain acts like the body's control centre, while the spinal cord acts like a major communication pathway connecting the brain with the rest of the body.",
    ],
    image: p[1],
    swap: true,
  }),
  about({
    subheading: "A simple example",
    description: [
      "Imagine that your brain is sending a message to your leg saying, \"Move your foot.\" The message travels through nerve pathways from the brain, down the spinal cord and towards the muscles of the leg. Think of the axon as an electrical wire and myelin as the insulation around that wire. When the insulation is healthy, the message can travel quickly. In MS, if the immune system damages the myelin along that pathway, the message may travel more slowly or may not travel properly. The person may then find that moving the leg is weaker, slower or less coordinated.",
      "This is why MS is not simply a problem with muscles or joints. It is a condition affecting the communication system of the brain and spinal cord. The symptoms and functional difficulties depend on which parts of the nervous system are affected, how much they are affected and how the condition changes over time. Understanding this connection, from neurological changes to symptoms and then to difficulties in everyday activities, is an important foundation for understanding multiple sclerosis rehabilitation.",
    ],
    image: p[2],
  }),
  fullImage(d.neuron, "Parts of a neuron and their relevance to multiple sclerosis"),
  about({
    subheading: "Neurons and myelin",
    description: [
      "The cells that carry these messages are called neurons, or nerve cells. A neuron has several parts, including the cell body, dendrites and a long fibre called an axon. Dendrites receive information, while the axon carries electrical signals away from the cell body towards other nerve cells, muscles or glands. In this way, networks of neurons allow us to move, feel, see, think, speak and perform everyday activities.",
      "Many axons in the brain and spinal cord are covered by a fatty insulating layer called the myelin sheath. In the central nervous system, myelin is produced by specialised cells called oligodendrocytes. Myelin is important because it helps electrical signals travel quickly and efficiently along the axon. There are small gaps between sections of myelin called nodes of Ranvier. The electrical signal can effectively move from one node to the next, a process called saltatory conduction. This is one reason nerve signals can travel rapidly through the nervous system.",
      "In multiple sclerosis, the body's immune system mistakenly attacks components of the central nervous system, particularly myelin. This can cause inflammation and damage to the myelin sheath, a process known as demyelination. When myelin is damaged, the electrical signals travelling along the affected nerve pathway may become slower, less reliable or, in some situations, blocked. With ongoing or severe damage, the underlying nerve fibre, or axon, can also be affected.",
    ],
    image: p[3],
    swap: true,
  }),
  fullImage(
    d.demyelination,
    "A neuron and how it works, and what happens in multiple sclerosis",
  ),
  about({
    subheading: "Lesions and plaques",
    description: [
      "MS can produce areas of damage called lesions or plaques in different parts of the brain and spinal cord. This is one reason people with MS can experience very different symptoms. If a pathway involved in movement is affected, a person may develop weakness, stiffness, difficulty walking or problems with coordination. If sensory pathways are affected, there may be numbness, tingling or altered sensation. Other areas of the nervous system can be associated with problems involving vision, balance, thinking, speech, swallowing or other functions.",
      "Early in MS, inflammation and demyelination are major features. With ongoing disease activity, some nerve fibres (axons) can also become damaged. When axonal injury accumulates, neurological impairment can become more persistent.",
      "This is one reason why MS is not simply a problem of \"weak muscles\" or \"damaged nerves\". It is a disease affecting the central nervous system and the communication pathways that connect the brain with the rest of the body.",
    ],
    image: p[4],
  }),
  about({
    heading: "Does multiple sclerosis have different stages?",
    description: [
      "MS does not have a fixed sequence of stages. Different people can have different disease courses.",
      "Multiple sclerosis does not follow a fixed sequence of stages. Doctors describe MS according to its clinical course, including relapsing-remitting MS (RRMS), secondary progressive MS (SPMS) and primary progressive MS (PPMS). Some people first have a clinically isolated syndrome (CIS), while radiologically isolated syndrome (RIS) describes MRI findings suggestive of MS in someone who has not yet had typical neurological symptoms. Not everyone follows the same path, and the course can vary considerably between individuals.",
    ],
    image: p[5],
    swap: true,
  }),
  about({
    heading: "Symptoms of multiple sclerosis",
    description: [
      "MS symptoms can involve movement, sensation, vision, thinking, speech, swallowing and energy.",
      "MS does not produce the same symptoms in everyone. Common problems may include weakness, stiffness or spasticity, balance and coordination difficulties, walking problems, altered sensation, pain, fatigue, vision changes and cognitive difficulties. Some people may also experience speech or swallowing difficulties. Symptoms can be mild or more disabling and may change over time.",
    ],
    image: p[6],
  }),
  about({
    heading: "From symptoms to functional problems",
    description: [
      "Rehabilitation asks an important question: \"What is this symptom stopping you from doing?\"",
      "A symptom becomes clinically important when it starts affecting function. For example, weakness or poor balance may make walking difficult; fatigue may make work or household activities harder; reduced coordination may affect dressing or eating; and cognitive changes may interfere with planning or concentration. Understanding this connection helps the rehabilitation team move from simply treating a symptom to addressing the activity that matters to the person.",
    ],
    image: p[7],
    swap: true,
  }),
  about({
    heading: "Is there a cure for MS?",
    description: [
      "There is currently no cure that completely removes multiple sclerosis, but effective treatments can control disease activity, manage symptoms and help people maintain their function and independence.",
      "MS affects people differently, and its course can vary considerably. Medical treatment may help reduce disease activity and the risk of further neurological damage, while symptom-specific treatment can address problems such as pain, stiffness, fatigue or bladder difficulties. Rehabilitation plays an important role alongside medical treatment, helping a person maintain mobility, manage functional difficulties, adapt to changes and work towards meaningful goals. Regular assessment and review are important because rehabilitation needs can change over time.",
    ],
    image: p[0],
  }),
  about({
    heading: "How MS can affect everyday life",
    description: [
      "The impact of MS is often measured by what a person can or cannot do in daily life.",
      "MS may affect mobility, self-care, work, household responsibilities, communication, social participation and community activities. A person may still have the physical ability to perform an activity but need more time, more energy or assistance to complete it. Rehabilitation therefore considers both physical abilities and the person's environment, routines and priorities.",
    ],
    image: p[1],
    swap: true,
  }),
  about({
    heading: "What is multiple sclerosis rehabilitation?",
    description: [
      "MS rehabilitation is a goal-based process that helps a person maintain or improve function and independence despite the challenges caused by MS.",
      "Multiple sclerosis rehabilitation brings together assessment, goal setting, therapeutic intervention, education and regular review. Depending on the person's needs, it may include physiotherapy, occupational therapy, speech and swallowing therapy, cognitive rehabilitation, fatigue management, mobility training and other specialist input. Current rehabilitation guidance emphasises a holistic, multidisciplinary approach based on individual needs and goals.",
    ],
    image: p[2],
  }),
  about({
    heading: "Assessment comes before the rehabilitation plan",
    description: [
      "A good rehabilitation plan starts by understanding the person's current abilities, difficulties and priorities.",
      "Assessment looks at the areas that are relevant to the person's problems and goals. This may include mobility, balance, strength, coordination, walking, functional activities, cognition, communication, swallowing and other areas of daily function. Standardised assessments can help establish a baseline and provide a consistent way to measure change over time.",
    ],
    image: p[3],
    swap: true,
  }),
  about({
    heading: "Setting baseline goals",
    description: [
      "Rehabilitation goals should describe what the person wants to achieve, not simply what exercise they will perform.",
      "Goals may relate to walking independently, climbing stairs, transferring safely, managing fatigue during work, dressing independently, returning to community activities or participating more confidently with family. The rehabilitation team uses the baseline assessment to identify realistic and meaningful goals, which can then be reviewed as the person's condition and abilities change.",
    ],
    image: p[4],
  }),
  about({
    heading: "Physiotherapy for multiple sclerosis",
    description: [
      "Physiotherapy focuses on movement, mobility, balance, strength, endurance and physical function.",
      "Depending on the person's presentation, physiotherapy may address walking, balance, coordination, weakness, stiffness, transfers, endurance and physical activity. Exercise and physical activity can be an important part of MS management when appropriately selected and adapted to the individual's abilities and symptoms.",
    ],
    image: p[5],
    swap: true,
  }),
  about({
    heading: "Occupational therapy for multiple sclerosis",
    description: [
      "Occupational therapy helps people perform everyday activities more safely, efficiently and independently.",
      "Occupational therapy may focus on self-care, household activities, work, cognitive strategies, energy conservation, equipment and environmental adaptations. The emphasis is on helping the person participate in activities that are important to them rather than focusing only on impairment.",
    ],
    image: p[6],
  }),
  about({
    heading: "Balance, coordination and mobility",
    description: [
      "Balance and walking problems can affect safety, confidence and independence.",
      "MS-related weakness, altered sensation, coordination problems, fatigue or stiffness can contribute to difficulty walking or maintaining balance. Rehabilitation may therefore address balance strategies, walking practice, transfers, mobility aids and safe movement. The appropriate approach depends on the individual's assessment rather than the diagnosis alone.",
    ],
    image: p[7],
    swap: true,
  }),
  about({
    heading: "Fatigue and sleep",
    description: [
      "MS fatigue is more than simply feeling tired and can significantly affect daily function.",
      "Fatigue may reduce a person's ability to work, exercise, socialise or complete everyday activities. Rehabilitation may include identifying fatigue triggers, planning activities, balancing activity and rest, improving efficiency and addressing factors that contribute to poor sleep or reduced energy. Fatigue management should be individualised rather than based on a single exercise prescription.",
    ],
    image: p[0],
  }),
  about({
    heading: "Cognitive changes in MS",
    description: [
      "Changes in attention, memory, processing or planning can affect everyday independence even when physical abilities are relatively good.",
      "Cognitive difficulties may influence work, communication, medication routines, household tasks and decision-making. Rehabilitation can include identifying the specific cognitive difficulty, using practical strategies and adapting tasks or the environment to support successful participation.",
    ],
    image: p[1],
    swap: true,
  }),
  about({
    heading: "Spasticity and pain",
    description: [
      "Stiffness, muscle spasms and pain can interfere with movement, sleep, comfort and daily activities.",
      "Spasticity and pain need to be considered in the context of the person's overall function. Rehabilitation may involve positioning, movement strategies, stretching, strengthening, activity modification and appropriate medical management when required. The aim is not simply to reduce a symptom, but to understand how it affects meaningful function.",
    ],
    image: p[2],
  }),
  about({
    heading: "Speech and swallowing",
    description: [
      "Speech or swallowing difficulties can affect communication, nutrition, safety and participation.",
      "Some people with MS may develop difficulties with speech, voice or swallowing. A speech and swallowing assessment can help identify the nature of the problem and guide appropriate strategies or treatment. The rehabilitation plan should reflect the person's communication and nutritional needs as well as their everyday environment.",
    ],
    image: p[3],
    swap: true,
  }),
  about({
    heading: "MS treatment and rehabilitation work together",
    description: [
      "Medical treatment and rehabilitation have different but complementary roles in MS care.",
      "MS treatment may include disease-modifying therapies, medicines for specific symptoms and treatment of relapses, while rehabilitation focuses on function, participation, independence and adaptation. The appropriate medical treatment depends on the person's MS type, symptoms and clinical situation and should be managed by the relevant medical team.",
    ],
    image: p[4],
  }),
  about({
    heading: "Robotic rehabilitation and technology",
    description: [
      "Technology can be used as an additional rehabilitation tool when it matches the person's clinical and functional goals.",
      "Robotic rehabilitation may support repetitive, structured and task-focused practice for selected patients. Technology should not replace clinical assessment or therapist-guided rehabilitation; rather, it can be considered when the rehabilitation team believes it may add value to the individual's programme.",
    ],
    links: [["Robotic rehabilitation", "/robotic-rehab"]],
    image: p[5],
    swap: true,
  }),
  about({
    heading: "Reassessment: is rehabilitation working?",
    description: [
      "Rehabilitation should be measured rather than assumed to be effective.",
      "Reassessment compares the person's current performance with the baseline. Changes may be seen in walking, balance, transfers, endurance, self-care, communication or other meaningful activities. Standardised assessments can provide objective information, while patient and caregiver feedback can show whether improvements are translating into everyday life.",
    ],
    image: p[6],
  }),
  about({
    heading: "Outcomes that matter to the person",
    description: [
      "A successful rehabilitation outcome is not always a bigger movement or a higher test score; it may be doing something important with less assistance.",
      "Outcomes may include greater independence, safer mobility, improved participation, better activity tolerance, reduced caregiver dependence or the ability to return to a meaningful activity. The outcome selected should relate to the person's goals and be realistic for their clinical situation.",
    ],
    image: p[7],
    swap: true,
  }),
  about({
    heading: "Review and long-term MS rehabilitation",
    description: [
      "MS is a long-term condition, so rehabilitation may need to change as the person's needs change.",
      "A rehabilitation plan that is appropriate today may not remain appropriate indefinitely. Regular review helps identify new problems, changes in function, changing goals and opportunities for greater independence. Rehabilitation may therefore involve periods of more intensive therapy followed by maintenance, self-management or reassessment when new difficulties arise.",
    ],
    image: p[0],
  }),
  about({
    heading: "Community reintegration",
    description: [
      "Rehabilitation should ultimately help a person participate in life beyond the rehabilitation centre.",
      "Community reintegration may involve returning to work, travelling, shopping, attending social activities, managing family responsibilities or participating in hobbies. The rehabilitation team can identify barriers and develop strategies that make these activities safer and more achievable.",
    ],
    image: p[1],
    swap: true,
  }),
  about({
    heading: "Caregiver support",
    description: [
      "Families and caregivers need practical knowledge and support because MS can affect the whole household.",
      "Caregiver involvement may include understanding symptoms, supporting safe mobility, assisting with daily activities, recognising changing needs and learning when professional review may be required. Importantly, rehabilitation should also consider how much assistance the caregiver can realistically provide.",
    ],
    image: p[2],
  }),
  about({
    heading: "The Rehabana MS rehabilitation pathway",
    description: [
      "Rehabana connects clinical assessment with measurable functional goals and coordinated rehabilitation. The MS rehabilitation journey can be understood as:",
      "Condition → Symptoms → Problems → Functional Impact → Rehabilitation → Assessment → Baseline Goals → Interventions → Reassessment → Outcomes → Review → Caregiver Support",
      "This creates a continuous cycle rather than a one-time therapy programme. The person's needs and goals remain central while the rehabilitation team uses assessment and reassessment to guide the next step.",
    ],
    image: p[3],
    swap: true,
  }),
  faq("Frequently asked questions", [
    [
      "What is multiple sclerosis rehabilitation?",
      "Multiple sclerosis rehabilitation is a personalised process that helps a person manage the functional effects of MS and maintain or improve independence. It may include physiotherapy, occupational therapy, speech and swallowing therapy, cognitive strategies, mobility training, fatigue management and other interventions depending on the person's needs.",
      "Rehabilitation begins with assessment and meaningful goals, followed by targeted intervention and regular reassessment. The aim is to improve function and participation in everyday life rather than simply treating individual symptoms.",
    ],
    [
      "What is the likelihood of being affected by multiple sclerosis?",
      "Globally, approximately 0.04% of the population is affected by multiple sclerosis, which equates to about 1 in every 2,600 people.",
      "Females are disproportionately affected. In relapsing forms of MS (like RRMS), women are roughly 3 times more likely to be diagnosed than men, and women account for a median of 70% of total global MS cases. While men are less likely to get MS, men tend to experience a more severe disease course.",
      "The Multiple Sclerosis Society of India (MSSI) and health reports estimate that between 145,000 and 180,000 people are living with MS in India, which equates to about 1 in every 7,800 people.",
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

  const [existing, servicesPage, servicePages, contactPage] = await Promise.all([
    client.getByUID("condition", UID).catch(() => null),
    client.getSingle("services_page"),
    client.getAllByType("service_page"),
    client.getSingle("contact_page").catch(() => null),
  ]);

  const migration = prismic.createMigration();

  const diagrams = Object.fromEntries(
    Object.entries(DIAGRAMS).map(([key, { file, alt }]) => [
      key,
      migration.createAsset(fs.readFileSync(`${IMAGE_DIR}/${file}`), file, {
        alt,
      }),
    ]),
  );

  // Photos already in the media library, de-duplicated, as on Parkinson's.
  const seen = new Set();
  const photos = servicePages
    .flatMap((page) => page.data.slices)
    .filter((slice) => slice.slice_type === "about_section")
    .map((slice) => slice.primary.image)
    .filter((image) => image?.id && !seen.has(image.id) && seen.add(image.id))
    .slice(0, 8);

  const img = {
    hero: servicesPage.data.slices.find(
      (slice) => slice.slice_type === "hero_section",
    )?.primary.background_image,
    photos: [...Array(8)].map((_, i) => photos[i % photos.length]),
    diagrams,
  };

  const closing = cta({
    subheading: "Start with an MS rehabilitation assessment",
    heading: "Book an MS rehabilitation assessment",
    description:
      "Every person with MS has a different combination of symptoms, abilities, goals and challenges. A structured assessment can help identify the most important functional problems and which areas may benefit from rehabilitation. For people looking for multiple sclerosis rehabilitation in Kolkata, Rehabana's neurorehabilitation approach connects assessment and goal setting with targeted therapy and regular review.",
    button: contactPage && {
      ...prismic.documentToLinkField(contactPage),
      text: "Talk to the Rehabana team",
    },
  });

  const content = {
    ...FIELDS,
    // The SEO tab's image is also the card image on /conditions.
    featured_image: diagrams.neuron,
    slices: [...build(img), closing],
  };

  if (existing) {
    console.log(`  update  condition  ${UID}`);
    migration.updateDocument(
      { ...existing, data: { ...existing.data, ...content } },
      FIELDS.name,
    );
  } else {
    console.log(`  create  condition  ${UID}`);
    migration.createDocument(
      { type: "condition", uid: UID, lang: servicesPage.lang, data: content },
      FIELDS.name,
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
