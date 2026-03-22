
// Tipos base
export interface BrowserConfigPuppeteer {
  headless: "shell" | boolean;
  executablePath?: string;
  args: string[];
}

// --- Configuración para Entornos Linux ---
export const BrowserConfigPuppeteerLinux: BrowserConfigPuppeteer = {
  headless: "shell",
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage', // Indispensable para Docker/VPS
    '--disable-gpu',           // Mejora rendimiento en servidores sin monitor
    '--no-first-run',
    '--no-zygote',
    '--disable-extensions',    // Reduce el footprint de memoria
  ],
};

// --- Configuración para Entornos de Escritorio (Windows/Mac) ---
export const BrowserConfigPuppeteerDesktop: BrowserConfigPuppeteer = {
  headless: "shell",
  args: [
    '--disable-gpu',
    '--no-first-run',
    '--no-zygote',
  ],
};
