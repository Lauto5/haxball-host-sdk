import { BrowserRuntime } from "./bridge/browserRuntime";
import { EvaluationContext } from "./bridge/evaluationContext";
import puppeteer, { Browser, Page, LaunchOptions } from "puppeteer"

const browserRuntime = new BrowserRuntime();


async function testing(): Promise<void> {
    await browserRuntime.launch();
    const page = await browserRuntime.launchPage("test");
    await page.goto("https://www.haxball.com");
    const title = await page.title();
    console.log(title);
    browserRuntime.dispose();
}

testing();