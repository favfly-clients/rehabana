/**
 * Creates the 13 Multiple Sclerosis topic pages from the site tree, under
 * /conditions/multiple-sclerosis/<topic>.
 *
 *   node_modules/.bin/jiti scripts/create-multiple-sclerosis-topics.js
 *
 * Needs PRISMIC_WRITE_TOKEN in .env.local and the Multiple Sclerosis condition
 * PUBLISHED (the topics link to it). Writes into the Migration Release.
 *
 * Create-only: a topic that already exists is left exactly as editors have it,
 * so it is safe to re-run after adding a topic below.
 *
 * The copy is a starting draft written to match the client's MS page — the
 * national layer, no city names — for the client to edit in Prismic. It should
 * be read by a clinician before it is published.
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
  loadLibraryImages,
} from "./lib/prismic-content";

const REPOSITORY =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

const CONDITION_UID = "multiple-sclerosis";
const CONDITION_NAME = "Multiple Sclerosis";

/**
 * One entry per topic, in site-tree order (which also sets `order`).
 * `sections` are About sections: [subheading, heading, paragraphs, list?].
 */
const TOPICS = [
  {
    slug: "balance-and-coordination",
    title: "Balance and Coordination",
    summary:
      "Why MS affects balance and coordination, and how targeted rehabilitation helps people move more safely.",
    meta_title: "MS Balance & Coordination Problems: Rehabilitation | Rehabana",
    meta_description:
      "Why multiple sclerosis affects balance and coordination, the risk of falls, and how balance training and coordination exercises help people with MS.",
    intro:
      "Why MS can make people unsteady or clumsy, and how rehabilitation helps them move with more confidence.",
    sections: [
      [
        "Why it happens",
        "How MS affects balance and coordination",
        [
          "Staying balanced relies on several systems working together: the cerebellum, the sensory nerves that tell the brain where the feet and joints are, the inner ear, vision and muscle strength. MS can affect any of these pathways.",
          "When the cerebellum or its connections are involved, movements can become less accurate, a problem called ataxia. Reduced sensation in the feet, weakness, stiffness and fatigue can add to unsteadiness.",
        ],
        [
          "Feeling unsteady when standing or turning",
          "Swaying or needing to hold on when walking",
          "Clumsy or shaky hand movements (intention tremor)",
          "Difficulty with fine tasks such as buttons or writing",
          "Falls or near-falls, especially when tired",
        ],
      ],
      [
        "What helps",
        "Rehabilitation for balance and coordination",
        [
          "A physiotherapist first works out which systems are contributing to the problem, because the right exercises depend on the cause. Training is then built around the activities where balance matters most for that person.",
        ],
        [
          "Static and dynamic balance exercises",
          "Core and trunk stability training",
          "Coordination and accuracy practice for arms and legs",
          "Strategies for turning, reaching and stepping safely",
          "Vestibular exercises when dizziness is part of the picture",
          "Advice on walking aids and home safety to reduce falls",
        ],
      ],
    ],
    faq: [
      [
        "Can balance improve with MS?",
        "Many people improve their balance and confidence with targeted, regular training, even when MS has been present for years.",
      ],
      [
        "Why is my balance worse at the end of the day?",
        "Fatigue and heat both affect nerve conduction in MS, so symptoms such as unsteadiness often worsen when tired or warm and settle with rest.",
      ],
      [
        "Should I use a walking aid?",
        "Sometimes an aid makes walking safer and less tiring. It should be chosen after an assessment so it suits the person's balance and walking pattern.",
      ],
    ],
  },
  {
    slug: "caregiver-guide",
    heroTitle: "A Caregiver's Guide to Multiple Sclerosis",
    title: "Caregiver Guide",
    summary:
      "Practical guidance for families supporting someone with MS, from invisible symptoms to looking after yourself.",
    meta_title: "MS Caregiver Guide: Supporting Someone with MS | Rehabana",
    meta_description:
      "A practical guide for families and caregivers of people with multiple sclerosis: understanding symptoms, supporting daily life and caring for yourself.",
    intro:
      "How to support someone living with MS while respecting their independence, and how to look after yourself too.",
    sections: [
      [
        "Understanding MS",
        "Symptoms you can't always see",
        [
          "Many MS symptoms are invisible. Fatigue, pain, altered sensation, memory or concentration difficulties and low mood can be as limiting as problems with walking, but are easy to underestimate.",
          "Symptoms can also change from day to day, and may worsen temporarily with heat, infection or tiredness. A good day followed by a difficult one is part of the condition, not a lack of effort.",
        ],
      ],
      [
        "Daily support",
        "Helping without taking over",
        [
          "Support works best when it is agreed with the person, not imposed. Ask what help is useful and leave room for them to do what they can, even if it takes longer.",
        ],
        [
          "Plan demanding tasks for the person's best time of day",
          "Build in rest breaks and keep the home cool in hot weather",
          "Learn safe ways to help with transfers from the therapy team",
          "Use calendars, reminders and routines to support memory",
          "Notice new or worsening symptoms and encourage a review",
        ],
      ],
      [
        "Your wellbeing",
        "Looking after yourself",
        [
          "MS is a long-term condition, and caring can be demanding over months and years. Share the load with family, keep up your own health appointments and take regular breaks.",
          "Rehabilitation should also consider how much assistance a caregiver can realistically provide. If caring is becoming difficult, tell the care team so the plan can be adjusted.",
        ],
      ],
    ],
    faq: [
      [
        "What is an MS relapse?",
        "A relapse is new symptoms, or a clear worsening of old ones, lasting more than 24 hours without another cause such as an infection or fever. Contact the treating neurologist if you suspect one.",
      ],
      [
        "How can I help with fatigue?",
        "Help plan the day so important activities come first, encourage rest before exhaustion, and share household tasks so energy is saved for what matters most.",
      ],
      [
        "Should I come to therapy sessions?",
        "With the person's agreement, it is often very useful. You can learn the strategies being practised and how to support them safely at home.",
      ],
    ],
  },
  {
    slug: "cognitive-changes",
    title: "Cognitive Changes",
    summary:
      "How MS can affect memory, attention and thinking speed, and the practical strategies that help.",
    meta_title: "Cognitive Changes in MS: Memory & Attention | Rehabana",
    meta_description:
      "How multiple sclerosis can affect memory, attention, processing speed and planning, and how assessment and cognitive rehabilitation strategies help.",
    intro:
      "Thinking and memory changes are common in MS and often go unnoticed. Here is what they look like and what helps.",
    sections: [
      [
        "What changes",
        "How MS can affect thinking",
        [
          "Cognitive changes are common in MS and can occur at any stage, including early on. They are usually specific rather than general, and many people are affected mildly.",
        ],
        [
          "Slower information processing",
          "Difficulty concentrating or dividing attention",
          "Problems remembering recent information",
          "Difficulty planning, organising or problem-solving",
          "Word-finding difficulties",
        ],
      ],
      [
        "What helps",
        "Assessment and practical strategies",
        [
          "A cognitive assessment identifies which skills are affected and which are strong, so strategies can be matched to the person's work, home and routines.",
          "Cognitive rehabilitation combines practice with compensatory strategies, such as using calendars and phone reminders, keeping routines, doing one task at a time, reducing distractions and scheduling demanding tasks when energy is highest. Fatigue, low mood and poor sleep all affect thinking, so managing them is part of the plan.",
        ],
      ],
    ],
    faq: [
      [
        "Does MS cause dementia?",
        "Severe cognitive decline is uncommon in MS. Most changes are milder and specific, such as slower processing or attention difficulties.",
      ],
      [
        "Why is my thinking worse when I'm tired?",
        "Fatigue, heat, infection and stress all affect cognitive performance in MS. Many people find thinking is clearer earlier in the day or after rest.",
      ],
      [
        "Can cognitive changes affect work?",
        "They can, but strategies and reasonable adjustments, such as written instructions, fewer interruptions and flexible scheduling, often help people stay in work.",
      ],
    ],
  },
  {
    slug: "community-reintegration",
    title: "Community Reintegration",
    summary:
      "Getting back to work, travel, social life and hobbies with MS, and how rehabilitation removes the barriers.",
    meta_title: "Community Reintegration with MS: Work, Travel & Life | Rehabana",
    meta_description:
      "How rehabilitation helps people with multiple sclerosis return to work, travel, social activities and hobbies by identifying and removing practical barriers.",
    intro:
      "Rehabilitation should help people with MS take part in life beyond the clinic: work, family, travel and the things they enjoy.",
    sections: [
      [
        "The goal",
        "Life beyond the rehabilitation centre",
        [
          "The real measure of rehabilitation is whether a person can do the things that matter to them in their own community. That might be returning to work, shopping independently, travelling, attending family events or getting back to a hobby.",
          "The rehabilitation team looks at what is getting in the way, whether physical, cognitive, environmental or related to fatigue, and builds a plan around specific activities.",
        ],
      ],
      [
        "Common goals",
        "Areas rehabilitation can address",
        [
          "Each plan is built around the person's own priorities. Typical areas include:",
        ],
        [
          "Returning to work, with adjustments to tasks, hours or the workplace",
          "Using public transport or getting in and out of a car",
          "Walking in busy or uneven outdoor environments",
          "Planning outings around fatigue and heat",
          "Managing bladder urgency when away from home",
          "Social participation and confidence",
        ],
      ],
    ],
    faq: [
      [
        "Can people with MS keep working?",
        "Many people with MS continue working for many years, often with reasonable adjustments such as flexible hours, rest breaks or changes to the workplace.",
      ],
      [
        "How can I manage outings when I tire easily?",
        "Plan routes and rest stops in advance, avoid the hottest part of the day, and save energy for the activity itself. An occupational therapist can help build a practical plan.",
      ],
      [
        "Is driving possible with MS?",
        "Many people with MS drive. If symptoms affect vision, reaction time, sensation or leg control, a medical and driving assessment can advise on safety and adaptations.",
      ],
    ],
  },
  {
    slug: "fatigue-and-sleep",
    title: "Fatigue and Sleep",
    summary:
      "Why MS fatigue is different from ordinary tiredness, and how energy management and better sleep help.",
    meta_title: "MS Fatigue & Sleep: Energy Management Strategies | Rehabana",
    meta_description:
      "Why fatigue is one of the most common symptoms of multiple sclerosis, what makes it worse, and how energy conservation, exercise and better sleep help.",
    intro:
      "Fatigue is one of the most common and disabling symptoms of MS. Here is why it happens and how rehabilitation helps people manage it.",
    sections: [
      [
        "Understanding fatigue",
        "More than feeling tired",
        [
          "MS fatigue is an overwhelming lack of physical or mental energy that can appear without obvious exertion and does not always improve with a night's sleep. It is one of the most common symptoms of MS and a frequent reason people reduce work or social activity.",
          "It can come directly from MS, or be made worse by other factors such as poor sleep, pain, low mood, heat, infection, inactivity and some medicines. Identifying these contributors is the first step.",
        ],
      ],
      [
        "What helps",
        "Managing energy through the day",
        [
          "Fatigue management is individual. Strategies often follow the principles of prioritising, planning and pacing.",
        ],
        [
          "Prioritise the activities that matter most",
          "Plan the day and week to spread demanding tasks",
          "Pace activity with rest before exhaustion sets in",
          "Simplify tasks and sit down to do them where possible",
          "Keep cool, as heat temporarily worsens MS symptoms",
          "Regular, appropriate exercise, which can reduce fatigue over time",
        ],
      ],
      [
        "Sleep",
        "Sleep problems in MS",
        [
          "Sleep can be disturbed by needing to pass urine at night, muscle spasms, pain, low mood or restless legs. Treating these causes, together with a regular sleep routine, can improve both sleep and daytime energy.",
        ],
      ],
    ],
    faq: [
      [
        "Will exercise make my fatigue worse?",
        "Appropriate exercise usually reduces MS fatigue over time. The programme should start gently and be built up gradually with rest days.",
      ],
      [
        "Why does heat make me feel worse?",
        "Raised body temperature slows conduction in damaged nerves, so symptoms can temporarily worsen. They usually settle once the person cools down.",
      ],
      [
        "Should fatigue be discussed with the doctor?",
        "Yes. Sudden or severe new fatigue can have other causes, such as infection, anaemia, thyroid problems, depression or medicine side effects, which need checking.",
      ],
    ],
  },
  {
    slug: "gait-and-mobility",
    title: "Gait and Mobility",
    summary:
      "How MS changes walking, from foot drop to tiring over distance, and how gait training and aids help.",
    meta_title: "MS Gait & Mobility: Walking Problems & Rehab | Rehabana",
    meta_description:
      "How multiple sclerosis affects walking, including foot drop, weakness and fatigue, and how gait training, strengthening and walking aids help mobility.",
    intro:
      "Walking difficulties are among the most common effects of MS. Here is what causes them and how rehabilitation helps people keep moving.",
    sections: [
      [
        "What changes",
        "How MS affects walking",
        [
          "Walking depends on strength, sensation, balance, coordination and energy. MS can affect any of these, so walking problems look different from person to person.",
        ],
        [
          "Foot drop: catching the toes or tripping",
          "Leg weakness or stiffness (spasticity)",
          "Walking becoming slower or harder over distance",
          "Unsteadiness and fear of falling",
          "Needing more effort, which adds to fatigue",
        ],
      ],
      [
        "What helps",
        "Gait training and mobility support",
        [
          "A gait assessment identifies what is limiting walking and how it changes with distance and fatigue. Treatment then combines practice with the right support.",
        ],
        [
          "Walking practice and gait retraining",
          "Strengthening and stretching for the legs and trunk",
          "Ankle-foot orthoses for foot drop",
          "Functional electrical stimulation for selected people",
          "Walking aids, chosen and fitted after assessment",
          "Using a wheelchair or scooter for longer distances to save energy",
        ],
      ],
    ],
    faq: [
      [
        "Does using a wheelchair for long distances mean giving up walking?",
        "No. Using mobility equipment for longer distances can save energy for walking where it matters most and keep people active in the community.",
      ],
      [
        "What is foot drop?",
        "Foot drop is difficulty lifting the front of the foot, which makes the toes catch. Exercises, an ankle-foot orthosis or electrical stimulation can help.",
      ],
      [
        "Can walking improve after a relapse?",
        "Often, yes. Many people recover some or all function after a relapse, and rehabilitation can support that recovery.",
      ],
    ],
  },
  {
    slug: "occupational-therapy",
    title: "Occupational Therapy",
    summary:
      "How occupational therapy helps people with MS manage self-care, work and home life more easily.",
    meta_title: "Occupational Therapy for Multiple Sclerosis | Rehabana",
    meta_description:
      "How occupational therapy helps people with multiple sclerosis manage daily activities, conserve energy, use equipment and adapt home and work.",
    intro:
      "Occupational therapy helps people with MS carry on doing the everyday activities that matter to them, safely and with less effort.",
    sections: [
      [
        "What it is",
        "Focusing on everyday activities",
        [
          "Occupational therapy looks at the activities that fill a person's day, such as washing, dressing, cooking, working, studying and leisure, and finds ways to make them manageable despite MS symptoms.",
          "Rather than focusing only on the impairment, the emphasis is on helping the person participate in activities that are important to them.",
        ],
      ],
      [
        "What it covers",
        "How an occupational therapist helps",
        [
          "Depending on the person's needs, occupational therapy may include:",
        ],
        [
          "Energy conservation and fatigue management",
          "Easier methods for self-care and household tasks",
          "Hand function and fine motor practice",
          "Cognitive strategies for memory and organisation",
          "Equipment and home adaptations for safety",
          "Workplace adjustments and return-to-work planning",
        ],
      ],
    ],
    faq: [
      [
        "How is occupational therapy different from physiotherapy?",
        "Physiotherapy focuses on movement, strength and walking. Occupational therapy focuses on using those abilities in daily tasks, and on adapting tasks, equipment and the environment.",
      ],
      [
        "Can occupational therapy help with fatigue?",
        "Yes. Energy conservation, task planning and simplifying routines are a core part of occupational therapy for MS.",
      ],
      [
        "Do I need occupational therapy if I can still manage?",
        "Early input can make tasks easier and set up habits and adaptations before difficulties build up.",
      ],
    ],
  },
  {
    slug: "physiotherapy",
    title: "Physiotherapy",
    summary:
      "How physiotherapy and appropriate exercise help people with MS maintain strength, mobility and independence.",
    meta_title: "Physiotherapy for Multiple Sclerosis: Exercise & Mobility | Rehabana",
    meta_description:
      "How physiotherapy helps people with multiple sclerosis: strength, balance and walking, safe exercise, managing heat and fatigue, and progressing over time.",
    intro:
      "Physiotherapy helps people with MS stay as strong, mobile and independent as possible, with exercise matched to their symptoms.",
    sections: [
      [
        "Why it matters",
        "Exercise is part of MS management",
        [
          "Appropriate exercise and physical activity can improve strength, walking, balance, fitness and fatigue in MS, and support mood and general health. The key is choosing and adapting the exercise to the individual.",
          "A physiotherapist assesses movement, strength, balance, stiffness and endurance, then builds a programme around the person's goals and progresses it over time.",
        ],
      ],
      [
        "What it includes",
        "A typical physiotherapy programme",
        ["Programmes are individual, but commonly combine:"],
        [
          "Strengthening for weak muscle groups",
          "Aerobic exercise to build fitness and reduce fatigue",
          "Balance and coordination training",
          "Stretching and positioning for stiffness",
          "Walking and transfer practice",
          "A home exercise plan that fits around energy levels",
        ],
      ],
    ],
    faq: [
      [
        "Can exercise trigger an MS relapse?",
        "Exercise does not cause relapses. Getting warm during exercise can temporarily bring on symptoms, which settle once the body cools down.",
      ],
      [
        "How can I exercise without overheating?",
        "Exercise in a cool environment, use a fan, drink cold water, take rest breaks, and avoid the hottest part of the day.",
      ],
      [
        "Should I stop exercising during a relapse?",
        "The programme may need to change during a relapse. Discuss it with the treating team and resume gradually as recovery allows.",
      ],
    ],
  },
  {
    slug: "rehabilitation",
    title: "Rehabilitation",
    summary:
      "What a complete MS rehabilitation programme involves, who is in the team, and how it changes over time.",
    meta_title: "Multiple Sclerosis Rehabilitation: Programme & Team | Rehabana",
    meta_description:
      "How multiple sclerosis rehabilitation works: multidisciplinary assessment, goal setting, therapy, rehabilitation after relapses and long-term review.",
    intro:
      "MS rehabilitation is an ongoing, goal-based process that helps people maintain or improve function as their needs change.",
    sections: [
      [
        "The approach",
        "A goal-based, multidisciplinary process",
        [
          "MS rehabilitation brings together assessment, goal setting, therapy, education and regular review. It focuses on what the person wants to be able to do, rather than on a single symptom.",
          "Because MS changes over time, rehabilitation is not one fixed course. It may involve periods of more intensive therapy, followed by maintenance, self-management and review when new difficulties arise.",
        ],
      ],
      [
        "The team",
        "Who may be involved",
        [
          "Depending on the person's needs, the team may include:",
        ],
        [
          "Rehabilitation physician to lead assessment and goals",
          "Physiotherapist for movement, balance and walking",
          "Occupational therapist for daily activities and fatigue",
          "Speech and language therapist for communication and swallowing",
          "Psychologist for mood, adjustment and cognition",
        ],
      ],
      [
        "When",
        "Rehabilitation at different times",
        [
          "Rehabilitation can help at diagnosis, to set up healthy habits; after a relapse, to support recovery; and when function gradually changes, to adapt strategies and equipment. Regular review keeps the plan matched to current needs.",
        ],
      ],
    ],
    faq: [
      [
        "Is rehabilitation only for advanced MS?",
        "No. Rehabilitation can help at any stage, including soon after diagnosis.",
      ],
      [
        "Does rehabilitation help after a relapse?",
        "Yes. It can support recovery of function after a relapse, alongside any medical treatment the neurologist recommends.",
      ],
      [
        "How is progress measured?",
        "Through standardised assessments repeated over time, alongside the person's own goals and feedback from family or caregivers.",
      ],
    ],
  },
  {
    slug: "spasticity-and-pain",
    title: "Spasticity and Pain",
    summary:
      "Managing stiffness, spasms and pain in MS so they interfere less with movement, sleep and daily life.",
    meta_title: "MS Spasticity & Pain: Stiffness, Spasms & Relief | Rehabana",
    meta_description:
      "How multiple sclerosis causes spasticity, spasms and pain, what makes them worse, and how stretching, positioning, therapy and medical treatment help.",
    intro:
      "Stiffness, spasms and pain are common in MS. Here is what causes them and how rehabilitation and medical care work together to manage them.",
    sections: [
      [
        "Spasticity",
        "Stiffness and spasms",
        [
          "Spasticity is increased muscle tone caused by damage to the nerve pathways that control movement. It can make limbs feel stiff or heavy and cause sudden spasms, often in the legs.",
          "Spasticity can worsen with triggers such as infection, constipation, a full bladder, pressure sores, tight clothing or pain, so these are checked first.",
        ],
        [
          "Regular stretching and range-of-movement exercises",
          "Good positioning in bed and when sitting",
          "Strengthening and movement practice",
          "Splints where appropriate",
          "Medicines or targeted injections, prescribed by a doctor",
        ],
      ],
      [
        "Pain",
        "Types of pain in MS",
        [
          "Some pain comes directly from nerve damage (neuropathic pain), such as burning or tingling sensations, or an electric-shock feeling down the spine when bending the neck. Other pain is musculoskeletal, from posture, stiffness or altered walking.",
          "Managing pain starts with understanding its type and how it affects function. Rehabilitation addresses posture, movement and activity, alongside medical treatment for nerve pain when needed.",
        ],
      ],
    ],
    faq: [
      [
        "Is spasticity always bad?",
        "Not always. Some stiffness can help support standing. The aim is to reduce the spasticity that limits function or causes discomfort.",
      ],
      [
        "Why are my spasms worse at night?",
        "Lying still, a full bladder, pain and cold can all trigger night spasms. Stretching before bed and treating triggers can help.",
      ],
      [
        "Can pain in MS be treated?",
        "Yes. Different types of pain respond to different approaches, combining therapy, activity changes and medicines prescribed by a doctor.",
      ],
    ],
  },
  {
    slug: "speech-swallowing",
    title: "Speech and Swallowing",
    summary:
      "How MS can affect speech, voice and swallowing, the warning signs to watch for, and how therapy helps.",
    meta_title: "MS Speech & Swallowing Problems: Therapy | Rehabana",
    meta_description:
      "How multiple sclerosis can affect speech, voice and swallowing, the signs of swallowing difficulty, and how speech and language therapy helps.",
    intro:
      "Some people with MS develop changes in speech or swallowing. Assessment and therapy help keep communication clear and eating safe.",
    sections: [
      [
        "Speech",
        "How speech and voice can change",
        [
          "MS can affect the muscles and coordination used for speaking. Speech may become slurred, slower, quieter or harder to control, and the voice may tire through the day. Cognitive changes can also make it harder to find words or follow fast conversation.",
          "A speech and language therapist assesses the nature of the problem and works on clarity, breath support, pacing and communication strategies for everyday situations.",
        ],
      ],
      [
        "Swallowing",
        "Signs of swallowing difficulty",
        [
          "Swallowing difficulties (dysphagia) matter because food or drink entering the airway can cause chest infections, and because they can affect nutrition and enjoyment of meals.",
        ],
        [
          "Coughing or choking during or after eating or drinking",
          "A wet or gurgly voice after swallowing",
          "Food sticking in the throat",
          "Meals taking much longer",
          "Unexplained weight loss or chest infections",
        ],
      ],
    ],
    faq: [
      [
        "When should swallowing be assessed?",
        "As soon as signs appear, such as coughing at meals or chest infections. A swallowing assessment guides safe strategies and food textures.",
      ],
      [
        "Can speech therapy help if fatigue affects my voice?",
        "Yes. Therapy can include breath and voice techniques and pacing strategies to reduce effort and make speech easier to understand.",
      ],
      [
        "Are there simple ways to make eating safer?",
        "Sitting upright, eating slowly, taking small mouthfuls and avoiding distractions help. A therapist can give personalised advice.",
      ],
    ],
  },
  {
    slug: "symptoms",
    heroTitle: "Symptoms of Multiple Sclerosis",
    title: "Symptoms",
    summary:
      "The early signs and common symptoms of MS, what a relapse is, and when to see a doctor.",
    meta_title: "Multiple Sclerosis Symptoms & Early Signs | Rehabana",
    meta_description:
      "The common symptoms and early signs of multiple sclerosis, including vision, sensation, weakness, balance and fatigue, what a relapse is, and when to see a doctor.",
    intro:
      "MS symptoms vary widely from person to person. Here are the common early signs, what a relapse is, and when to get checked.",
    sections: [
      [
        "Early signs",
        "Symptoms that can appear first",
        [
          "Because MS can affect any part of the brain and spinal cord, the first symptoms vary. They often develop over days and may improve, partly or completely, over weeks.",
        ],
        [
          "Blurred vision or pain on moving one eye (optic neuritis)",
          "Numbness, tingling or altered sensation in the limbs or body",
          "Weakness or heaviness in an arm or leg",
          "Unsteadiness or dizziness",
          "Double vision",
          "An electric-shock feeling down the spine when bending the neck",
          "Bladder urgency",
        ],
      ],
      [
        "Over time",
        "Common symptoms of MS",
        [
          "As well as the symptoms above, people with MS commonly experience fatigue, stiffness or spasms, walking difficulties, pain, changes in memory or concentration, low mood and bladder or bowel problems. Many of these are invisible to others.",
          "A relapse is new symptoms, or a clear worsening of existing ones, lasting more than 24 hours and not explained by an infection or fever. Temporary worsening with heat or tiredness is different and settles with rest and cooling.",
        ],
      ],
    ],
    faq: [
      [
        "When should I see a doctor?",
        "See a doctor, and usually a neurologist, if you have unexplained neurological symptoms such as vision changes, numbness, weakness or unsteadiness lasting more than a day or two.",
      ],
      [
        "How is MS diagnosed?",
        "A neurologist makes the diagnosis using the history, examination and MRI scans, sometimes with other tests, to show evidence of damage in different areas over time.",
      ],
      [
        "Does everyone with MS end up in a wheelchair?",
        "No. MS varies greatly, and many people remain able to walk. Treatment and rehabilitation both help people maintain function.",
      ],
    ],
  },
  {
    slug: "treatments",
    heroTitle: "Treatment Options for Multiple Sclerosis",
    title: "Treatments",
    summary:
      "An overview of MS treatment: disease-modifying therapies, relapse treatment, symptom management and rehabilitation.",
    meta_title: "Multiple Sclerosis Treatment Options: DMTs & Rehab | Rehabana",
    meta_description:
      "An overview of multiple sclerosis treatment: disease-modifying therapies, treating relapses, managing symptoms, and the role of rehabilitation.",
    intro:
      "There is no cure for MS yet, but treatment can reduce disease activity, manage symptoms and help people stay independent.",
    sections: [
      [
        "Medical treatment",
        "Disease-modifying therapies",
        [
          "Disease-modifying therapies (DMTs) aim to reduce the frequency of relapses and new areas of inflammation, and can slow the build-up of disability in some forms of MS. They are given as injections, tablets or infusions.",
          "The right therapy depends on the type of MS, disease activity, other health conditions and personal circumstances, and is chosen and monitored by a neurologist.",
        ],
      ],
      [
        "Relapses and symptoms",
        "Treating relapses and symptoms",
        [
          "A significant relapse may be treated with a short course of steroids to speed recovery, as decided by the neurologist. Infections should be checked for, as they can mimic or trigger relapses.",
          "Many symptoms, such as spasticity, pain, fatigue and bladder problems, have specific treatments. Rehabilitation works alongside them, focusing on function, participation and adaptation.",
        ],
      ],
      [
        "Living well",
        "Rehabilitation and lifestyle",
        [
          "Rehabilitation, regular physical activity, not smoking, and looking after mood and general health all support people with MS. Discuss any supplements or alternative treatments with the treating doctor before starting them.",
        ],
      ],
    ],
    faq: [
      [
        "Do disease-modifying therapies cure MS?",
        "No, but they can reduce relapses and inflammation and, for many people, slow the progression of disability.",
      ],
      [
        "Is rehabilitation still useful if I'm on medication?",
        "Yes. Medicines target the disease process; rehabilitation targets function and daily life. They work best together.",
      ],
      [
        "Should every relapse be treated with steroids?",
        "Not necessarily. Mild relapses may recover without them. The neurologist decides based on how much the relapse affects function.",
      ],
    ],
  },
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

  const [condition, img, contactPage] = await Promise.all([
    client.getByUID("condition", CONDITION_UID).catch(() => null),
    loadLibraryImages(client),
    client.getSingle("contact_page").catch(() => null),
  ]);

  if (!condition) {
    throw new Error(
      `The "${CONDITION_UID}" condition isn't published yet — publish it first.`,
    );
  }

  const closing = cta({
    subheading: "Have a question?",
    heading: "Talk to a rehabilitation specialist",
    description:
      "Our doctors and therapists can explain what MS rehabilitation could do in your situation.",
    button: contactPage && {
      ...prismic.documentToLinkField(contactPage),
      text: "Talk to the Rehabana team",
    },
  });

  const migration = prismic.createMigration();
  let created = 0;

  for (const [index, topic] of TOPICS.entries()) {
    const uid = `${CONDITION_UID}-${topic.slug}`;
    const existing = await client
      .getByUID("condition_topic", uid)
      .catch(() => null);

    if (existing) {
      console.log(`  keep    ${uid}`);
      continue;
    }

    const photo = (offset) => img.photos[(index + offset) % img.photos.length];

    console.log(`  create  ${uid}`);
    created += 1;

    migration.createDocument(
      {
        type: "condition_topic",
        uid,
        lang: img.lang,
        data: {
          condition: prismic.documentToLinkField(condition),
          title: topic.title,
          summary: topic.summary,
          order: index + 1,
          meta_title: topic.meta_title,
          meta_description: topic.meta_description,
          featured_image: photo(0),
          slices: [
            hero(
              topic.heroTitle || `${topic.title} in Multiple Sclerosis`,
              topic.intro,
              img.hero,
            ),
            ...topic.sections.map(
              ([subheading, heading, description, items], i) =>
                about({
                  subheading,
                  heading,
                  description,
                  items,
                  image: photo(i + 1),
                  swap: i % 2 === 1,
                }),
            ),
            faq(`${topic.title}: common questions`, topic.faq),
            closing,
          ],
        },
      },
      `${CONDITION_NAME}: ${topic.title}`,
    );
  }

  if (!created) {
    console.log("\nNothing to create — every topic already exists.");
    return;
  }

  await client.migrate(migration, {
    reporter: (event) => console.log(`  ${event.type}`),
  });

  console.log(
    `\nDone: ${created} created. Review and publish the Migration Release at\n` +
      `  https://${REPOSITORY}.prismic.io/releases`,
  );
}

main().catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exitCode = 1;
});
