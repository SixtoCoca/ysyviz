import { expect } from '@playwright/test';

export class ChartTestHelper {
  constructor(page) {
    this.page = page;
    this.chartTypeMapping = {
      'Bar Chart': 'bar',
      'Line Chart': 'line',
      'Area Chart': 'area',
      'Pie Chart': 'pie',
      'Donut Chart': 'donut',
      'Scatter Chart': 'scatter',
      'Bubble Chart': 'bubble',
      'Heatmap Chart': 'heatmap',
      'Sankey Chart': 'sankey',
      'Chord Chart': 'chord',
      'Violin Chart': 'violin',
      'Boxplot Chart': 'boxplot',
      'Hexbin Chart': 'hexbin',
      'Parallel Coordinates Chart': 'parallel',
      'Treemap Chart': 'treemap',
      'Sunburst Chart': 'sunburst',
      'Waterfall Chart': 'waterfall',
      'Calendar Heatmap Chart': 'calendar',
      'Pyramid Chart': 'pyramid'
    };
  }

  async uploadData(filename) {
    await this.page.setInputFiles('[data-testid="file-input"]', `tests/fixtures/${filename}`);
    
    await this.page.click('[data-testid="upload-button"]');
    
    await this.page.waitForTimeout(2000);
  }

  async selectChartType(chartType) {
    await this.navigateToPreviewTab();
    await this.page.waitForSelector('[data-testid="chart-type-picker"]', { timeout: 10000 });
    
    const internalType = this.chartTypeMapping[chartType] || chartType;
    
    // Try to find the chart type on the current page
    let chartTypeElement = this.page.locator(`[data-testid="chart-type-${internalType}"]`);
    
    // If not found on current page, try to navigate to next page
    if (!(await chartTypeElement.isVisible())) {
      const nextBtn = this.page.locator('[data-testid="chart-type-next-btn"]');
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        await this.page.waitForTimeout(500); // Wait for page transition
        chartTypeElement = this.page.locator(`[data-testid="chart-type-${internalType}"]`);
      }
    }
    
    // If still not found, try previous page
    if (!(await chartTypeElement.isVisible())) {
      const prevBtn = this.page.locator('[data-testid="chart-type-prev-btn"]');
      if (await prevBtn.isVisible()) {
        await prevBtn.click();
        await this.page.waitForTimeout(500); // Wait for page transition
        chartTypeElement = this.page.locator(`[data-testid="chart-type-${internalType}"]`);
      }
    }
    
    await chartTypeElement.click();
  }

  async configureField(fieldType, fieldName) {
    const fieldSelector = `[data-testid="${fieldType}-field"]`;
    
    await this.page.click(fieldSelector);
    await this.page.waitForTimeout(500);
    
    const optionSelector = `.ncg-select__option:has-text("${fieldName}")`;
    await this.page.waitForSelector(optionSelector, { timeout: 5000 });
    await this.page.click(optionSelector);
    
    await this.page.waitForTimeout(500);
  }

  async configureMultiField(fieldType, fieldNames) {
    await this.page.click(`[data-testid="${fieldType}-field"]`);
    for (const fieldName of fieldNames) {
      await this.page.waitForSelector(`.ncg-select__option:has-text("${fieldName}")`, { timeout: 5000 });
      await this.page.click(`text=${fieldName}`);
    }
  }

  async navigateToPreviewTab() {
    await this.page.click('[data-testid="preview-tab"]');
    await this.page.waitForSelector('[data-testid="preview-pane"]', { timeout: 10000 });
  }

  async navigateToConfigTab() {
    const configTab = this.page.locator('[data-testid="config-tab"]');
    if (await configTab.isVisible()) {
      await configTab.click();
      await this.page.waitForSelector('[data-testid="config-pane"]', { timeout: 10000 });
    } else {
      await this.navigateToPreviewTab();
    }
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('[data-testid="app-logo"]', { timeout: 10000 });
  }

  async waitForChartLoad() {
    await this.page.waitForSelector('[data-testid="chart-container"]', { timeout: 10000 });
    await this.page.waitForTimeout(1000); // Wait for chart to render
  }

  async expectChartRendered() {
    await expect(this.page.locator('[data-testid="chart-container"]')).toBeVisible();
  }

  async expectChartTypeSelected(chartType) {
    const internalType = this.chartTypeMapping[chartType] || chartType;
    await expect(this.page.locator(`[data-testid="chart-type-${internalType}"][data-selected="true"]`)).toBeVisible();
  }

  async expectFileUploaded(filename) {
    await expect(this.page.locator(`[data-testid="selected-file-badge"]`)).toBeVisible();
  }

  async switchColorMode() {
    await this.page.click('[data-testid="color-mode-switch"]');
  }

  async expectValidationError(message) {
    await expect(this.page.locator(`text=${message}`)).toBeVisible();
  }

  async expectNoValidationErrors() {
    await expect(this.page.locator('[data-testid="validation-error"]')).not.toBeVisible();
  }

  async setTitle(title) {
    await this.page.fill('[data-testid="title-control"] input', title);
  }

  async expectChartTitle(title) {
    await expect(this.page.locator(`text=${title}`)).toBeVisible();
  }
}
