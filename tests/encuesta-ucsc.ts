import { test } from "@playwright/test";
import "dotenv/config";

test("Responder encuesta docente", async ({ page }) => {
  await page.goto("https://portal.ucsc.cl/");

  await page.locator("#rut").fill(process.env.UCSC_USERNAME as string);
  await page
    .locator("input[type='password']")
    .fill(process.env.UCSC_PASSWORD as string);

  await page.locator("button[type='submit']").click();
  await page.waitForNavigation();
  await page.goto("https://portal.ucsc.cl/alumno#/apps/app/19");
  await page.locator("a[aria-label='Close']").click();

  const iframe = await page.frameLocator("#iframe-app-19");
  const inputs = await iframe.locator("input[value='Responder']").all();
  let inputs_length = inputs.length;

  while (inputs_length--) {
    const input = inputs[inputs_length];
    await input.click();
    await page.waitForTimeout(1500);
    const radios = await iframe
      .locator("tr td:nth-child(4) input[type='radio']")
      .all();
    for (const radio of radios) {
      await radio.click();
    }

    const save_button = await iframe.locator("input[value='GUARDAR']").first();
    await save_button.click();
    await iframe.locator("input[value='MIS PROFESORES']").first().click();
  }
});

// pnpm dlx playwright test
