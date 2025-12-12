import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('bilal@gmail.com');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('bilal');
  await page.getByRole('textbox', { name: 'First Name' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).fill('belli');
  await page.getByRole('textbox', { name: 'Last Name' }).click();
  await page.getByRole('textbox', { name: 'Last Name' }).fill('bilo');
  await page.getByRole('textbox', { name: 'Last Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Phone' }).fill('0748243064');
  await page.getByRole('combobox').selectOption('Active');
  await page.getByRole('button', { name: 'Create User' }).click();
  await page.getByRole('button', { name: 'Refresh Users' }).click();
});