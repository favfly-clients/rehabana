import { test } from "node:test";
import assert from "node:assert/strict";
import { resolvePath, resolveRedirect } from "./redirects.js";

// Audit row 2 (ClickUp 14zdwxwrjz2): each old URL, as linked (trailing slash).
const AUDIT_MAP = {
  "/rehabana-kalighat/": "/contact",
  "/about-us/": "/about",
  "/contact-us/": "/contact",
  "/specialservice/parkinsons-treatment-in-kolkata/": "/parkinsons-treatment-in-kolkata",
  "/specialservice/stroke-rehab/": "/stroke-rehabilitation-in-kolkata",
  "/specialservice/spinal-injury/": "/spinal-cord-rehabilitation-in-kolkata",
  "/spinal-injury-treatment/": "/spinal-cord-rehabilitation-in-kolkata",
  "/specialservice/peripheral-neuropathy-treatment-in-kolkata/":
    "/peripheral-neuropathy-treatment-in-kolkata",
  "/specialservice/motor-neurone-disease/": "/motor-neuron-disease-treatment-kolkata",
  "/specialservice/paralysis/": "/paralysis-rehabilitation-in-kolkata",
  "/rehabservice/occupational-therapy/": "/occupational-therapy-in-kolkata",
  "/rehabservice/psychotherapy/": "/psychotherapy-in-kolkata",
  "/5-cutting-edge-treatments-for-neuropathy-in-2024-discover-relief-now/":
    "/5-cutting-edge-treatments-for-neuropathy-discover-relief-now",
  "/our-therapy-team/": "/team",
  "/author/sayani/": "/authors/dr-sayani-haldar",
  "/galleries/": "/gallery",
  "/our-robots/": "/robotic-rehab-in-kolkata",
  "/stroke-recovery/": "/brain-stroke-recovery",
  "/category/stroke-rehab/": "/blog",
  "/testimonial/mrs-sikha-das/": "/testimonials",
  // chains collapsed to one hop
  "/pmr-rehab-physician/": "/pmr-rehab-physician",
  "/rehabservice/": "/services",
  "/rehabservice/physiotherapy-in-kolkata/": "/physiotherapy-in-kolkata",
  "/rehabservice/speech-therapy-in-kolkata/": "/speech-therapy-in-kolkata",
  "/rehabservice/robotic-rehab/": "/robotic-rehab-in-kolkata",
  "/rehabservice/digital-rehab/": "/digital-rehab-kolkata",
  "/rehabservice/in-patient-module/": "/in-patient-module-neuro-rehab-in-kolkata",
};

// Every rule that used to be in vercel.json, with an example and its target.
const VERCEL_JSON_RULES = {
  "/rehabservice/stroke-rehabilitation-in-kolkata": "/stroke-rehabilitation-in-kolkata",
  "/conditions/parkinsons-disease/parkinsons-caregiver-guide/parkinsons-home-safety":
    "/parkinsons-disease/caregiver-guide/home-safety",
  "/parkinsons-disease/parkinsons-caregiver-guide/parkinsons-home-safety":
    "/parkinsons-disease/caregiver-guide/home-safety",
  "/conditions/parkinsons-disease/parkinsons-symptoms": "/parkinsons-disease/symptoms",
  "/parkinsons-disease/parkinsons-non-motor-symptoms": "/parkinsons-disease/non-motor-symptoms",
  "/conditions/parkinsons-disease/parkinsons-treatments": "/parkinsons-disease/treatment",
  "/conditions/parkinsons-disease/treatments": "/parkinsons-disease/treatment",
  "/parkinsons-disease/parkinsons-treatments": "/parkinsons-disease/treatment",
  "/conditions/parkinsons-disease/gait-and-mobility": "/parkinsons-disease/gait-problems",
  "/parkinsons-disease/parkinsons-gait-and-mobility": "/parkinsons-disease/gait-problems",
  "/conditions/multiple-sclerosis/ms-symptoms": "/multiple-sclerosis/symptoms",
  "/multiple-sclerosis/ms-community-reintegration": "/multiple-sclerosis/community-reintegration",
  "/conditions/multiple-sclerosis/ms-treatments": "/multiple-sclerosis/treatment",
  "/multiple-sclerosis/ms-gait-and-mobility": "/multiple-sclerosis/gait-problems",
  "/multiple-sclerosis/ms-balance-and-coordination": "/multiple-sclerosis/balance-problems",
  "/conditions/multiple-sclerosis/ms-spasticity-and-pain": "/multiple-sclerosis/spasticity-pain",
  "/multiple-sclerosis/ms-fatigue-and-sleep": "/multiple-sclerosis/fatigue-sleep",
  "/conditions/stroke/recovery-timeline": "/stroke/recovery-timeline",
  "/motor-neuron-disease": "/motor-neuron-disease-treatment-kolkata",
  "/garden-therapy": "/garden-therapy-in-kolkata",
  "/post-surgery-rehabilitation-centre": "/post-surgery-rehabilitation-centre-in-kolkata",
  "/robotic-rehab": "/robotic-rehab-in-kolkata",
  "/in-patient-module": "/in-patient-module-neuro-rehab-in-kolkata",
  "/pain-spasticity": "/pain-spasticity-kolkata",
  "/digital-rehab": "/digital-rehab-kolkata",
};

test("every old WordPress URL in the audit map resolves to its live page", () => {
  for (const [from, to] of Object.entries(AUDIT_MAP)) {
    assert.equal(resolvePath(from), to, from);
  }
});

test("every rule moved from vercel.json still applies", () => {
  for (const [from, to] of Object.entries(VERCEL_JSON_RULES)) {
    assert.equal(resolvePath(from), to, from);
    assert.equal(resolvePath(`${from}/`), to, `${from}/`);
  }
});

test("live pages and level-1 condition pages are left alone", () => {
  for (const path of [
    "/",
    "/about",
    "/conditions",
    "/conditions/multiple-sclerosis",
    "/parkinsons-disease/symptoms",
    "/stroke-rehabilitation-in-kolkata",
  ]) {
    assert.equal(resolveRedirect({ host: "rehabana.com", pathname: path }), null, path);
  }
});

test("old URLs on the canonical host redirect once, keeping the query", () => {
  assert.equal(
    resolveRedirect({ host: "rehabana.com", pathname: "/about-us/", search: "?utm_source=x" }),
    "/about?utm_source=x",
  );
  assert.equal(resolveRedirect({ host: "rehabana.com", pathname: "/team/" }), "/team");
});

test("alias hosts go to rehabana.com with the final path in one hop", () => {
  assert.equal(
    resolveRedirect({ host: "rehabana.vercel.app", pathname: "/" }),
    "https://rehabana.com/",
  );
  assert.equal(
    resolveRedirect({ host: "www.rehabana.com", pathname: "/rehabservice/robotic-rehab/" }),
    "https://rehabana.com/robotic-rehab-in-kolkata",
  );
  assert.equal(
    resolveRedirect({ host: "Rehabana.vercel.app:443", pathname: "/contact", search: "?a=1" }),
    "https://rehabana.com/contact?a=1",
  );
});

test("preview deployments, localhost and Prismic previews keep their host", () => {
  assert.equal(resolveRedirect({ host: "rehabana-git-x-favfly.vercel.app", pathname: "/" }), null);
  assert.equal(resolveRedirect({ host: "localhost:3000", pathname: "/about" }), null);
  assert.equal(
    resolveRedirect({ host: "rehabana.vercel.app", pathname: "/about", keepHost: true }),
    null,
  );
});

test("old URLs are matched without regard to case", () => {
  assert.equal(resolvePath("/About-Us/"), "/about");
});
