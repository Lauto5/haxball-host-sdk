
import puppeteer, { Browser, Page, LaunchOptions } from "puppeteer"

/*

Clase encargada de 
mantener, exponer y liberar las instancias activas del navegador y sus páginas.

*/
export class BrowserRuntime {
    private browser?: Browser;
    private pages = new Map<string, Page>();

    // Lanza el navegador si no está ya lanzado.
    // desarrollo :
    //  luego puedo hacer que se lance con un template de configuracion el cual sera otra clase, 
    // la configuracion sera para el puppeter para cambiar de modo.
    async launch(options?: Partial<LaunchOptions>): Promise<void> {
        if (this.browser) return;

        this.browser = await puppeteer.launch({
            headless: true,
            executablePath: "/usr/bin/chromium-browser",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ],
            timeout: 60000,
        });

    }

    // Lanza una nueva página y la asocia con el ID proporcionado.
    async launchPage(id: string): Promise<Page> {
        if (!this.browser) {
            throw new Error("Browser not launched. Call launch() first.");
        }

        const page = await this.browser.newPage();
        this.pages.set(id, page);
        return page;
    }

    // Devuelve la página asociada con el ID proporcionado.
    getPage(id: string): Page {
        const page = this.pages.get(id);
        if (!page) {
            throw new Error(`Page '${id}' not found`);
        }
        return page;
    }

    async exposeFunction(
        pageId: string,
        name: string,
        fn: (...args: any[]) => any
    ) {
        const page = this.getPage(pageId);
        await page.exposeFunction(name, fn);
    }

    // Cierra la página asociada con el ID proporcionado y la elimina del mapa.
    async disposePage(id: string): Promise<void> {
        const page = this.pages.get(id);
        if (!page) return;

        await page.close();
        this.pages.delete(id);
    }

    // Cierra todas las páginas y el navegador, liberando todos los recursos.
    async dispose(): Promise<void> {
        for (const page of this.pages.values()) {
            await page.close();
        }
        this.pages.clear();

        await this.browser?.close();
        this.browser = undefined;
    }

    getBrowser(): Browser | undefined {
        return this.browser;
    }
}
