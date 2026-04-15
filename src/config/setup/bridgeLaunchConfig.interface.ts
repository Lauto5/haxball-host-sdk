

export interface BridgeLaunchConfig {
    runtime: 'puppeteer' | 'playwright';
    system: 'linux' | 'windows' | 'mac' | 'unknown';
    executablePath?: string;
}