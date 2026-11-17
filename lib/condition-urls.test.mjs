import { test } from "node:test";
import assert from "node:assert/strict";
import { rewriteConditionUrls } from "./condition-urls.js";

const link = (url, type = "condition_page") => ({
  link_type: "Document",
  type,
  url,
});

test("level 2-3 condition links drop the /conditions prefix", () => {
  const input = {
    results: [
      {
        data: {
          a: link("/conditions/parkinsons-disease/parkinsons-symptoms"),
          b: link(
            "/conditions/parkinsons-disease/parkinsons-caregiver-guide/parkinsons-home-safety",
          ),
        },
      },
    ],
  };

  const { data } = rewriteConditionUrls(input).results[0];
  assert.equal(data.a.url, "/parkinsons-disease/parkinsons-symptoms");
  assert.equal(
    data.b.url,
    "/parkinsons-disease/parkinsons-caregiver-guide/parkinsons-home-safety",
  );
});

test("level 1 condition links and the hub keep /conditions", () => {
  const input = [link("/conditions/stroke"), link("/conditions", "conditions_page")];
  const [level1, hub] = rewriteConditionUrls(input);
  assert.equal(level1.url, "/conditions/stroke");
  assert.equal(hub.url, "/conditions");
});

test("rich text hyperlinks and the document's own url are rewritten", () => {
  const doc = {
    type: "condition_page",
    url: "/conditions/multiple-sclerosis/ms-symptoms",
    data: {
      body: [
        {
          type: "paragraph",
          spans: [
            {
              type: "hyperlink",
              data: link("/conditions/multiple-sclerosis/ms-treatments"),
            },
          ],
        },
      ],
    },
  };

  const out = rewriteConditionUrls(doc);
  assert.equal(out.url, "/multiple-sclerosis/ms-symptoms");
  assert.equal(out.data.body[0].spans[0].data.url, "/multiple-sclerosis/ms-treatments");
});

test("other document types and web links are left alone", () => {
  const input = [
    link("/conditions/a/b", "custom_page"),
    { link_type: "Web", url: "/conditions/a/b" },
  ];
  const [custom, web] = rewriteConditionUrls(input);
  assert.equal(custom.url, "/conditions/a/b");
  assert.equal(web.url, "/conditions/a/b");
});

test("does not mutate its input", () => {
  const input = { a: link("/conditions/a/b") };
  rewriteConditionUrls(input);
  assert.equal(input.a.url, "/conditions/a/b");
});
