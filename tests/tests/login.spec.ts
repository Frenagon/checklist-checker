import { expect, test } from '@playwright/test';
import userData from '../fixtures/user-credentials.json';
import { LoginPage } from '../pages/LoginPage';

test('Login Error', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goToPage();

  await loginPage.loginError(userData.user, userData.password);
});
