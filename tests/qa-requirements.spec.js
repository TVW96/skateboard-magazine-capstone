const { expect, test } = require("@playwright/test");

const pages = ["/", "/week02/", "/week03/"];
const breakpoints = [
  { name: "small mobile", width: 320, height: 568 },
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "ultrawide", width: 2560, height: 1440 },
];

test.describe("QA checklist - functionality walkthrough", () => {
  for (const path of pages) {
    test(`${path} has working navigation, buttons, and footer links`, async ({
      page,
    }) => {
      await page.goto(path);

      const links = await page.locator("a[href]").evaluateAll((anchors) =>
        anchors.map((anchor) => ({
          href: anchor.getAttribute("href"),
          text: anchor.textContent.trim(),
        })),
      );

      for (const link of links) {
        expect
          .soft(link.href, `${path} link "${link.text}" has an href`)
          .toBeTruthy();
        expect
          .soft(
            link.href,
            `${path} link "${link.text}" does not use a local filesystem path`,
          )
          .not.toMatch(
            /^(file:|[a-zA-Z]:[\\/]|\/Users\/|\/home\/|\/var\/|\/tmp\/)/,
          );

        if (
          !link.href ||
          link.href.startsWith("mailto:") ||
          link.href.startsWith("tel:")
        ) {
          continue;
        }

        const target = new URL(link.href, page.url());

        if (target.origin === new URL(page.url()).origin) {
          const response = await page.request.get(target.href);
          expect
            .soft(
              response.status(),
              `${path} internal link "${link.text}" resolves: ${target.href}`,
            )
            .toBeLessThan(400);
        } else {
          const response = await page.request.get(target.href, {
            timeout: 10_000,
          });
          expect
            .soft(
              response.status(),
              `${path} external link "${link.text}" resolves: ${target.href}`,
            )
            .toBeLessThan(400);
        }
      }

      const themeToggle = page.locator("[data-theme-toggle]");
      await expect(themeToggle).toBeVisible();
      await expect(themeToggle).toHaveAttribute(
        "aria-pressed",
        /^(true|false)$/,
      );

      const initialTheme = await page
        .locator("html")
        .getAttribute("data-theme");
      await themeToggle.hover();
      await themeToggle.click();
      await expect(page.locator("html")).not.toHaveAttribute(
        "data-theme",
        initialTheme || "",
      );
      await expect
        .poll(() =>
          page.evaluate(() => localStorage.getItem("push-color-theme")),
        )
        .toMatch(/^(dark|light)$/);

      const forms = page.locator("form");
      await expect(
        forms,
        "No forms exist, so form validation requirements are not applicable",
      ).toHaveCount(0);
    });
  }
});

