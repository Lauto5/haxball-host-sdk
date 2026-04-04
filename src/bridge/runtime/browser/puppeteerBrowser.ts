
import { Browser } from 'puppeteer';
import { BrowserConfigPuppeteer } from './config/browseConfigPuppeteer.interface';

async function puppeteerBrowser(config: BrowserConfigPuppeteer): Promise<Browser> {
  
  const puppeteer = await import('puppeteer');
  
  return await puppeteer.launch({
    headless: config.headless,
    executablePath: config.executablePath,
    args: config.args,
  });
  
}

export { puppeteerBrowser };
