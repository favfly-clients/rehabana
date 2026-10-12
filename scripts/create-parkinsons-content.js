/**
 * Seeds the conditions section with its first pillar: the /conditions hub,
 * Parkinson's Disease, and the nine Parkinson's topics in the site tree.
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
 * Safe to re-run: it only CREATES what is missing. A published document is
 * left as editors have it, except a topic marked `refresh` (rewritten) or one
 * found under `previousSlugs` (renamed). A document still unpublished in the
 * release is invisible to this script and would be created a second time, so
 * publish (or discard) the release before running it again.
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
    // Renamed to match the site tree, and rewritten to absorb the blog post
    // /how-speech-therapy-helps-patients-with-parkinsons-disease, which now
    // redirects here (vercel.json).
    slug: "speech-swallowing",
    previousSlugs: ["speech-and-swallowing"],
    refresh: true,
    title: "Speech and Swallowing",
    summary:
      "Why the voice gets softer and swallowing gets harder, and how speech therapy, including LSVT LOUD, helps.",
    meta_title: "Parkinson's Speech & Swallowing Problems | Therapy | Rehabana",
    meta_description:
      "How Parkinson's affects the voice and swallowing, the warning signs of dysphagia, and how speech therapy and LSVT LOUD help people be heard and eat safely.",
    build: (img) => [
      hero(
        "Speech and Swallowing in Parkinson's",
        "How Parkinson's affects the voice and swallowing, and how therapy helps people stay heard and eat safely.",
        img.hero,
      ),
      about({
        subheading: "What families notice",
        heading: "\"We can't hear him any more\"",
        description: [
          "Most people notice the shaking and stiffness of Parkinson's first. Families often say something else hurts more: a parent who has stopped joining conversations, a voice too quiet to follow, coughing over a glass of water.",
          "These changes affect confidence, dignity and connection. Speech therapy aims not at perfect speech but at making daily life feel normal again: being understood, eating without fear, and feeling included.",
        ],
        image: img.about[2],
      }),
      about({
        subheading: "Speech",
        heading: "How the voice changes",
        description: [
          "Parkinson's affects the small movements of the lips, tongue, voice box and throat. Over time the voice becomes softer and flatter, words blur together, and facial expression reduces. Talking becomes tiring.",
          "The hardest part is that most people feel they are speaking loudly and clearly. The sound that comes out is not what they feel inside, and that gap causes frustration on both sides.",
        ],
        items: [
          "A very soft voice",
          "Slurred or unclear words",
          "Flat, monotone speech",
          "Rushed speech or trailing off at the end of sentences",
          "Reduced facial expression",
        ],
        image: img.about[0],
      }),
      about({
        subheading: "Voice therapy",
        heading: "LSVT LOUD: retraining a normal voice",
        description: [
          "Lee Silverman Voice Treatment, known as LSVT LOUD, is the voice therapy with the strongest evidence in Parkinson's. People with Parkinson's gradually start using a small voice, and the brain comes to accept it as normal. LSVT LOUD recalibrates that sense of loudness through short, intensive, repeated practice.",
          "Alongside it, therapists work on clear articulation, pacing, facial expression and strategies for noisy places and phone calls.",
        ],
        items: [
          "Speak louder without straining",
          "Sound clearer and be understood first time",
          "Join conversations with confidence again",
        ],
        image: img.about[3],
        swap: true,
      }),
      about({
        subheading: "Swallowing",
        heading: "Signs of swallowing difficulty",
        description: [
          "Speech and swallowing use the same muscles, so swallowing problems (dysphagia) often develop too. They matter because food or drink entering the airway can cause aspiration pneumonia, a serious chest infection. A speech therapist assesses swallowing and teaches safer techniques, postures and food textures.",
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
          "Structured, intensive voice therapy such as LSVT LOUD has good evidence in Parkinson's. The key is regular practice at home between sessions.",
        ],
        [
          "Can speech therapy cure Parkinson's speech problems?",
          "It cannot cure Parkinson's, but it helps people manage the parts of the disease that affect talking and eating, and the gains are greatest when therapy starts early.",
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
  {
    slug: "occupational-therapy",
    title: "Occupational Therapy",
    summary:
      "Keeping up with dressing, eating, writing and work: how occupational therapy protects independence.",
    meta_title: "Occupational Therapy for Parkinson's Disease | Rehabana",
    meta_description:
      "How occupational therapy helps people with Parkinson's manage daily tasks like dressing, eating, writing and bathing, with practical tools and home adaptations.",
    build: (img) => [
      hero(
        "Occupational Therapy for Parkinson's",
        "Practical help with the everyday tasks Parkinson's makes harder, so people can stay independent for longer.",
        img.hero,
      ),
      about({
        subheading: "What it is",
        heading: "Occupational therapy in Parkinson's",
        description: [
          "Occupational therapy focuses on the activities that make up a day: getting dressed, eating, bathing, writing, cooking, working and hobbies. As Parkinson's slows movement and reduces fine hand control, these tasks take longer and become frustrating.",
          "An occupational therapist looks at how the person does each task, then changes the method, the tools or the environment so it becomes manageable again.",
        ],
        image: img.about[0],
      }),
      about({
        subheading: "What it covers",
        heading: "How an occupational therapist helps",
        description: ["Typical goals include:"],
        items: [
          "Easier ways to dress, such as sitting down and using simple fastenings",
          "Adapted cutlery, cups and plates for eating with less spillage",
          "Handwriting practice and alternatives such as typing or voice tools",
          "Bathroom and bedroom changes for safer transfers",
          "Energy planning so important tasks fall at the best times of day",
          "Staying in work or hobbies for as long as possible",
        ],
        image: img.about[1],
        swap: true,
      }),
      faq("Occupational therapy questions", [
        [
          "How is occupational therapy different from physiotherapy?",
          "Physiotherapy works on movement itself: walking, balance and strength. Occupational therapy works on using that movement for daily tasks, and on adapting the tasks and the home.",
        ],
        [
          "Why has handwriting become so small?",
          "Small, cramped handwriting (micrographia) is common in Parkinson's. Practising large, deliberate letters and using thicker pens often helps.",
        ],
        [
          "Is it only for advanced Parkinson's?",
          "No. Early input sets up good habits and home changes before problems build up.",
        ],
      ]),
    ],
  },
  {
    slug: "rehabilitation",
    title: "Rehabilitation",
    summary:
      "What a complete Parkinson's rehabilitation programme looks like, who is in the team, and when to start.",
    meta_title: "Parkinson's Rehabilitation: Programme, Team & Goals | Rehabana",
    meta_description:
      "A guide to Parkinson's rehabilitation: the multidisciplinary team, what each therapy does, how goals are set at each stage, and why starting early matters.",
    build: (img) => [
      hero(
        "Rehabilitation for Parkinson's Disease",
        "How a coordinated team helps people with Parkinson's keep moving, speaking and living independently at every stage.",
        img.hero,
      ),
      about({
        subheading: "Why rehab",
        heading: "Medicine and rehabilitation work together",
        description: [
          "Medicines prescribed by a neurologist help replace the dopamine the brain is missing. They do not, on their own, retrain walking, balance, voice or daily routines. Rehabilitation does.",
          "A common misconception is that rehabilitation is only for later stages. In fact it helps most when it starts soon after diagnosis, while there is more to protect.",
        ],
        image: img.about[0],
      }),
      about({
        subheading: "The team",
        heading: "Who is involved",
        description: [
          "Parkinson's affects many systems, so good rehabilitation is multidisciplinary, led by a rehabilitation physician who sets goals with the person and the family.",
        ],
        items: [
          "Physiotherapist: walking, balance, posture and fall prevention",
          "Occupational therapist: daily tasks and home safety",
          "Speech therapist: voice, communication and swallowing",
          "Psychologist: mood, anxiety and adjustment",
          "Dietitian: nutrition, weight and constipation",
        ],
        image: img.about[1],
        swap: true,
      }),
      about({
        subheading: "How it runs",
        heading: "Goals at each stage",
        description: [
          "Early on, the focus is fitness, posture and habits that slow decline in function. In the middle stage it shifts to balance, freezing, fall prevention and voice. Later, it is about safe transfers, swallowing, comfort and supporting caregivers.",
          "Progress is measured regularly so the programme can be adjusted, and every plan includes exercises to continue at home.",
        ],
        image: img.about[2],
      }),
      faq("Rehabilitation questions", [
        [
          "How long does Parkinson's rehabilitation last?",
          "Parkinson's is long term, so rehabilitation is usually done in blocks of focused therapy followed by a home programme, repeated as needs change.",
        ],
        [
          "Can rehabilitation reverse Parkinson's?",
          "No, but it can improve walking, balance, voice and independence, and help people keep those gains for longer.",
        ],
        [
          "Is rehabilitation useful in advanced Parkinson's?",
          "Yes. Goals change to safety, comfort, swallowing and supporting the family, but there is still a lot rehabilitation can do.",
        ],
      ]),
    ],
  },
  {
    slug: "symptoms",
    title: "Symptoms and Early Signs",
    summary:
      "The early signs of Parkinson's, the main motor symptoms, and when to see a neurologist.",
    meta_title: "Parkinson's Disease Symptoms & Early Signs | Rehabana",
    meta_description:
      "Learn the early signs and main symptoms of Parkinson's disease: tremor, slowness, stiffness, balance problems and non-motor changes, and when to see a doctor.",
    build: (img) => [
      hero(
        "Symptoms of Parkinson's Disease",
        "The early signs that are easy to miss, the main symptoms doctors look for, and when to get checked.",
        img.hero,
      ),
      about({
        subheading: "Early signs",
        heading: "Signs that can appear first",
        description: [
          "Parkinson's starts slowly, and the first signs are often put down to age or stress. Some appear years before the diagnosis.",
        ],
        items: [
          "A slight tremor in one finger, hand or chin at rest",
          "Smaller handwriting",
          "Loss of sense of smell",
          "Acting out dreams during sleep",
          "Constipation that is new or persistent",
          "A softer voice or a less expressive face",
          "Stiffness or reduced arm swing on one side when walking",
        ],
        image: img.about[0],
      }),
      about({
        subheading: "Main symptoms",
        heading: "The symptoms doctors look for",
        description: [
          "A diagnosis is based on slowness of movement (bradykinesia) together with tremor at rest, stiffness (rigidity), or both. Balance problems usually come later.",
          "Symptoms typically begin on one side of the body and stay worse on that side. Parkinson's also has non-motor symptoms, such as low mood, sleep problems and dizziness, which are covered in their own guide.",
        ],
        image: img.about[1],
        swap: true,
      }),
      faq("Symptom questions", [
        [
          "Is every tremor Parkinson's?",
          "No. The most common tremor, essential tremor, happens when the hands are being used rather than at rest. Only a doctor can tell the difference reliably.",
        ],
        [
          "Can young people get Parkinson's?",
          "Yes. Young-onset Parkinson's begins before 50. It is less common but well recognised.",
        ],
        [
          "When should I see a doctor?",
          "If several of the early signs appear together, or one side of the body is becoming slower or stiffer, see a neurologist for an assessment.",
        ],
      ]),
    ],
  },
  {
    // Absorbs the blog post /new-treatment-for-parkinson-emerging-in-india,
    // which redirects here (vercel.json).
    slug: "treatments",
    title: "Treatment Options",
    summary:
      "Medicines, surgery, rehabilitation and the research on the horizon: an overview of Parkinson's treatment.",
    meta_title: "Parkinson's Disease Treatment Options & New Research | Rehabana",
    meta_description:
      "An overview of Parkinson's treatment: levodopa and other medicines, deep brain stimulation, rehabilitation, and new research including work from India.",
    build: (img) => [
      hero(
        "Treatment Options for Parkinson's",
        "There is no cure yet, but treatment can control symptoms well for many years. Here is what is available and what is being researched.",
        img.hero,
      ),
      about({
        subheading: "Medicines",
        heading: "Medicines for Parkinson's",
        description: [
          "Medicines are prescribed and adjusted by a neurologist. Levodopa, which the brain converts into dopamine, is the most effective. Other options include dopamine agonists, MAO-B inhibitors and COMT inhibitors, often used in combination.",
          "Over time, people may notice the effect wearing off before the next dose. Timing doses carefully and keeping a symptom diary helps the neurologist fine-tune treatment.",
        ],
        image: img.about[0],
      }),
      about({
        subheading: "Beyond tablets",
        heading: "Surgery and rehabilitation",
        description: [
          "For some people whose symptoms fluctuate despite good medicine management, deep brain stimulation (DBS) is an option. Electrodes placed in the brain are controlled by a device under the skin. It requires careful selection by a specialist team.",
          "Rehabilitation is the other pillar of treatment. Physiotherapy, occupational therapy, speech therapy and psychological support improve function and quality of life from the time of diagnosis.",
        ],
        image: img.about[1],
        swap: true,
      }),
      about({
        subheading: "Research",
        heading: "New treatments on the horizon",
        description: [
          "Research into Parkinson's is active worldwide, including in India. Indian scientists have reported laboratory work on nano-formulations that deliver drugs such as 17β-oestradiol or melatonin to the brain more precisely, with the aim of protecting nerve cells.",
          "These approaches are experimental and not yet available as treatment. Until they are proven in patients, the best results come from combining medicines with early, consistent rehabilitation.",
        ],
        image: img.about[2],
      }),
      faq("Treatment questions", [
        [
          "Does levodopa stop working over time?",
          "It keeps working, but its effect can become shorter and less smooth. Adjusting doses and adding other medicines usually helps.",
        ],
        [
          "Who is suitable for deep brain stimulation?",
          "Usually people with good response to levodopa who have troublesome fluctuations or tremor, without significant memory problems. A specialist team assesses each case.",
        ],
        [
          "Should rehabilitation wait until medicines stop working?",
          "No. Rehabilitation works best alongside medicines from early on.",
        ],
      ]),
    ],
  },
];

// The order the site tree lists them in; `order` on each document follows it.
const TREE_ORDER = [
  "caregiver-guide",
  "gait-and-mobility",
  "non-motor-symptoms",
  "occupational-therapy",
  "physiotherapy",
  "rehabilitation",
  "speech-swallowing",
  "symptoms",
  "treatments",
];
TOPICS.sort((a, b) => TREE_ORDER.indexOf(a.slug) - TREE_ORDER.indexOf(b.slug));

// ---------------------------------------------------------------------------
// Migration
// ---------------------------------------------------------------------------

const seo = (entry, featuredImage) => ({
  meta_title: entry.meta_title,
  meta_description: entry.meta_description,
  ...(featuredImage && { featured_image: featuredImage }),
});

const strip = ({ build, slug, previousSlugs, refresh, ...rest }) => rest;

/** A document from this run or an existing one, as a link field value. */
const asLink = (doc) =>
  doc instanceof prismic.PrismicMigrationDocument
    ? doc
    : prismic.documentToLinkField(doc);

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

  const find = (type, uid) =>
    uid
      ? client.getByUID(type, uid).catch(() => null)
      : client.getSingle(type).catch(() => null);

  /**
   * Creates the document if it doesn't exist. An existing one is LEFT ALONE —
   * editors may have changed it in Prismic since — unless `refresh` is set.
   * A document found under one of `previousSlugs` is renamed to `uid`.
   */
  const ensure = async (
    type,
    uid,
    data,
    title,
    { refresh = false, previousSlugs = [] } = {},
  ) => {
    let existing = await find(type, uid);
    let renamedFrom = null;

    for (const old of previousSlugs) {
      if (existing) break;
      existing = await find(type, old);
      if (existing) renamedFrom = old;
    }

    if (!existing) {
      console.log(`  create  ${type}  ${uid || ""}`);
      return migration.createDocument(
        { type, ...(uid && { uid }), lang, data },
        title,
      );
    }

    if (!refresh && !renamedFrom) {
      console.log(`  keep    ${type}  ${uid || ""}`);
      return existing;
    }

    console.log(
      `  update  ${type}  ${uid}${renamedFrom ? `  (renamed from ${renamedFrom})` : ""}`,
    );
    return migration.updateDocument(
      { ...existing, uid, data: refresh ? data : existing.data },
      title,
    );
  };

  await ensure(
    "conditions_page",
    null,
    {
      ...strip(HUB),
      ...seo(HUB, heroImage),
      slices: [...HUB.build(img), closingCta],
    },
    "Conditions",
  );

  const condition = await ensure(
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
    await ensure(
      "condition_topic",
      `${CONDITION_UID}-${topic.slug}`,
      {
        ...strip(topic),
        order: index + 1,
        condition: asLink(condition),
        ...seo(topic, img.about[index % img.about.length]),
        slices: [...topic.build(img), closingCta],
      },
      `${CONDITION.name}: ${topic.title}`,
      {
        refresh: topic.refresh,
        previousSlugs: (topic.previousSlugs ?? []).map(
          (slug) => `${CONDITION_UID}-${slug}`,
        ),
      },
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
