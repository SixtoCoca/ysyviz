# Consejos al subir los datos 

Para poder representar de forma correcta los datos, debemos subir un buen archivo ya sea CSV o XLSX, ya que Ysyviz no nos permite modifcar nuestro archivo.

  

## Estructura Recomendada

La estructura óptima para nuestro archivo es la siguiente:

### Formato 

```csv

Columna1,Columna2,Columna3

Valor1,Valor2,Valor3

Valor4,Valor5,Valor6

```

  
Un fichero donde la primera fila son los encabezados de nuestro valor, es el valor que utilizaremos para mapear nuestros datos en los gráficos, y el resto son los valores a representar en nuestro gráfico.

  

## Ejemplos de Archivos

  

### Ventas por Mes

```csv

Mes,Ventas_2023,Ventas_2024

Enero,1200,1400

Febrero,1500,1600

Marzo,1800,1900

Abril,2100,2200

Mayo,1950,2100

```

  

### Comparación de Categorías

```csv

Categoría,Ingresos,Gastos,Beneficio

Electrónicos,45000,30000,15000

Ropa,32000,22000,10000

Hogar,28000,18000,10000

Deportes,15000,10000,5000

```

  

### Series Temporales

```csv

Fecha,Temperatura_Min,Temperatura_Max,Precipitaciones

2023-01-01,5,15,0

2023-01-02,7,18,5

2023-01-03,10,22,0

2023-01-04,8,20,10

```

 
  

---

  

[← Configuraciones por Tipo](./chart-configs) | [→ Exportación](./export)