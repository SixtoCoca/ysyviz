export const FieldDescriptions = {
    category: {
        title: 'Category',
        description: 'The category or group that each data point belongs to. This will be displayed on the X-axis for most charts.',
        examples: ['Country', 'Month', 'Product Type', 'Department'],
        format: 'Text values'
    },
    value: {
        title: 'Value',
        description: 'The numerical value to be displayed. This determines the height, size, or position of each data point.',
        examples: ['Sales: 1500', 'Revenue: 25000', 'Count: 42'],
        format: 'Numbers'
    },
    x: {
        title: 'X Axis',
        description: 'The horizontal axis values. Can be categories, dates, or numerical values.',
        examples: ['Date: 2024-01-15', 'Category: A', 'Value: 10'],
        format: 'Text, numbers, or dates'
    },
    y: {
        title: 'Y Axis',
        description: 'The vertical axis values. Usually numerical values that determine the height or position.',
        examples: ['Sales: 1500', 'Temperature: 25.5', 'Score: 85'],
        format: 'Numbers'
    },
    r: {
        title: 'Radius',
        description: 'The size of bubbles or circles. Larger values create bigger visual elements.',
        examples: ['Population: 1000000', 'Size: 50', 'Volume: 250'],
        format: 'Numbers (positive values)'
    },
    label: {
        title: 'Label',
        description: 'Text labels to display on data points, slices, or nodes.',
        examples: ['Name: "Product A"', 'City: "New York"', 'Category: "Electronics"'],
        format: 'Text values'
    },
    group: {
        title: 'Group',
        description: 'Groups data points together for comparison or categorization.',
        examples: ['Department: "Sales"', 'Region: "North"', 'Type: "Premium"'],
        format: 'Text values'
    },
    source: {
        title: 'Source',
        description: 'The starting point in flow diagrams (Sankey). Represents where something comes from.',
        examples: ['From: "Production"', 'Source: "Supplier A"', 'Origin: "Factory"'],
        format: 'Text values'
    },
    target: {
        title: 'Target',
        description: 'The destination point in flow diagrams (Sankey). Represents where something goes to.',
        examples: ['To: "Sales"', 'Destination: "Customer"', 'End: "Warehouse"'],
        format: 'Text values'
    },
    series: {
        title: 'Series',
        description: 'Groups data into different series for comparison. Each series gets its own color.',
        examples: ['Year: "2023"', 'Product: "Laptop"', 'Region: "Europe"'],
        format: 'Text values'
    },
    path: {
        title: 'Path',
        description: 'Hierarchical path structure for tree-like charts. Use forward slashes to separate levels.',
        examples: ['Root/Level1/Level2', 'Company/Department/Team', 'Category/Subcategory/Product'],
        format: 'Path with / separators'
    },
    dimensions: {
        title: 'Dimensions',
        description: 'Multiple columns to create parallel coordinates. Each dimension becomes a vertical axis.',
        examples: ['Height, Weight, Age', 'Price, Rating, Sales', 'Temp, Humidity, Pressure'],
        format: 'Multiple numerical columns'    
    },
    date: {
        title: 'Date',
        description: 'The field containing date values. This is used for time-based charts like line charts and heatmaps.',
        examples: ['Date: 2024-01-15', 'Date: 2024-02-20', 'Date: 2024-03-25'],
        format: 'Dates (YYYY-MM-DD)'
    },
    age: {
        title: 'Age',
        description: 'Age values for population pyramids or age-based analysis.',
        examples: ['Age: 25', 'Age Group: "18-24"', 'Age: 65'],
        format: 'Numbers or text'
    },
    pyramid_left: {
        title: 'Pyramid Left',
        description: 'Values for the left side of the pyramid chart. Usually represents one category or group.',
        examples: ['Male: 1000', 'Before: 500', 'Group A: 250'],
        format: 'Numbers'
    },
    pyramid_right: {
        title: 'Pyramid Right',
        description: 'Values for the right side of the pyramid chart. Usually represents another category or group.',
        examples: ['Female: 1200', 'After: 600', 'Group B: 300'],
        format: 'Numbers'
    }
};

export const getFieldDescription = (fieldName) => {
    return FieldDescriptions[fieldName] || {
        title: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
        description: 'Field for data mapping',
        examples: [],
        format: 'Text or numbers'
    };
};
