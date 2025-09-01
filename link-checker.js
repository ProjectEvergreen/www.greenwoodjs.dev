import graph from "./public/graph.json" with { type: "json" };
import { parse } from "node-html-parser";
import fs from "node:fs/promises";

const report = {};

for (const page of graph) {
  const { outputHref, route } = page;
  const html = await fs.readFile(new URL(outputHref), "utf-8");
  const root = parse(html);
  const links = root.querySelectorAll("a");

  links.forEach((link) => {
    if (!route.startsWith("/blog/") && link.getAttribute("href").startsWith("/")) {
      const linkUrl = new URL(`https://www.greenwoodjs.dev${link.getAttribute("href")}`);
      const { pathname, hash } = linkUrl;
      const matchingRoute = graph.find((page) => page.route === pathname);

      if (!matchingRoute) {
        if (!report[route]) {
          report[route] = {
            violations: [],
          };
        }

        report[route].violations.push({
          link: pathname,
        });
      }

      if (matchingRoute && hash !== "") {
        const { tableOfContents } = matchingRoute.data;
        const match = tableOfContents.find((toc) => toc.slug === hash.replace("#", ""));

        if (!match) {
          if (!report[route]) {
            report[route] = {
              violations: [],
            };
          }

          report[route].violations.push({
            hash,
          });
        }
      }
    }
  });
}

if (Object.keys(report).length === 0) {
  console.log("✅ all links checked successfully and no broken links found");
} else {
  for (const r of Object.keys(report)) {
    console.log("---------------------------------");
    console.log(`🚨 reporting violations for route ${r}...`);
    report[r].violations.forEach((violation, idx) => {
      if (violation.link) {
        console.error(`${idx + 1}) Could not find matching route for href => ${violation.link}`);
      } else if (violation.hash) {
        console.error(`${idx + 1}) Could not find matching heading for hash => ${violation.hash}`);
      }
    });
  }
}
