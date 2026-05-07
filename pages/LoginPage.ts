import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('[name="email"]');
        this.passwordInput = page.locator('[name="password"]');
        this.loginButton = page.locator('//button[contains(text(), "Sign in")]');
        this.errorMessage = page.locator("//*[contains(text(), 'Request ID')]");
    }

    async goToPage() {
        await this.page.goto('https://checklist-checker-staging.vercel.app/signin');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async loginError(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await expect(this.errorMessage).toBeVisible();
    }
}
