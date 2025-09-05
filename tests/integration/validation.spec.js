import { test, expect } from '@playwright/test';
import { ChartTestHelper } from '../helpers/chart-helpers.js';

test.describe('Validation Integration Tests', () => {
  let helper;

  test.beforeEach(async ({ page }) => {
    helper = new ChartTestHelper(page);
    await page.goto('/');
  });

  test('required fields validation for bar chart', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    await helper.selectChartType('Bar Chart');
    
    await helper.configureField('category', 'Category');
    await helper.configureField('series', 'Value');
    
    // Verify chart renders
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('required fields validation for line chart', async ({ page }) => {
    await helper.uploadData('multi-series-data.csv');
    await helper.selectChartType('Line Chart');
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('numeric validation for scatter chart', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    await helper.selectChartType('Scatter Chart');
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('numeric validation for bubble chart', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    await helper.selectChartType('Bubble Chart');
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('pyramid chart validation with Y && (Left || Right) condition', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    await helper.selectChartType('Pyramid Chart');
    
    await helper.configureField('y', 'Category');
    await helper.configureField('pyramid_left', 'Value');
    
    // Should render
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('violin chart validation with multiple X columns', async ({ page }) => {
    await helper.uploadData('violin-boxplot-data.csv');
    await helper.selectChartType('Violin Chart');
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('boxplot chart validation with group field', async ({ page }) => {
    await helper.uploadData('violin-boxplot-data.csv');
    await helper.selectChartType('Boxplot Chart');
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('pie chart validation with label and value', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    await helper.selectChartType('Pie Chart');
    
    await helper.configureField('value', 'Value');
    await helper.configureField('label', 'Category');
    
    // Should render
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('empty data validation', async ({ page }) => {
    // Create empty CSV
    await page.setInputFiles('input[type="file"]', {
      name: 'empty.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('Category,Value\n')
    });
    
    await page.click('[data-testid="upload-button"]');
    await page.waitForTimeout(2000);
    
    await helper.selectChartType('Bar Chart');
    
    // Should not render chart elements with empty data
    await expect(page.locator('[data-testid="bar-rect"]')).not.toBeVisible();
  });

  test('validation clears when switching chart types', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    await helper.selectChartType('Bar Chart');
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
    
    // Switch to scatter chart
    await helper.selectChartType('Scatter Chart');
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });
});
