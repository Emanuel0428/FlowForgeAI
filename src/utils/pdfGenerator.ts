import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFGenerationOptions {
  title: string;
  subtitle?: string;
  author?: string;
  company?: string;
  date?: string;
  includeCharts?: boolean;
  includeMetrics?: boolean;
  userProfile?: any;
  moduleType?: string;
}

// Paleta de colores FlowForge AI
const FLOWFORGE_COLORS = {
  // Colores principales
  primary: [0, 212, 255] as [number, number, number],        // Cyan brillante
  primaryDark: [0, 150, 200] as [number, number, number],    // Cyan oscuro
  secondary: [147, 51, 234] as [number, number, number],     // Púrpura
  accent: [34, 211, 238] as [number, number, number],        // Cyan claro
  
  // Colores de fondo
  background: [248, 250, 252] as [number, number, number],   // Gris muy claro
  surface: [255, 255, 255] as [number, number, number],      // Blanco
  
  // Colores de texto
  textPrimary: [15, 23, 42] as [number, number, number],     // Slate 900
  textSecondary: [71, 85, 105] as [number, number, number],  // Slate 600
  textMuted: [100, 116, 139] as [number, number, number],    // Slate 500
  
  // Colores de estado (paleta coherente)
  success: [16, 185, 129] as [number, number, number],       // Emerald 500
  warning: [245, 158, 11] as [number, number, number],       // Amber 500
  info: [59, 130, 246] as [number, number, number],          // Blue 500
  neutral: [148, 163, 184] as [number, number, number],      // Slate 400
  
  // Gradientes para gráficos (sin rojo intenso)
  chartColors: [
    [0, 212, 255] as [number, number, number],    // Cyan principal
    [16, 185, 129] as [number, number, number],   // Verde esmeralda
    [147, 51, 234] as [number, number, number],   // Púrpura
    [59, 130, 246] as [number, number, number],   // Azul
    [34, 211, 238] as [number, number, number],   // Cyan claro
    [245, 158, 11] as [number, number, number],   // Ámbar
    [139, 92, 246] as [number, number, number],   // Violeta
    [6, 182, 212] as [number, number, number]     // Cyan 500
  ]
};