test.describe("Week 03 submission verification", () => {
  test("outer layout uses semantic landmarks without div soup", async ({
    page,
  }) => {
    await page.goto("/week03/");

    await expect(page.locator("body > header.site-header")).toHaveCount(1);
    await expect(page.locator("body > main.editorial-frame")).toHaveCount(1);
    await expect(page.locator("body > aside.context-rail")).toHaveCount(1);
    await expect(page.locator("body > footer.site-footer")).toHaveCount(1);
    await expect(page.locator("header > nav.site-nav")).toHaveCount(1);
    await expect(page.locator("div")).toHaveCount(0);

    const landmarkOrder = await page
      .locator("body")
      .evaluate((body) =>
        [...body.children]
          .filter((element) =>
            ["HEADER", "MAIN", "ASIDE", "FOOTER"].includes(element.tagName),
          )
          .map((element) => element.tagName.toLowerCase()),
      );

    expect(landmarkOrder).toEqual(["header", "main", "aside", "footer"]);
  });

  test("Tab key follows a logical order with visible navigation focus rings", async ({
    browserName,
    page,
  }) => {
    await page.goto("/week03/");

    const tabKey = browserName === "webkit" ? "Alt+Tab" : "Tab";
    const tabOrder = [
      ".skip-link",
      ".wordmark",
      '.site-nav a[href="../"]',
      '.site-nav a[href="../week02/"]',
      "[data-theme-toggle]",
      '.site-footer a[href="#top"]',
    ];

    for (const selector of tabOrder) {
      await page.keyboard.press(tabKey);
      await expect(page.locator(selector)).toBeFocused();
    }

    const navigationLinks = page.locator(".site-nav a");
    const navigationLinkCount = await navigationLinks.count();

    for (let index = 0; index < navigationLinkCount; index += 1) {
      const link = navigationLinks.nth(index);
      await link.focus();

      const focusRing = await link.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          color: style.outlineColor,
          offset: Number.parseFloat(style.outlineOffset),
          style: style.outlineStyle,
          width: Number.parseFloat(style.outlineWidth),
        };
      });

      expect(focusRing.style).toBe("solid");
      expect(focusRing.width).toBeGreaterThanOrEqual(3);
      expect(focusRing.offset).toBeGreaterThanOrEqual(3);
      expect(focusRing.color).not.toBe("transparent");
    }
  });

  test("layout rearranges cleanly from 320px through 2560px", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 320, height: 568, mode: "stacked" },
      { width: 2560, height: 1440, mode: "side-by-side" },
    ]) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/week03/");

      const layout = await page.evaluate(() => {
        const main = document.querySelector("main").getBoundingClientRect();
        const aside = document.querySelector("aside").getBoundingClientRect();

        return {
          aside: {
            bottom: aside.bottom,
            left: aside.left,
            right: aside.right,
            top: aside.top,
            width: aside.width,
          },
          documentWidth: document.documentElement.scrollWidth,
          main: {
            bottom: main.bottom,
            left: main.left,
            right: main.right,
            top: main.top,
            width: main.width,
          },
          viewportWidth: document.documentElement.clientWidth,
        };
      });

      expect(layout.documentWidth).toBeLessThanOrEqual(
        layout.viewportWidth + 1,
      );
      expect(layout.main.width).toBeGreaterThan(0);
      expect(layout.aside.width).toBeGreaterThan(0);

      if (viewport.mode === "stacked") {
        expect(layout.aside.top).toBeGreaterThanOrEqual(layout.main.bottom - 1);
      } else {
        expect(layout.aside.left).toBeGreaterThanOrEqual(layout.main.right - 1);
        expect(layout.aside.top).toBeLessThan(layout.main.bottom);
      }
    }
  });
});

test.describe("QA checklist - deployment and cross-browser readiness", () => {
  for (const path of pages) {
    test(`${path} loads without broken same-origin assets`, async ({
      page,
    }) => {
      const failedRequests = [];
      const badResponses = [];

      page.on("requestfailed", (request) => {
        failedRequests.push(
          `${request.method()} ${request.url()} - ${request.failure()?.errorText}`,
        );
      });
      page.on("response", (response) => {
        const url = new URL(response.url());
        const currentOrigin = new URL(page.url()).origin;
        if (url.origin === currentOrigin && response.status() >= 400) {
          badResponses.push(`${response.status()} ${response.url()}`);
        }
      });

      await page.goto(path, { waitUntil: "networkidle" });

      expect.soft(badResponses).toEqual([]);
      expect.soft(failedRequests).toEqual([]);

      const assetUrls = await page
        .locator("img, source, script[src], link[href]")
        .evaluateAll((nodes) =>
          nodes
            .map(
              (node) =>
                node.currentSrc ||
                node.src ||
                node.href ||
                node.getAttribute("href"),
            )
            .filter(Boolean),
        );

      for (const assetUrl of assetUrls) {
        expect
          .soft(assetUrl, `${path} asset URL is deployable`)
          .not.toMatch(
            /^(file:|[a-zA-Z]:[\\/]|\/Users\/|\/home\/|\/var\/|\/tmp\/|C:\\)/,
          );
      }
    });

    for (const viewport of breakpoints) {
      test(`${path} has no overlap, clipping, or horizontal overflow at ${viewport.name}`, async ({
        page,
      }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto(path);

        const metrics = await page.evaluate(() => {
          const elements = [...document.body.querySelectorAll("*")];
          const viewportWidth = document.documentElement.clientWidth;
          const overflowing = elements
            .map((element) => {
              const rect = element.getBoundingClientRect();
              return {
                tag: element.tagName.toLowerCase(),
                text: element.textContent
                  .trim()
                  .replace(/\s+/g, " ")
                  .slice(0, 80),
                left: rect.left,
                right: rect.right,
                width: rect.width,
              };
            })
            .filter(
              (item) =>
                item.width > 0 &&
                (item.left < -1 || item.right > viewportWidth + 1),
            );

          return {
            bodyScrollWidth: document.body.scrollWidth,
            documentScrollWidth: document.documentElement.scrollWidth,
            viewportWidth,
            overflowing,
          };
        });

        expect
          .soft(
            metrics.documentScrollWidth,
            "document does not create horizontal scrolling",
          )
          .toBeLessThanOrEqual(metrics.viewportWidth + 1);
        expect
          .soft(
            metrics.bodyScrollWidth,
            "body does not create horizontal scrolling",
          )
          .toBeLessThanOrEqual(metrics.viewportWidth + 1);
        expect.soft(metrics.overflowing).toEqual([]);
      });
    }
  }
});

