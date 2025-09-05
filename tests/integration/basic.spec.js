import { test, expect } from '@playwright/test';
import { ChartTestHelper } from '../helpers/chart-helpers.js';

test.describe('Basic Application Tests', () => {
  let helper;

  test.beforeEach(async ({ page }) => {
    helper = new ChartTestHelper(page);
    await page.goto('/');
    await helper.waitForPageLoad();
  });

  test('application loads correctly', async ({ page }) => {
    await expect(page.locator('[data-testid="app-logo"]')).toBeVisible();
    
    await expect(page.locator('[data-testid="upload-tab"]')).toBeVisible();
    
    await helper.navigateToPreviewTab();
    await expect(page.locator('[data-testid="chart-type-title"]')).toBeVisible();
    
    await expect(page.locator('[data-testid="chart-type-bar"]')).toBeVisible();
    await expect(page.locator('[data-testid="chart-type-line"]')).toBeVisible();
  });

  test('can select bar chart', async ({ page }) => {
    await helper.selectChartType('bar');
    await helper.expectChartTypeSelected('bar');
  });

  test('can select multiple chart types', async ({ page }) => {
    await helper.selectChartType('bar');
    await helper.expectChartTypeSelected('bar');
    
    await helper.selectChartType('line');
    await helper.expectChartTypeSelected('line');
    
    await helper.selectChartType('scatter');
    await helper.expectChartTypeSelected('scatter');
  });

  test('can upload data', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    await helper.expectFileUploaded('basic-data.csv');
  });

  test('can navigate between tabs', async ({ page }) => {
    await helper.navigateToPreviewTab();
    await expect(page.locator('[data-testid="preview-pane"]')).toBeVisible();
  });

  test('chart renders after data upload and type selection', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    await helper.selectChartType('bar');
    await helper.navigateToPreviewTab();
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('data loads correctly in upload tab', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    
    // Wait for data to be processed
    await page.waitForTimeout(3000);
    
    // Verify file was uploaded
    await helper.expectFileUploaded('basic-data.csv');
    
    // Stay in upload tab and verify data is visible
    await expect(page.locator('[data-testid="upload-pane"]')).toBeVisible();
    
    // Check if there's any indication that data was loaded
    // This will help us understand if the data is being processed correctly
    await page.waitForTimeout(2000);
  });

  test('config with validation renders correctly', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    
    // Wait for data to be processed
    await page.waitForTimeout(3000);
    
    // Verify file was uploaded
    await helper.expectFileUploaded('basic-data.csv');
    
    // Navigate to preview tab
    await helper.navigateToPreviewTab();
    
    // Wait for config with validation to appear
    await expect(page.locator('[data-testid="config-with-validation"]')).toBeVisible();
    
    // Wait a bit more
    await page.waitForTimeout(2000);
  });

  test('data mapping fields appear after data upload', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    
    // Wait for data to be processed
    await page.waitForTimeout(3000);
    
    // Verify file was uploaded
    await helper.expectFileUploaded('basic-data.csv');
    
    // Wait a bit more to ensure data is fully processed
    await page.waitForTimeout(2000);
    
    await helper.selectChartType('bar');
    
    // Wait a bit for the chart type selection to take effect
    await page.waitForTimeout(2000);
    
    // Wait for data mapping panel to appear
    await expect(page.locator('[data-testid="data-mapping-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="column-mapping-title"]')).toBeVisible();
    
    // Check that required fields are present
    await expect(page.locator('[data-testid="category-field"]')).toBeVisible();
    await expect(page.locator('[data-testid="series-field"]')).toBeVisible();
  });

  test('can configure basic bar chart fields', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    await helper.selectChartType('bar');
    
    // Wait for fields to be available
    await page.waitForSelector('[data-testid="category-field"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="series-field"]', { timeout: 10000 });
    
    // Configure fields
    await helper.configureField('category', 'Category');
    await helper.configureField('series', 'Value');
    
    // Navigate to preview to see the chart
    await helper.navigateToPreviewTab();
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('debug validation and chart rendering', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    
    await page.waitForTimeout(3000);
    
    await helper.expectFileUploaded('basic-data.csv');
    
    await helper.navigateToPreviewTab();
    
    await helper.selectChartType('bar');
    
    await page.waitForTimeout(2000);
    
    await expect(page.locator('[data-testid="data-mapping-panel"]')).toBeVisible();
    
    await helper.configureField('category', 'Category');
    await helper.configureField('series', 'Value');
    
    await page.waitForTimeout(5000);
    
    const debugInfo = await page.evaluate(() => {
      const chartContainer = document.querySelector('[data-testid="chart-container"]');
      const chartMessage = chartContainer?.querySelector('p');
      const chartComponent = chartContainer?.querySelector('[data-testid="bar-chart"]');
      
      const configPanel = document.querySelector('[data-testid="config-with-validation"]');
      const categoryField = configPanel?.querySelector('[data-testid="category-field"]');
      const seriesField = configPanel?.querySelector('[data-testid="series-field"]');
      
      return {
        chartMessageText: chartMessage?.textContent || 'no message',
        hasChartComponent: !!chartComponent,
        categoryFieldText: categoryField?.textContent || 'not found',
        seriesFieldText: seriesField?.textContent || 'not found',
        chartContainerHTML: chartContainer?.innerHTML.substring(0, 500) || 'no container'
      };
    });
    
    await page.waitForTimeout(2000);
  });
});
