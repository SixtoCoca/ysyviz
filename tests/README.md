# Testing Structure

## Overview
This project uses Playwright for integration and E2E testing with a layered approach.

## Structure

```
tests/
├── integration/           # Integration tests (50-70 tests)
│   ├── data-mapping.spec.js
│   ├── configuration.spec.js
│   ├── validation.spec.js
│   └── multi-value.spec.js
├── e2e/                  # E2E tests (19 tests - 1 per chart type)
│   └── chart-types.spec.js
├── fixtures/             # Test data files
│   ├── basic-data.csv
│   ├── multi-series-data.csv
│   ├── violin-boxplot-data.csv
│   └── invalid-data.csv
└── helpers/              # Test utilities
    └── chart-helpers.js
```

## Running Tests

### Integration Tests Only
```bash
npm run test:integration
```

### E2E Tests Only
```bash
npm run test:e2e
```

### All Tests
```bash
npm run test:all
```

### With UI
```bash
npm run test:ui
```

### Debug Mode
```bash
npm run test:debug
```

### View Report
```bash
npm run test:report
```

## Test Categories

### Integration Tests
- **Data Mapping**: Tests data transformation and mapping logic
- **Configuration**: Tests chart configuration and settings
- **Validation**: Tests data validation and error handling
- **Multi-Value**: Tests multi-value series functionality

### E2E Tests
- **Chart Types**: Complete workflow for each chart type
- **Complex Workflows**: Advanced user scenarios
- **Export Functionality**: Chart export features

## Test Data

### basic-data.csv
Simple dataset with Category and Value columns for basic chart testing.

### multi-series-data.csv
Time series data with multiple value columns for multi-series testing.

### violin-boxplot-data.csv
Data with multiple category columns for violin and boxplot testing.

### invalid-data.csv
Data with non-numeric values for validation testing.

## Helpers

### ChartTestHelper
Provides common methods for:
- Uploading test data
- Selecting chart types
- Configuring fields
- Switching color modes
- Setting titles
- Expecting chart rendering
- Validation error checking

## Test Patterns

### Before Each
```javascript
test.beforeEach(async ({ page }) => {
  helper = new ChartTestHelper(page);
  await page.goto('/');
});
```

### Basic Test Structure
```javascript
test('test description', async ({ page }) => {
  // Arrange
  await helper.uploadData('filename.csv');
  await helper.selectChartType('Chart Type');
  
  // Act
  await helper.configureField('field', 'value');
  
  // Assert
  await helper.expectChartRendered();
  await helper.expectNoValidationErrors();
});
```

## Data Test IDs

The tests use the following data-testid attributes:
- `chart-container`: Main chart container
- `validation-error`: Validation error messages
- `color-mode-switch`: Color mode toggle
- `palette-control`: Palette configuration
- `color-control`: Single color configuration
- `title-field`: Title configuration
- `legend`: Chart legend
- `legend-position-field`: Legend position configuration

## Chart Element Test IDs

- `bar-rect`: Bar chart rectangles
- `line-path`: Line chart paths
- `scatter-circle`: Scatter plot circles
- `bubble-circle`: Bubble chart circles
- `pie-path`: Pie chart slices
- `violin-path`: Violin chart paths
- `boxplot-rect`: Boxplot rectangles
- `area-path`: Area chart paths

## Best Practices

1. **Use helpers**: Always use ChartTestHelper for common operations
2. **Wait for loading**: Use waitForChartLoad() before assertions
3. **Check validation**: Always verify no validation errors after successful operations
4. **Test data**: Use appropriate test data for each test scenario
5. **Descriptive names**: Use clear, descriptive test names
6. **Isolation**: Each test should be independent and not rely on others
