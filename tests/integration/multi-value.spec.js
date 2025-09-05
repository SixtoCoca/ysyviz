import { test, expect } from '@playwright/test';
import { ChartTestHelper } from '../helpers/chart-helpers.js';

test.describe('Multi-Value Series Integration Tests', () => {
  let helper;

  test.beforeEach(async ({ page }) => {
    helper = new ChartTestHelper(page);
    await page.goto('/');
    await helper.waitForPageLoad();
  });

  test('bar chart with multiple value columns', async ({ page }) => {
    await helper.uploadData('multi-series-data.csv');
    await helper.expectFileUploaded('multi-series-data.csv');
    
    await helper.selectChartType('bar');
    await helper.expectChartTypeSelected('bar');
    
    await helper.navigateToPreviewTab();
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('line chart with multiple Y values', async ({ page }) => {
    await helper.uploadData('multi-series-data.csv');
    await helper.expectFileUploaded('multi-series-data.csv');
    
    await helper.selectChartType('line');
    await helper.expectChartTypeSelected('line');
    
    await helper.navigateToPreviewTab();
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('scatter chart with multiple Y values', async ({ page }) => {
    await helper.uploadData('multi-series-data.csv');
    await helper.expectFileUploaded('multi-series-data.csv');
    
    await helper.selectChartType('scatter');
    await helper.expectChartTypeSelected('scatter');
    
    await helper.navigateToPreviewTab();
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('bubble chart with multiple Y values', async ({ page }) => {
    await helper.uploadData('multi-series-data.csv');
    await helper.expectFileUploaded('multi-series-data.csv');
    
    await helper.selectChartType('bubble');
    await helper.expectChartTypeSelected('bubble');
    
    await helper.navigateToPreviewTab();
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('area chart with multiple Y values', async ({ page }) => {
    await helper.uploadData('multi-series-data.csv');
    await helper.expectFileUploaded('multi-series-data.csv');
    
    await helper.selectChartType('area');
    await helper.expectChartTypeSelected('area');
    
    await helper.navigateToPreviewTab();
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('chart renders with basic data', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    await helper.expectFileUploaded('basic-data.csv');
    
    await helper.selectChartType('bar');
    await helper.expectChartTypeSelected('bar');
    
    await helper.navigateToPreviewTab();
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('can switch between different chart types', async ({ page }) => {
    await helper.uploadData('multi-series-data.csv');
    await helper.expectFileUploaded('multi-series-data.csv');
    
    await helper.selectChartType('bar');
    await helper.expectChartTypeSelected('bar');
    
    await helper.selectChartType('line');
    await helper.expectChartTypeSelected('line');
    
    await helper.selectChartType('scatter');
    await helper.expectChartTypeSelected('scatter');
    
    await helper.navigateToPreviewTab();
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });
});
