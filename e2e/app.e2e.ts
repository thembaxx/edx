import { test as base, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const test = base.extend<{ checkRuntime: void }>({
  checkRuntime: [
    async ({ page }, use) => {
      const messages: string[] = [];
      page.on("pageerror", (error) => messages.push(error.message));
      page.on("console", (message) => {
        if (["error", "warning"].includes(message.type())) messages.push(message.text());
      });
      await use();
      expect(messages, "Browser errors and warnings").toEqual([]);
    },
    { auto: true },
  ],
});

async function openDemo(page: Page, role = "parent") {
  // Keep the original storage keys so the rename preserves existing preferences.
  await page.addInitScript((savedRole) => {
    localStorage.setItem("edx-onboarded", "true");
    localStorage.setItem("edx-role", savedRole);
    localStorage.setItem("edx-less-motion", "true");
  }, role);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Kinlo, go home" })).toBeVisible();
}

async function navigate(page: Page, label: string) {
  await page
    .getByRole("navigation", { name: "Primary navigation", exact: true })
    .getByRole("button", { name: new RegExp(`^${label}`) })
    .click();
}

async function checkAccessibility(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map(({ id, nodes }) => ({
      id,
      nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
    })),
  ).toEqual([]);
}

test("onboarding and dialogs support keyboard focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const welcome = page.getByRole("dialog", { name: "Welcome to Kinlo" });
  await expect(welcome).toBeVisible();
  await expect(page.getByRole("button", { name: "Skip tour" })).toBeFocused();
  await checkAccessibility(page);
  await page.keyboard.press("Shift+Tab");
  await expect(welcome.getByRole("button", { name: "Continue" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(welcome).toHaveCount(0);
  await page.getByRole("button", { name: "Open settings" }).click();
  const settings = page.getByRole("dialog", { name: "Settings", exact: true });
  await expect(settings.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(settings).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open settings" })).toBeFocused();
});

test("parent navigation, messaging, themes and responsive layouts", async ({ page }) => {
  await openDemo(page);
  await expect(page).toHaveTitle("Kinlo — School, together");
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(page.getByRole("button", { name: "Kinlo, go home" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await checkAccessibility(page);
  }
  for (const label of ["Updates", "Calendar", "Inbox"]) {
    await navigate(page, label);
    await expect(page.locator("main h1")).toBeVisible();
    await checkAccessibility(page);
  }
  await page.getByRole("textbox", { name: "Write a message" }).fill("Thanks for the class update.");
  await page.getByRole("button", { name: "Save demo message" }).click();
  await expect(page.getByText("Thanks for the class update.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Open settings" }).click();
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await checkAccessibility(page);
  await page.getByRole("button", { name: "Close dialog" }).click();
  await checkAccessibility(page);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await navigate(page, "Inbox");
  await expect(page.getByText("Thanks for the class update.", { exact: true })).toBeVisible();
});

test("educator publishes a dated update and module visibility persists", async ({ page }) => {
  await openDemo(page, "teacher");
  await page.getByRole("button", { name: "Share something with families" }).click();
  const compose = page.getByRole("dialog", { name: "Share an update" });
  await compose.getByLabel("What kind of update?").selectOption("Homework");
  await compose.getByLabel("Title", { exact: true }).fill("Migration practice homework");
  await compose.getByLabel("Details").fill("Read the class notes before tomorrow.");
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const due = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  await compose.getByLabel("Due date / event date").fill(due);
  await checkAccessibility(page);
  await compose.getByRole("button", { name: "Add to demo" }).click();
  await navigate(page, "Updates");
  await expect(page.getByRole("heading", { name: "Migration practice homework" })).toBeVisible();
  await navigate(page, "Calendar");
  await page.getByRole("button", { name: /^Migration practice homework,/ }).click();
  await expect(
    page.locator(".day-events").getByRole("heading", { name: "Migration practice homework" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Manage modules" }).click();
  await page.getByRole("switch", { name: "Homework & tasks" }).click();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.reload();
  await navigate(page, "Updates");
  await expect(page.getByRole("heading", { name: "Migration practice homework" })).toHaveCount(0);
});

test("manifest, install icons, social metadata and missing routes", async ({ request }) => {
  const root = await request.get("/");
  const html = await root.text();
  expect(html).toContain('property="og:image"');
  expect(html).toContain("/og.png");
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.short_name).toBe("Kinlo");
  const logo = await (await request.get("/logo.svg")).text();
  expect(logo).not.toMatch(/Gradient|<filter/);
  for (const asset of [
    "/logo.svg",
    "/favicon.svg",
    "/og.png",
    "/apple-touch-icon.png",
    ...manifest.icons.map((icon: { src: string }) => icon.src),
  ]) {
    expect((await request.get(asset)).ok(), asset).toBe(true);
  }
  expect((await request.get("/missing-school-page")).status()).toBe(404);
});

test("installed shell reloads offline with saved data and branding", async ({ page, context }) => {
  await openDemo(page);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await page.waitForLoadState("networkidle");
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("button", { name: "Kinlo, go home" })).toBeVisible();
  await expect(page.getByText(/You are offline/)).toBeVisible();
  await navigate(page, "Updates");
  await expect(page.locator(".update-card").first()).toBeVisible();
  expect(
    await page
      .locator(".topbar .brand-mark")
      .evaluate((img) => (img as HTMLImageElement).naturalWidth > 0),
  ).toBe(true);
});
