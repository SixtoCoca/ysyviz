import { test, expect } from '@playwright/test';
import { ChartTestHelper } from '../helpers/chart-helpers.js';

test.describe('Data Mapping Integration Tests', () => {
  let helper;

  test.beforeEach(async ({ page }) => {
    helper = new ChartTestHelper(page);
    await page.goto('/');
  });

  test('bar chart data mapping with basic data', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    await helper.selectChartType('Bar Chart');
    
    await helper.configureField('category', 'Category');
    await helper.configureField('series', 'Value');
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
    await helper.expectNoValidationErrors();
    
    // Verify chart elements are rendered
    const barElements = await page.locator('[data-testid="bar-rect"]').count();
    expect(barElements).toBe(25); // 5 categories × 5 series in the data
  });

  test('line chart data mapping with time series', async ({ page }) => {
    await helper.uploadData('multi-series-data.csv');
    await helper.selectChartType('Line Chart');
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('scatter chart data mapping with numeric validation', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    await helper.selectChartType('Scatter Chart');
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('violin chart data mapping with multiple X columns', async ({ page }) => {
    await helper.uploadData('violin-boxplot-data.csv');
    await helper.selectChartType('Violin Chart');
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('boxplot chart data mapping with group field', async ({ page }) => {
    await helper.uploadData('violin-boxplot-data.csv');
    await helper.selectChartType('Boxplot Chart');
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });

  test('pie chart data mapping with label and value', async ({ page }) => {
    await helper.uploadData('basic-data.csv');
    await helper.selectChartType('Pie Chart');
    
    await helper.configureField('label', 'Category');
    await helper.configureField('value', 'Value');
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
    await helper.expectNoValidationErrors();
    
    // Verify pie slices are rendered
    const pieSlices = await page.locator('[data-testid="pie-path"]').count();
    expect(pieSlices).toBe(5);
  });

  test('bubble chart data mapping with three dimensions', async ({ page }) => {
    await helper.uploadData('multi-series-data.csv');
    await helper.selectChartType('Bubble Chart');
    
    await helper.waitForChartLoad();
    await helper.expectChartRendered();
  });
});