export class PDFGenerator {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;
  private lineHeight: number;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;
    this.lineHeight = 7;
  }

  // Helper para aplicar colores FlowForge
  private setFillColorFromArray(color: [number, number, number], alpha?: number): void {
    if (alpha !== undefined) {
      this.pdf.setFillColor(color[0], color[1], color[2], alpha);
    } else {
      this.pdf.setFillColor(color[0], color[1], color[2]);
    }
  }

  private setTextColorFromArray(color: [number, number, number]): void {
    this.pdf.setTextColor(color[0], color[1], color[2]);
  }

  private setDrawColorFromArray(color: [number, number, number]): void {
    this.pdf.setDrawColor(color[0], color[1], color[2]);
  }

  // Limpiar texto markdown
  private cleanMarkdownText(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remover **texto**
      .replace(/\*(.*?)\*/g, '$1') // Remover *texto*
      .replace(/#{1,6}\s/g, '') // Remover # headers
      .replace(/`(.*?)`/g, '$1') // Remover `código`
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remover [texto](link)
      .replace(/^\s*[-*+]\s/gm, '• ') // Convertir listas a bullets
      .replace(/^\s*\d+\.\s/gm, '') // Remover numeración
      .replace(/[📊🎯📈🚀🛠️💰⚠️🔍💡⭐🎨🌟]/g, '') // Remover emojis
      .trim();
  }

  // Generar PDF completo del reporte
  async generateReportPDF(
    reportContent: string,
    options: PDFGenerationOptions
  ): Promise<void> {
    try {
      console.log('🎨 Iniciando generación de PDF profesional FlowForge AI...');
      
      // Configurar metadatos del PDF
      this.setupPDFMetadata(options);
      
      // Generar portada profesional
      await this.generateCoverPage(options);
      
      // Agregar nueva página para el contenido
      this.pdf.addPage();
      this.currentY = this.margin;
      
      // Generar tabla de contenidos
      this.generateTableOfContents(reportContent);
      
      // Agregar nueva página para el reporte
      this.pdf.addPage();
      this.currentY = this.margin;
      
      // Procesar y agregar contenido del reporte
      await this.processReportContent(reportContent, options);
      
      // Agregar secciones visuales mejoradas
      await this.addEnhancedVisualSections(options);
      
      // Agregar pie de página a todas las páginas
      this.addFooterToAllPages(options);
      
      // Descargar el PDF
      const fileName = `FlowForge-AI-Report-${options.title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      this.pdf.save(fileName);
      
      console.log('✅ PDF FlowForge AI generado exitosamente:', fileName);
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      throw new Error('Error al generar el PDF del reporte');
    }
  }

  // Configurar metadatos del PDF
  private setupPDFMetadata(options: PDFGenerationOptions): void {
    this.pdf.setProperties({
      title: `FlowForge AI - ${options.title}`,
      subject: 'Reporte de Consultoría Digital Profesional',
      author: options.author || 'FlowForge AI',
      creator: 'FlowForge AI Platform',
      keywords: 'consultoría, digital, automatización, AI, estrategia, ROI, roadmap'
    });
  }

  // Generar portada profesional mejorada con paleta FlowForge
  private async generateCoverPage(options: PDFGenerationOptions): Promise<void> {
    const centerX = this.pageWidth / 2;
    
    // Fondo degradado profesional FlowForge
    this.setFillColorFromArray(FLOWFORGE_COLORS.textPrimary);
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
    
    // Elementos decorativos modernos con paleta coherente
    this.setFillColorFromArray(FLOWFORGE_COLORS.primary, 0.15);
    this.pdf.circle(centerX - 40, 50, 35, 'F');
    this.setFillColorFromArray(FLOWFORGE_COLORS.secondary, 0.12);
    this.pdf.circle(centerX + 50, 100, 28, 'F');
    this.setFillColorFromArray(FLOWFORGE_COLORS.accent, 0.18);
    this.pdf.circle(centerX - 30, 150, 22, 'F');
    
    // Patrón geométrico sutil
    this.setFillColorFromArray(FLOWFORGE_COLORS.primary, 0.08);
    this.pdf.rect(centerX - 80, 40, 160, 2, 'F');
    this.pdf.rect(centerX - 70, 45, 140, 1, 'F');
    this.pdf.rect(centerX - 90, 35, 180, 1, 'F');
    
    // Logo y marca principal
    this.setTextColorFromArray(FLOWFORGE_COLORS.surface);
    this.pdf.setFontSize(44);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('FlowForge AI', centerX, 80, { align: 'center' });
    
    // Subtítulo elegante con color primario
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'normal');
    this.setTextColorFromArray(FLOWFORGE_COLORS.primary);
    this.pdf.text('Consultoría Digital Inteligente', centerX, 95, { align: 'center' });
    
    // Línea decorativa con gradiente simulado
    this.setDrawColorFromArray(FLOWFORGE_COLORS.primary);
    this.pdf.setLineWidth(3);
    this.pdf.line(centerX - 70, 105, centerX + 70, 105);
    this.setDrawColorFromArray(FLOWFORGE_COLORS.accent);
    this.pdf.setLineWidth(1);
    this.pdf.line(centerX - 60, 107, centerX + 60, 107);
    
    // Título del reporte con mejor formato
    this.pdf.setFontSize(30);
    this.pdf.setFont('helvetica', 'bold');
    this.setTextColorFromArray(FLOWFORGE_COLORS.surface);
    const titleLines = this.pdf.splitTextToSize(this.cleanMarkdownText(options.title), this.pageWidth - 60);
    this.pdf.text(titleLines, centerX, 140, { align: 'center' });
    
    // Subtítulo del reporte
    if (options.subtitle) {
      this.pdf.setFontSize(16);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(220, 220, 220);
      const subtitleLines = this.pdf.splitTextToSize(this.cleanMarkdownText(options.subtitle), this.pageWidth - 60);
      this.pdf.text(subtitleLines, centerX, 165, { align: 'center' });
    }
    
    // Información de la empresa
    if (options.company) {
      this.pdf.setFontSize(14);
      this.pdf.setTextColor(180, 180, 180);
      this.pdf.text(options.company, centerX, 190, { align: 'center' });
    }
    
    // Fecha profesional
    const reportDate = options.date || new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.pdf.setFontSize(12);
    this.setTextColorFromArray(FLOWFORGE_COLORS.textMuted);
    this.pdf.text(reportDate, centerX, 210, { align: 'center' });
    
    // Badge profesional mejorado con colores FlowForge
    this.setFillColorFromArray(FLOWFORGE_COLORS.primary, 0.2);
    this.pdf.roundedRect(centerX - 55, 230, 110, 28, 14, 14, 'F');
    this.setDrawColorFromArray(FLOWFORGE_COLORS.primary);
    this.pdf.setLineWidth(2);
    this.pdf.roundedRect(centerX - 55, 230, 110, 28, 14, 14, 'S');
    
    this.setTextColorFromArray(FLOWFORGE_COLORS.primary);
    this.pdf.setFontSize(13);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('REPORTE PROFESIONAL', centerX, 247, { align: 'center' });
    
    // Pie de página elegante
    this.setTextColorFromArray(FLOWFORGE_COLORS.textMuted);
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Generado por FlowForge AI - Consultoría Digital de Nivel McKinsey', centerX, this.pageHeight - 15, { align: 'center' });
  }

  // Generar tabla de contenidos mejorada
  private generateTableOfContents(reportContent: string): void {
    // Fondo limpio
    this.setFillColorFromArray(FLOWFORGE_COLORS.surface);
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
    
    // Título de la tabla de contenidos
    this.pdf.setFontSize(26);
    this.pdf.setFont('helvetica', 'bold');
    this.setTextColorFromArray(FLOWFORGE_COLORS.textPrimary);
    this.pdf.text('Tabla de Contenidos', this.margin, this.currentY + 15);
    this.currentY += 35;
    
    // Línea decorativa con gradiente FlowForge
    this.setDrawColorFromArray(FLOWFORGE_COLORS.primary);
    this.pdf.setLineWidth(2);
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.setDrawColorFromArray(FLOWFORGE_COLORS.accent);
    this.pdf.setLineWidth(1);
    this.pdf.line(this.margin, this.currentY + 2, this.pageWidth - this.margin, this.currentY + 2);
    this.currentY += 18;
    
    // Extraer secciones del contenido
    const sections = this.extractSections(reportContent);
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    
    sections.forEach((section, index) => {
      const pageNum = index + 3;
      
      // Título de sección
      this.setTextColorFromArray(FLOWFORGE_COLORS.textSecondary);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(this.cleanMarkdownText(section.title), this.margin, this.currentY);
      
      // Línea de puntos con color suave
      this.setTextColorFromArray(FLOWFORGE_COLORS.neutral);
      this.pdf.setFont('helvetica', 'normal');
      const dots = '.'.repeat(Math.floor((this.pageWidth - this.margin * 2 - 80) / 2));
      this.pdf.text(dots, this.margin + 100, this.currentY);
      
      // Número de página
      this.setTextColorFromArray(FLOWFORGE_COLORS.textPrimary);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(pageNum.toString(), this.pageWidth - this.margin - 15, this.currentY);
      
      this.currentY += this.lineHeight + 3;
      
      if (this.currentY > this.pageHeight - 40) {
        this.pdf.addPage();
        this.setFillColorFromArray(FLOWFORGE_COLORS.surface);
        this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
        this.currentY = this.margin;
      }
    });
  }

  // Extraer secciones del markdown
  private extractSections(content: string): Array<{ title: string; level: number }> {
    const lines = content.split('\n');
    const sections: Array<{ title: string; level: number }> = [];
    
    lines.forEach(line => {
      const headerMatch = line.match(/^(#{1,3})\s+(.+)/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const title = headerMatch[2];
        sections.push({ title, level });
      }
    });
    
    return sections;
  }

  // Procesar contenido del reporte mejorado
  private async processReportContent(content: string, options: PDFGenerationOptions): Promise<void> {
    // Fondo limpio
    this.setFillColorFromArray(FLOWFORGE_COLORS.surface);
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
    
    const lines = content.split('\n');
    
    for (const line of lines) {
      await this.processLine(line, options);
      
      // Verificar si necesitamos nueva página
      if (this.currentY > this.pageHeight - 40) {
        this.pdf.addPage();
        this.setFillColorFromArray(FLOWFORGE_COLORS.surface);
        this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
        this.currentY = this.margin;
      }
    }
  }

  // Procesar línea individual mejorada
  private async processLine(line: string, options: PDFGenerationOptions): Promise<void> {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      this.currentY += this.lineHeight / 2;
      return;
    }
    
    // Headers principales
    if (trimmedLine.startsWith('# ')) {
      this.addMainHeading(trimmedLine.substring(2));
    }
    // Subheaders
    else if (trimmedLine.startsWith('## ')) {
      this.addSubHeading(trimmedLine.substring(3));
    }
    // Sub-subheaders
    else if (trimmedLine.startsWith('### ')) {
      this.addSubSubHeading(trimmedLine.substring(4));
    }
    // Listas con bullets
    else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      this.addBulletPoint(trimmedLine.substring(2));
    }
    // Listas numeradas
    else if (/^\d+\.\s/.test(trimmedLine)) {
      this.addNumberedPoint(trimmedLine.replace(/^\d+\.\s/, ''));
    }
    // Texto normal
    else {
      this.addParagraph(trimmedLine);
    }
  }

  // Agregar título principal mejorado con colores FlowForge
  private addMainHeading(text: string): void {
    this.currentY += 15;
    
    // Fondo del título con gradiente FlowForge suave
    this.setFillColorFromArray(FLOWFORGE_COLORS.background);
    this.pdf.roundedRect(this.margin - 5, this.currentY - 12, this.pageWidth - 2 * this.margin + 10, 22, 10, 10, 'F');
    
    // Borde elegante con color primario
    this.setDrawColorFromArray(FLOWFORGE_COLORS.primary);
    this.pdf.setLineWidth(2);
    this.pdf.roundedRect(this.margin - 5, this.currentY - 12, this.pageWidth - 2 * this.margin + 10, 22, 10, 10, 'S');
    
    // Línea decorativa interna
    this.setDrawColorFromArray(FLOWFORGE_COLORS.accent);
    this.pdf.setLineWidth(1);
    this.pdf.roundedRect(this.margin - 3, this.currentY - 10, this.pageWidth - 2 * this.margin + 6, 18, 8, 8, 'S');
    
    this.pdf.setFontSize(22);
    this.pdf.setFont('helvetica', 'bold');
    this.setTextColorFromArray(FLOWFORGE_COLORS.textPrimary);
    
    const cleanText = this.cleanMarkdownText(text);
    this.pdf.text(cleanText, this.margin, this.currentY);
    
    this.currentY += 25;
  }

  // Agregar subtítulo mejorado con colores FlowForge
  private addSubHeading(text: string): void {
    this.currentY += 12;
    
    // Línea decorativa izquierda con gradiente
    this.setDrawColorFromArray(FLOWFORGE_COLORS.primary);
    this.pdf.setLineWidth(4);
    this.pdf.line(this.margin - 5, this.currentY - 6, this.margin - 5, this.currentY + 6);
    this.setDrawColorFromArray(FLOWFORGE_COLORS.accent);
    this.pdf.setLineWidth(2);
    this.pdf.line(this.margin - 3, this.currentY - 4, this.margin - 3, this.currentY + 4);
    
    this.pdf.setFontSize(17);
    this.pdf.setFont('helvetica', 'bold');
    this.setTextColorFromArray(FLOWFORGE_COLORS.textSecondary);
    
    const cleanText = this.cleanMarkdownText(text);
    this.pdf.text(cleanText, this.margin, this.currentY);
    
    this.currentY += 16;
  }

  // Agregar sub-subtítulo
  private addSubSubHeading(text: string): void {
    this.currentY += 10;
    
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.setTextColorFromArray(FLOWFORGE_COLORS.textSecondary);
    
    const cleanText = this.cleanMarkdownText(text);
    this.pdf.text(cleanText, this.margin, this.currentY);
    
    this.currentY += 12;
  }

  // Agregar párrafo mejorado
  private addParagraph(text: string): void {
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.setTextColorFromArray(FLOWFORGE_COLORS.textSecondary);
    
    const cleanText = this.cleanMarkdownText(text);
    const lines = this.pdf.splitTextToSize(cleanText, this.pageWidth - this.margin * 2);
    this.pdf.text(lines, this.margin, this.currentY);
    
    this.currentY += lines.length * this.lineHeight + 4;
  }

  // Agregar punto de lista mejorado con colores FlowForge
  private addBulletPoint(text: string): void {
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.setTextColorFromArray(FLOWFORGE_COLORS.textSecondary);
    
    // Bullet point elegante con color FlowForge
    this.setFillColorFromArray(FLOWFORGE_COLORS.primary);
    this.pdf.circle(this.margin + 3, this.currentY - 2, 1.8, 'F');
    
    // Texto
    const cleanText = this.cleanMarkdownText(text);
    const lines = this.pdf.splitTextToSize(cleanText, this.pageWidth - this.margin * 2 - 15);
    this.pdf.text(lines, this.margin + 12, this.currentY);
    
    this.currentY += lines.length * this.lineHeight + 3;
  }

  // Agregar punto numerado mejorado
  private addNumberedPoint(text: string): void {
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.setTextColorFromArray(FLOWFORGE_COLORS.textSecondary);
    
    const cleanText = this.cleanMarkdownText(text);
    const lines = this.pdf.splitTextToSize(cleanText, this.pageWidth - this.margin * 2 - 10);
    this.pdf.text(lines, this.margin + 8, this.currentY);
    
    this.currentY += lines.length * this.lineHeight + 3;
  }

  // Agregar secciones visuales mejoradas
  private async addEnhancedVisualSections(options: PDFGenerationOptions): Promise<void> {
    // Nueva página para métricas
    this.pdf.addPage();
    this.setFillColorFromArray(FLOWFORGE_COLORS.surface);
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
    this.currentY = this.margin;
    
    // Agregar métricas mejoradas
    await this.addAdvancedMetricsSection();
    
    // Nueva página para roadmap
    this.pdf.addPage();
    this.setFillColorFromArray(FLOWFORGE_COLORS.surface);
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
    this.currentY = this.margin;
    
    // Agregar roadmap mejorado
    await this.addAdvancedRoadmapSection();
    
    // Nueva página para análisis ROI
    this.pdf.addPage();
    this.setFillColorFromArray(FLOWFORGE_COLORS.surface);
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
    this.currentY = this.margin;
    
    // Agregar análisis ROI
    await this.addAdvancedROIAnalysis();
  }

  // Métricas avanzadas con paleta FlowForge
  private async addAdvancedMetricsSection(): Promise<void> {
    // Título de sección
    this.addMainHeading('Métricas Clave del Proyecto');
    
    const metrics = [
      {
        title: 'ROI Proyectado',
        value: '245%',
        change: '+45% vs. benchmark',
        description: 'Retorno de inversión estimado a 24 meses',
        colorIndex: 0
      },
      {
        title: 'Tiempo de Implementación',
        value: '8-10 meses',
        change: 'Break-even esperado',
        description: 'Cronograma optimizado para resultados rápidos',
        colorIndex: 1
      },
      {
        title: 'Automatización',
        value: '75%',
        change: 'Procesos automatizados',
        description: 'Reducción significativa en tareas manuales',
        colorIndex: 2
      },
      {
        title: 'Ahorro Anual',
        value: '$430K',
        change: 'Retorno total estimado',
        description: 'Beneficios económicos proyectados',
        colorIndex: 3
      }
    ];
    
    // Grid de métricas 2x2
    const cardWidth = (this.pageWidth - 2 * this.margin - 15) / 2;
    const cardHeight = 38;
    
    metrics.forEach((metric, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const x = this.margin + col * (cardWidth + 15);
      const y = this.currentY + row * (cardHeight + 12);
      const accentColor = FLOWFORGE_COLORS.chartColors[metric.colorIndex];
      
      // Fondo de la métrica con gradiente sutil
      this.setFillColorFromArray(FLOWFORGE_COLORS.background);
      this.pdf.roundedRect(x, y, cardWidth, cardHeight, 10, 10, 'F');
      
      // Borde con color de acento
      this.setDrawColorFromArray(accentColor);
      this.pdf.setLineWidth(1.5);
      this.pdf.roundedRect(x, y, cardWidth, cardHeight, 10, 10, 'S');
      
      // Ícono decorativo con color de acento
      this.setFillColorFromArray(accentColor, 0.15);
      this.pdf.roundedRect(x + 6, y + 6, 28, 26, 6, 6, 'F');
      this.setDrawColorFromArray(accentColor);
      this.pdf.setLineWidth(1);
      this.pdf.roundedRect(x + 6, y + 6, 28, 26, 6, 6, 'S');
      
      // Título
      this.pdf.setFontSize(11);
      this.pdf.setFont('helvetica', 'bold');
      this.setTextColorFromArray(FLOWFORGE_COLORS.textSecondary);
      this.pdf.text(metric.title, x + 40, y + 13);
      
      // Valor principal
      this.pdf.setFontSize(22);
      this.pdf.setFont('helvetica', 'bold');
      this.setTextColorFromArray(FLOWFORGE_COLORS.textPrimary);
      this.pdf.text(metric.value, x + 40, y + 24);
      
      // Cambio/indicador
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'normal');
      this.setTextColorFromArray(accentColor);
      this.pdf.text(metric.change, x + 40, y + 31);
    });
    
    this.currentY += 95;
  }

  // Roadmap avanzado con paleta FlowForge
  private async addAdvancedRoadmapSection(): Promise<void> {
    this.addMainHeading('Hoja de Ruta de Implementación');
    
    const phases = [
      {
        title: 'Automatización',
        duration: 'Meses 1-3',
        status: 'completed' as const,
        progress: 75,
        description: 'Implementación de automatizaciones básicas y configuración inicial'
      },
      {
        title: 'Integración',
        duration: 'Meses 4-6',
        status: 'in-progress' as const,
        progress: 85,
        description: 'Integración de sistemas y optimización de procesos core'
      },
      {
        title: 'Capacitación',
        duration: 'Meses 7-8',
        status: 'planned' as const,
        progress: 90,
        description: 'Formación del equipo y transferencia de conocimiento'
      },
      {
        title: 'Optimización',
        duration: 'Meses 9-10',
        status: 'planned' as const,
        progress: 95,
        description: 'Ajuste fino y optimización continua del sistema'
      }
    ];
    
    // Timeline visual
    const timelineY = this.currentY + 20;
    const totalWidth = this.pageWidth - 2 * this.margin;
    const stepWidth = totalWidth / phases.length;
    
    // Línea principal con gradiente FlowForge
    this.setDrawColorFromArray(FLOWFORGE_COLORS.primary);
    this.pdf.setLineWidth(5);
    this.pdf.line(this.margin, timelineY, this.pageWidth - this.margin, timelineY);
    
    phases.forEach((phase, index) => {
      const x = this.margin + (index * stepWidth) + (stepWidth / 2);
      
      // Color según estado con paleta FlowForge
      let color: [number, number, number];
      switch (phase.status) {
        case 'completed':
          color = [...FLOWFORGE_COLORS.success]; // Verde esmeralda
          break;
        case 'in-progress':
          color = [...FLOWFORGE_COLORS.primary]; // Cyan principal
          break;
        default:
          color = [...FLOWFORGE_COLORS.neutral]; // Gris neutro
      }
      
      // Círculo del hito con mejor diseño
      this.setFillColorFromArray(color);
      this.pdf.circle(x, timelineY, 7, 'F');
      this.setDrawColorFromArray(FLOWFORGE_COLORS.surface);
      this.pdf.setLineWidth(3);
      this.pdf.circle(x, timelineY, 7, 'S');
      
      // Anillo exterior sutil
      this.setDrawColorFromArray(color);
      this.pdf.setLineWidth(1);
      this.pdf.circle(x, timelineY, 9, 'S');
      
      // Título de fase
      this.setTextColorFromArray(FLOWFORGE_COLORS.textPrimary);
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(phase.title, x, timelineY - 22, { align: 'center' });
      
      // Duración
      this.setTextColorFromArray(FLOWFORGE_COLORS.textMuted);
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(phase.duration, x, timelineY + 17, { align: 'center' });
      
      // Progreso con color de estado
      this.setTextColorFromArray(color);
      this.pdf.setFontSize(11);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`${phase.progress}%`, x, timelineY + 28, { align: 'center' });
    });
    
    this.currentY = timelineY + 55;
  }

  // Análisis ROI avanzado
  private async addAdvancedROIAnalysis(): Promise<void> {
    this.addMainHeading('Análisis de Retorno de Inversión (ROI)');
    
    // Datos del ROI
    const roiData = {
      investment: 125000,
      returns: [25000, 75000, 150000, 250000, 430000],
      periods: ['Q1', 'Q2', 'Q3', 'Q4', 'Año 2'],
      breakEven: '8-10 meses'
    };
    
    // Gráfico de barras ROI
    this.createAdvancedROIChart(roiData);
    
    // Tabla de análisis financiero
    this.currentY += 20;
    this.addSubHeading('Desglose Financiero Detallado');
    
    const financialData = [
      ['Concepto', 'Inversión', 'Retorno Año 1', 'Retorno Año 2', 'ROI Total'],
      ['Automatización', '$45K', '$125K', '$180K', '300%'],
      ['Integración', '$35K', '$85K', '$140K', '280%'],
      ['Capacitación', '$25K', '$65K', '$110K', '240%'],
      ['Optimización', '$20K', '$55K', '$95K', '275%'],
      ['TOTAL', '$125K', '$330K', '$525K', '245%']
    ];
    
    this.createFinancialTable(financialData);
  }

  // Crear gráfico ROI avanzado con paleta FlowForge
  private createAdvancedROIChart(roiData: any): void {
    const chartWidth = this.pageWidth - 2 * this.margin;
    const chartHeight = 65;
    const barWidth = (chartWidth - 50) / roiData.periods.length;
    
    // Fondo del gráfico
    this.setFillColorFromArray(FLOWFORGE_COLORS.background);
    this.pdf.roundedRect(this.margin, this.currentY, chartWidth, chartHeight, 10, 10, 'F');
    
    // Borde con color primario
    this.setDrawColorFromArray(FLOWFORGE_COLORS.primary);
    this.pdf.setLineWidth(1.5);
    this.pdf.roundedRect(this.margin, this.currentY, chartWidth, chartHeight, 10, 10, 'S');
    
    // Título del gráfico
    this.pdf.setFontSize(15);
    this.pdf.setFont('helvetica', 'bold');
    this.setTextColorFromArray(FLOWFORGE_COLORS.textPrimary);
    this.pdf.text('Proyección de ROI Acumulativo', this.margin + 12, this.currentY - 5);
    
    const maxValue = Math.max(...roiData.returns);
    const chartStartY = this.currentY + 18;
    
    roiData.returns.forEach((value: number, index: number) => {
      const barHeight = (value / maxValue) * (chartHeight - 35);
      const x = this.margin + 25 + (index * barWidth);
      const y = chartStartY + (chartHeight - 35) - barHeight;
      
      // Usar paleta de colores FlowForge (sin rojo intenso)
      const color = FLOWFORGE_COLORS.chartColors[index % FLOWFORGE_COLORS.chartColors.length];
      
      // Barra con gradiente simulado
      this.setFillColorFromArray(color, 0.9);
      this.pdf.roundedRect(x, y, barWidth - 12, barHeight, 4, 4, 'F');
      
      // Borde sutil
      this.setDrawColorFromArray(color);
      this.pdf.setLineWidth(1);
      this.pdf.roundedRect(x, y, barWidth - 12, barHeight, 4, 4, 'S');
      
      // Etiqueta del período
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.setTextColorFromArray(FLOWFORGE_COLORS.textMuted);
      this.pdf.text(roiData.periods[index], x + (barWidth - 12) / 2, chartStartY + chartHeight - 18, { align: 'center' });
      
      // Valor con color de la barra
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'bold');
      this.setTextColorFromArray(color);
      this.pdf.text(`$${(value / 1000).toFixed(0)}K`, x + (barWidth - 12) / 2, y - 6, { align: 'center' });
    });
    
    this.currentY += chartHeight + 12;
  }

  // Crear tabla financiera con colores FlowForge
  private createFinancialTable(data: string[][]): void {
    const tableWidth = this.pageWidth - 2 * this.margin;
    const colWidth = tableWidth / data[0].length;
    const rowHeight = 13;
    
    data.forEach((row, rowIndex) => {
      const y = this.currentY + (rowIndex * rowHeight);
      
      // Fondo alternado
      if (rowIndex % 2 === 0) {
        this.setFillColorFromArray(FLOWFORGE_COLORS.background);
        this.pdf.rect(this.margin, y - 2, tableWidth, rowHeight, 'F');
      }
      
      // Header row con color FlowForge
      if (rowIndex === 0) {
        this.setFillColorFromArray(FLOWFORGE_COLORS.primary, 0.12);
        this.pdf.rect(this.margin, y - 2, tableWidth, rowHeight, 'F');
      }
      
      // Fila total con color especial
      if (rowIndex === data.length - 1) {
        this.setFillColorFromArray(FLOWFORGE_COLORS.accent, 0.08);
        this.pdf.rect(this.margin, y - 2, tableWidth, rowHeight, 'F');
      }
      
      row.forEach((cell, colIndex) => {
        const x = this.margin + (colIndex * colWidth);
        
        // Estilo del texto
        if (rowIndex === 0) {
          this.pdf.setFont('helvetica', 'bold');
          this.setTextColorFromArray(FLOWFORGE_COLORS.textPrimary);
          this.pdf.setFontSize(11);
        } else if (rowIndex === data.length - 1) {
          this.pdf.setFont('helvetica', 'bold');
          this.setTextColorFromArray(FLOWFORGE_COLORS.textPrimary);
          this.pdf.setFontSize(10);
        } else {
          this.pdf.setFont('helvetica', 'normal');
          this.setTextColorFromArray(FLOWFORGE_COLORS.textSecondary);
          this.pdf.setFontSize(10);
        }
        
        this.pdf.text(cell, x + 6, y + 7);
      });
    });
    
    // Bordes de la tabla con color FlowForge
    this.setDrawColorFromArray(FLOWFORGE_COLORS.neutral);
    this.pdf.setLineWidth(0.5);
    
    // Líneas horizontales
    for (let i = 0; i <= data.length; i++) {
      const y = this.currentY + (i * rowHeight) - 2;
      this.pdf.line(this.margin, y, this.margin + tableWidth, y);
    }
    
    // Líneas verticales
    for (let i = 0; i <= data[0].length; i++) {
      const x = this.margin + (i * colWidth);
      this.pdf.line(x, this.currentY - 2, x, this.currentY + (data.length * rowHeight) - 2);
    }
    
    this.currentY += (data.length * rowHeight) + 12;
  }

  // Agregar pie de página SIN marca de agua
  private addFooterToAllPages(options: PDFGenerationOptions): void {
    const totalPages = this.pdf.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i);
      
      // Línea superior del pie de página
      this.pdf.setDrawColor(220, 220, 220);
      this.pdf.setLineWidth(0.5);
      this.pdf.line(this.margin, this.pageHeight - 25, this.pageWidth - this.margin, this.pageHeight - 25);
      
      // Texto del pie de página
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(120, 120, 120);
      
      // Lado izquierdo
      this.pdf.text('FlowForge AI - Consultoría Digital Inteligente', this.margin, this.pageHeight - 15);
      
      // Centro
      const date = options.date || new Date().toLocaleDateString('es-ES');
      this.pdf.text(date, this.pageWidth / 2, this.pageHeight - 15, { align: 'center' });
      
      // Lado derecho
      this.pdf.text(`Página ${i} de ${totalPages}`, this.pageWidth - this.margin, this.pageHeight - 15, { align: 'right' });
      
      // NO agregar marca de agua - eliminada completamente
    }
  }
}

// Función helper mejorada
export async function generateReportPDF(
  reportContent: string,
  moduleTitle: string,
  userProfile?: any
): Promise<void> {
  const generator = new PDFGenerator();
  
  const options: PDFGenerationOptions = {
    title: moduleTitle,
    subtitle: 'Análisis Estratégico y Recomendaciones Profesionales',
    author: 'FlowForge AI',
    company: userProfile ? `${userProfile.businessType || userProfile.business_type} - ${userProfile.businessStage || userProfile.business_stage}` : 'Consultoría Digital',
    date: new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    includeCharts: true,
    includeMetrics: true,
    // watermark eliminada completamente
    userProfile: userProfile,
    moduleType: moduleTitle
  };
  
  await generator.generateReportPDF(reportContent, options);
}