import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Ysyviz",
  description: "Crear gráficos profesionales sin escribir código",
  
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Manual de Usuario', link: '/guide/' }
    ],

    sidebar: [
      {
        text: 'Manual de Usuario',
        items: [
          { text: 'Introducción', link: '/guide/' },
          { text: 'Flujo de Trabajo', link: '/guide/workflow' },
          { text: 'Configuraciones por Tipo', link: '/guide/chart-configs' },
          { text: 'Preparación de Datos CSV', link: '/guide/csv' },
          { text: 'Exportación', link: '/guide/export' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/SixtoCoca/ysyviz' }
    ]
  }
})