test.describe("QA checklist - automated audit proxies", () => {
  for (const path of pages) {
    test(`${path} has SEO metadata and semantic page structure`, async ({
      page,
    }) => {
      await page.goto(path);

      await expect(page).toHaveTitle(/\S/);
      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveCount(1);
      const descriptionContent = await description.getAttribute("content");
      expect(
        descriptionContent?.trim().length,
        "meta description is brief but descriptive",
      ).toBeGreaterThanOrEqual(25);

      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("nav")).toHaveCount(1);
      await expect(page.locator("footer")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);
    });

    test(`${path} meets baseline accessibility checks from the guide`, async ({
      page,
    }) => {
      await page.goto(path);

      const images = page.locator("img");
      const imageCount = await images.count();
      for (let index = 0; index < imageCount; index += 1) {
        await expect(
          images.nth(index),
          `Image ${index + 1} has alt text`,
        ).toHaveAttribute("alt", /\S/);
      }

      const headingLevels = await page
        .locator("h1, h2, h3, h4, h5, h6")
        .evaluateAll((headings) =>
          headings.map((heading) => Number(heading.tagName.slice(1))),
        );
      expect(headingLevels[0]).toBe(1);
      for (let index = 1; index < headingLevels.length; index += 1) {
        expect
          .soft(
            headingLevels[index],
            `Heading level h${headingLevels[index]} should not skip after h${headingLevels[index - 1]}`,
          )
          .toBeLessThanOrEqual(headingLevels[index - 1] + 1);
      }

      const unlabeledControls = await page
        .locator("button, input, select, textarea")
        .evaluateAll((controls) =>
          controls
            .filter((control) => {
              const id = control.getAttribute("id");
              const hasLabel =
                control.getAttribute("aria-label") ||
                control.getAttribute("aria-labelledby") ||
                (id &&
                  document.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
                control.closest("label");
              return !hasLabel;
            })
            .map((control) => control.outerHTML),
        );
      expect.soft(unlabeledControls).toEqual([]);
    });

    test(`${path} has readable text contrast in active color theme`, async ({
      page,
    }) => {
      await page.goto(path);

      const lowContrastText = await page.evaluate(() => {
        function parseRgb(color) {
          const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (!match) {
            return null;
          }
          return [Number(match[1]), Number(match[2]), Number(match[3])];
        }

        function luminance([red, green, blue]) {
          const values = [red, green, blue].map((value) => {
            const channel = value / 255;
            return channel <= 0.03928
              ? channel / 12.92
              : ((channel + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
        }

        function contrastRatio(foreground, background) {
          const light = Math.max(luminance(foreground), luminance(background));
          const dark = Math.min(luminance(foreground), luminance(background));
          return (light + 0.05) / (dark + 0.05);
        }

        return [...document.body.querySelectorAll("*")]
          .filter((element) => {
            const text = element.textContent.trim();
            const rect = element.getBoundingClientRect();
            return (
              text &&
              rect.width > 0 &&
              rect.height > 0 &&
              element.children.length === 0
            );
          })
          .map((element) => {
            const style = getComputedStyle(element);
            const foreground = parseRgb(style.color);
            const background =
              parseRgb(style.backgroundColor) ||
              parseRgb(getComputedStyle(document.body).backgroundColor);
            if (!foreground || !background) {
              return null;
            }
            return {
              text: element.textContent
                .trim()
                .replace(/\s+/g, " ")
                .slice(0, 80),
              ratio: contrastRatio(foreground, background),
            };
          })
          .filter(Boolean)
          .filter((item) => item.ratio < 4.5);
      });

      expect.soft(lowContrastText).toEqual([]);
    });
  }
});
