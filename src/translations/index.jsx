export const translations = {
    en: {
        // Header
        upload_file: 'Upload File',
        preview_download: 'Preview & Download',
        
        // Upload section
        upload_data: 'Upload Data',
        drag_drop_message: 'Drag & drop your file here, or click to select',
        selected: 'Selected',
        loaded: 'Loaded',
        ready_to_load: 'Ready to load',
        upload: 'Upload',
        error_processing_file: 'Error processing the file. Make sure it is a valid .csv or .xlsx file.',
        error_uploading_file: 'There was an error uploading the file.',
        file_uploaded_successfully: 'The file "{filename}" was uploaded successfully.',
        
        // Chart configuration
        chart_configuration: 'Chart Configuration',
        column_mapping: 'Column Mapping',
        no_mapping_required: 'No mapping required',
        complete_required_fields: 'Complete the required fields to render the chart.',
        fix_validation_errors: 'Fix the validation errors to render the chart.',
        upload_data_and_select_type: 'Please upload a data file and select a chart type to see the visualization.',
        select_chart_type: 'Please select a chart type to start configuring your visualization.',
        
        // Field labels
        category: 'Category',
        value: 'Value',
        x_axis: 'X Axis',
        y_axis: 'Y Axis',
        radius: 'Radius',
        label: 'Label',
        group: 'Group',
        source: 'Source',
        target: 'Target',
        series: 'Series',
        dimensions: 'Dimensions',
        path: 'Path',
        
        // Chart types
        bar_chart: 'Bar Chart',
        line_chart: 'Line Chart',
        area_chart: 'Area Chart',
        pie_chart: 'Pie Chart',
        donut_chart: 'Donut Chart',
        scatter_chart: 'Scatter Chart',
        bubble_chart: 'Bubble Chart',
        heatmap_chart: 'Heatmap Chart',
        sankey_chart: 'Sankey Chart',
        chord_chart: 'Chord Chart',
        violin_chart: 'Violin Chart',
        boxplot_chart: 'Boxplot Chart',
        hexbin_chart: 'Hexbin Chart',
        parallel_chart: 'Parallel Coordinates Chart',
        treemap_chart: 'Treemap Chart',
        sunburst_chart: 'Sunburst Chart',
        waterfall_chart: 'Waterfall Chart',
        calendar_chart: 'Calendar Heatmap Chart',
        
        // Appearance panel
        appearance: 'Appearance',
        title: 'Title',
        color: 'Color',
        palette: 'Palette',
        orientation: 'Orientation',
        horizontal: 'Horizontal',
        vertical: 'Vertical',
        legend_position: 'Legend Position',
        custom_legend: 'Custom Legend',
        custom_legend_position: 'Custom Legend Position',
        top_left: 'Top Left',
        top_right: 'Top Right',
        bottom_left: 'Bottom Left',
        bottom_right: 'Bottom Right',
        disabled: 'Disabled',
        
        // Specific settings
        specific_settings: 'Specific Settings',
        donut_hole: 'Donut Hole',
        point_size: 'Point Size',
        opacity: 'Opacity',
        stroke_color: 'Stroke Color',
        font_size: 'Font Size',
        value_format: 'Value Format',
        show_values: 'Show Values',
        up_color: 'Up Color',
        down_color: 'Down Color',
        initial_value: 'Initial Value',
        show_final_value: 'Show Final Value',
        bandwidth: 'Bandwidth',
        min_width_fraction: 'Min Width Fraction',
        thresholds: 'Thresholds',
        iqr_multiplier: 'IQR Multiplier',
        y_min: 'Y Min',
        y_max: 'Y Max',
        
        // Validation
        validation: 'Validation',
        errors: 'errors',
        warnings: 'warnings',
        info: 'info',
        clear: 'Clear',
        unknown_issue: 'Unknown issue',
        
        // Chart preview
        chart_preview: 'Chart Preview',
        error_rendering_chart: 'Error rendering chart. Check the validation panel.',
        
        // Download
        download: 'Download',
        png: 'PNG',
        svg: 'SVG',
        
        // Field descriptions
        category_description: 'The category or group that each data point belongs to. This will be displayed on the X-axis for most charts.',
        value_description: 'The numerical value to be displayed. This determines the height, size, or position of each data point.',
        x_axis_description: 'The horizontal axis values. Can be categories, dates, or numerical values.',
        y_axis_description: 'The vertical axis values. Usually numerical values that determine the height or position.',
        radius_description: 'The size of bubbles or circles. Larger values create bigger visual elements.',
        label_description: 'Text labels to display on data points, slices, or nodes.',
        group_description: 'Groups data points together for comparison or categorization.',
        source_description: 'The starting point in flow diagrams (Sankey). Represents where something comes from.',
        target_description: 'The destination point in flow diagrams (Sankey). Represents where something goes to.',
        series_description: 'Groups data into different series for comparison. Each series gets its own color.',
        path_description: 'Hierarchical path structure for tree-like charts. Use forward slashes to separate levels.',
        dimensions_description: 'Multiple columns to create parallel coordinates. Each dimension becomes a vertical axis.',
        
        // Format descriptions
        text_values: 'Text values',
        numbers: 'Numbers',
        text_numbers_dates: 'Text, numbers, or dates',
        positive_numbers: 'Numbers (positive values)',
        path_separators: 'Path with / separators',
        multiple_numerical: 'Multiple numerical columns',
        
        // Examples
        examples: 'Examples',
        format: 'Format',
        
        // Chord chart specific
        chord_data_format: 'Chord Chart Data Format',
        chord_description: 'The Chord chart requires a relationship matrix where:',
        chord_entity_row: 'Each row represents an entity (company, country, department, etc.)',
        chord_entity_column: 'Each column represents the same entities',
        chord_values: 'Values in the matrix represent the strength of relationships between entities',
        example_csv_format: 'Example CSV format:',
        
        // Help text
        help_csv_2_columns: 'CSV with 2 columns: x and y',
        help_csv_numeric: 'CSV with 2 numeric columns: x and y',
        help_csv_label_value: 'CSV with 2 columns: label and value',
        help_csv_3_numeric: 'CSV with 3 numeric columns: x, y and size',
        help_valid_csv: 'Upload a valid CSV file',
        
        // Placeholders
        select_column: 'Select column',
        select_legend_position: 'Select legend position',
        select_custom_legend_position: 'Select custom legend position',
        enter_custom_legend: 'Enter custom legend text',
        select_dimensions: 'Select dimensions',
        choose_legend_position: 'Choose where to display the legend or disable it',
        choose_custom_legend_position: 'Choose where to display the custom legend text',
        add_custom_text: 'Add custom text to display as legend',
        
        // Language selector
        language: 'Language',
        english: 'English',
        spanish: 'Spanish',
        
        // Additional controls
        enter: 'Enter',
        pick_palette: 'Pick palette',
        horizontal_orientation: 'Horizontal Orientation',
        horizontal_description: 'Categories on Y-axis, values on X-axis',
        vertical_description: 'Categories on X-axis, values on Y-axis',
        chart_type: 'Chart Type'
    },
    es: {
        // Header
        upload_file: 'Subir Archivo',
        preview_download: 'Vista Previa y Descarga',
        
        // Upload section
        upload_data: 'Subir Datos',
        drag_drop_message: 'Arrastra y suelta tu archivo aquí, o haz clic para seleccionar',
        selected: 'Seleccionado',
        loaded: 'Cargado',
        ready_to_load: 'Listo para cargar',
        upload: 'Subir',
        error_processing_file: 'Error al procesar el archivo. Asegúrate de que sea un archivo .csv o .xlsx válido.',
        error_uploading_file: 'Hubo un error al subir el archivo.',
        file_uploaded_successfully: 'El archivo "{filename}" se subió correctamente.',
        
        // Chart configuration
        chart_configuration: 'Configuración del Gráfico',
        column_mapping: 'Mapeo de Columnas',
        no_mapping_required: 'No se requiere mapeo',
        complete_required_fields: 'Completa los campos requeridos para renderizar el gráfico.',
        fix_validation_errors: 'Corrige los errores de validación para renderizar el gráfico.',
        upload_data_and_select_type: 'Por favor sube un archivo de datos y selecciona un tipo de gráfico para ver la visualización.',
        select_chart_type: 'Por favor selecciona un tipo de gráfico para comenzar a configurar tu visualización.',
        
        // Field labels
        category: 'Categoría',
        value: 'Valor',
        x_axis: 'Eje X',
        y_axis: 'Eje Y',
        radius: 'Radio',
        label: 'Etiqueta',
        group: 'Grupo',
        source: 'Origen',
        target: 'Destino',
        series: 'Serie',
        dimensions: 'Dimensiones',
        path: 'Ruta',
        
        // Chart types
        bar_chart: 'Gráfico de Barras',
        line_chart: 'Gráfico de Líneas',
        area_chart: 'Gráfico de Áreas',
        pie_chart: 'Gráfico Circular',
        donut_chart: 'Gráfico de Donut',
        scatter_chart: 'Gráfico de Dispersión',
        bubble_chart: 'Gráfico de Burbujas',
        heatmap_chart: 'Mapa de Calor',
        sankey_chart: 'Gráfico de Sankey',
        chord_chart: 'Gráfico de Cuerdas',
        violin_chart: 'Gráfico de Violín',
        boxplot_chart: 'Gráfico de Cajas',
        hexbin_chart: 'Gráfico de Hexágonos',
        parallel_chart: 'Gráfico de Coordenadas Paralelas',
        treemap_chart: 'Gráfico de Árbol',
        sunburst_chart: 'Gráfico de Explosión Solar',
        waterfall_chart: 'Gráfico de Cascada',
        calendar_chart: 'Mapa de Calor de Calendario',
        
        // Appearance panel
        appearance: 'Apariencia',
        title: 'Título',
        color: 'Color',
        palette: 'Paleta',
        orientation: 'Orientación',
        horizontal: 'Horizontal',
        vertical: 'Vertical',
        legend_position: 'Posición de Leyenda',
        custom_legend: 'Leyenda Personalizada',
        custom_legend_position: 'Posición de Leyenda Personalizada',
        top_left: 'Arriba Izquierda',
        top_right: 'Arriba Derecha',
        bottom_left: 'Abajo Izquierda',
        bottom_right: 'Abajo Derecha',
        disabled: 'Deshabilitado',
        
        // Specific settings
        specific_settings: 'Configuración Específica',
        donut_hole: 'Agujero del Donut',
        point_size: 'Tamaño del Punto',
        opacity: 'Opacidad',
        stroke_color: 'Color del Trazo',
        font_size: 'Tamaño de Fuente',
        value_format: 'Formato de Valor',
        show_values: 'Mostrar Valores',
        up_color: 'Color de Subida',
        down_color: 'Color de Bajada',
        initial_value: 'Valor Inicial',
        show_final_value: 'Mostrar Valor Final',
        bandwidth: 'Ancho de Banda',
        min_width_fraction: 'Fracción de Ancho Mínimo',
        thresholds: 'Umbrales',
        iqr_multiplier: 'Multiplicador IQR',
        y_min: 'Y Mínimo',
        y_max: 'Y Máximo',
        
        // Validation
        validation: 'Validación',
        errors: 'errores',
        warnings: 'advertencias',
        info: 'información',
        clear: 'Limpiar',
        unknown_issue: 'Problema desconocido',
        
        // Chart preview
        chart_preview: 'Vista Previa del Gráfico',
        error_rendering_chart: 'Error al renderizar el gráfico. Revisa el panel de validación.',
        
        // Download
        download: 'Descargar',
        png: 'PNG',
        svg: 'SVG',
        
        // Field descriptions
        category_description: 'La categoría o grupo al que pertenece cada punto de datos. Se mostrará en el eje X para la mayoría de gráficos.',
        value_description: 'El valor numérico a mostrar. Determina la altura, tamaño o posición de cada punto de datos.',
        x_axis_description: 'Los valores del eje horizontal. Pueden ser categorías, fechas o valores numéricos.',
        y_axis_description: 'Los valores del eje vertical. Generalmente valores numéricos que determinan la altura o posición.',
        radius_description: 'El tamaño de las burbujas o círculos. Valores más grandes crean elementos visuales más grandes.',
        label_description: 'Etiquetas de texto para mostrar en puntos de datos, sectores o nodos.',
        group_description: 'Agrupa puntos de datos para comparación o categorización.',
        source_description: 'El punto de partida en diagramas de flujo (Sankey). Representa de dónde viene algo.',
        target_description: 'El punto de destino en diagramas de flujo (Sankey). Representa hacia dónde va algo.',
        series_description: 'Agrupa datos en diferentes series para comparación. Cada serie obtiene su propio color.',
        path_description: 'Estructura de ruta jerárquica para gráficos tipo árbol. Usa barras diagonales para separar niveles.',
        dimensions_description: 'Múltiples columnas para crear coordenadas paralelas. Cada dimensión se convierte en un eje vertical.',
        
        // Format descriptions
        text_values: 'Valores de texto',
        numbers: 'Números',
        text_numbers_dates: 'Texto, números o fechas',
        positive_numbers: 'Números (valores positivos)',
        path_separators: 'Ruta con separadores /',
        multiple_numerical: 'Múltiples columnas numéricas',
        
        // Examples
        examples: 'Ejemplos',
        format: 'Formato',
        
        // Chord chart specific
        chord_data_format: 'Formato de Datos del Gráfico de Cuerdas',
        chord_description: 'El gráfico de cuerdas requiere una matriz de relaciones donde:',
        chord_entity_row: 'Cada fila representa una entidad (empresa, país, departamento, etc.)',
        chord_entity_column: 'Cada columna representa las mismas entidades',
        chord_values: 'Los valores en la matriz representan la fuerza de las relaciones entre entidades',
        example_csv_format: 'Ejemplo de formato CSV:',
        
        // Help text
        help_csv_2_columns: 'CSV con 2 columnas: x e y',
        help_csv_numeric: 'CSV con 2 columnas numéricas: x e y',
        help_csv_label_value: 'CSV con 2 columnas: etiqueta y valor',
        help_csv_3_numeric: 'CSV con 3 columnas numéricas: x, y y tamaño',
        help_valid_csv: 'Sube un archivo CSV válido',
        
        // Placeholders
        select_column: 'Seleccionar columna',
        select_legend_position: 'Seleccionar posición de leyenda',
        select_custom_legend_position: 'Seleccionar posición de leyenda personalizada',
        enter_custom_legend: 'Introducir texto de leyenda personalizada',
        select_dimensions: 'Seleccionar dimensiones',
        choose_legend_position: 'Elige dónde mostrar la leyenda o desactívala',
        choose_custom_legend_position: 'Elige dónde mostrar el texto de leyenda personalizada',
        add_custom_text: 'Añadir texto personalizado para mostrar como leyenda',
        
        // Language selector
        language: 'Idioma',
        english: 'Inglés',
        spanish: 'Español',
        
        // Additional controls
        enter: 'Introducir',
        pick_palette: 'Elegir paleta',
        horizontal_orientation: 'Orientación Horizontal',
        horizontal_description: 'Categorías en eje Y, valores en eje X',
        vertical_description: 'Categorías en eje X, valores en eje Y',
        chart_type: 'Tipo de Gráfico'
    }
};

export const getTranslation = (key, language = 'en', params = {}) => {
    let text = translations[language]?.[key] || translations['en'][key] || key;
    
    // Replace parameters in the text
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
};
