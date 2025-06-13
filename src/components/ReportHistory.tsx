import React, { useState, useEffect } from 'react';
import { Clock, FileText, Trash2, Eye, Download, Filter, Search } from 'lucide-react';
import { AIReport } from '../types/database';
import { AIReportService } from '../services/aiReportService';
import { businessModules } from '../data/modules';

interface ReportHistoryProps {
  onSelectReport: (report: AIReport) => void;
  onClose: () => void;
}

const ReportHistory: React.FC<ReportHistoryProps> = ({ onSelectReport, onClose }) => {
  const [reports, setReports] = useState<AIReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<AIReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, selectedModule]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const userReports = await AIReportService.getUserReports();
      setReports(userReports);
    } catch (err) {
      setError('Error al cargar el historial de reportes');
      console.error('Error loading reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = reports;

    // Filtrar por módulo
    if (selectedModule !== 'all') {
      filtered = filtered.filter(report => report.module_id === selectedModule);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.user_input.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
      return;
    }

    try {
      await AIReportService.deleteReport(reportId);
      setReports(reports.filter(r => r.id !== reportId));
    } catch (err) {
      setError('Error al eliminar el reporte');
      console.error('Error deleting report:', err);
    }
  };

  const handleDownloadReport = (report: AIReport) => {
    const blob = new Blob([report.report_content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${report.module_name.toLowerCase().replace(/\s+/g, '-')}-${new Date(report.created_at).toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getModuleIcon = (moduleId: string) => {
    const module = businessModules.find(m => m.id === moduleId);
    return module?.icon || 'FileText';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="liquid-loader w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Header */}
      <div className="liquid-card bg-gradient-to-r from-iridescent-blue/20 to-iridescent-violet/20 p-6 mb-6 border border-iridescent-blue/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-iridescent-blue via-iridescent-violet to-iridescent-cyan"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-iridescent-blue/30 to-iridescent-violet/30 mr-4 liquid-glow-hover organic-shape">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Historial de Reportes</h2>
              <p className="text-gray-300">
                {reports.length} reporte{reports.length !== 1 ? 's' : ''} generado{reports.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-liquid-surface/30 hover:bg-liquid-surface/50 rounded-2xl transition-all duration-300 liquid-button border border-liquid-border hover:border-iridescent-blue/30 text-gray-300 hover:text-white"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="liquid-card bg-liquid-surface/40 p-6 mb-6 border border-liquid-border">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar en reportes..."
                className="w-full pl-10 pr-4 py-3 bg-liquid-surface/30 border border-liquid-border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-iridescent-blue/50 transition-all duration-300 liquid-button"
              />
            </div>
          </div>

          {/* Module Filter */}
          <div className="lg:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-liquid-surface/30 border border-liquid-border rounded-2xl text-white focus:outline-none focus:border-iridescent-blue/50 transition-all duration-300 liquid-button appearance-none"
              >
                <option value="all">Todos los módulos</option>
                {businessModules.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="liquid-card bg-red-900/20 border border-red-500/30 p-4 rounded-2xl mb-6">
          <p className="text-red-300 font-medium">{error}</p>
        </div>
      )}

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="liquid-card bg-liquid-surface/40 p-12 text-center border border-liquid-border">
          <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            {reports.length === 0 ? 'No hay reportes aún' : 'No se encontraron reportes'}
          </h3>
          <p className="text-gray-500">
            {reports.length === 0 
              ? 'Genera tu primer reporte usando uno de los módulos de consultoría'
              : 'Intenta ajustar los filtros de búsqueda'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="liquid-card bg-liquid-surface/40 p-6 border border-liquid-border hover:border-iridescent-blue/30 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-iridescent-blue/20 to-iridescent-violet/20 mr-3 organic-shape">
                      <FileText className="h-5 w-5 text-iridescent-cyan" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-iridescent-cyan transition-colors">
                        {report.module_name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {formatDate(report.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {report.user_input}
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => onSelectReport(report)}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-iridescent-blue/20 to-iridescent-violet/20 hover:from-iridescent-blue/30 hover:to-iridescent-violet/30 rounded-xl transition-all duration-300 liquid-button text-sm font-medium text-white border border-iridescent-blue/30"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Reporte
                    </button>
                    
                    <button
                      onClick={() => handleDownloadReport(report)}
                      className="inline-flex items-center px-4 py-2 bg-liquid-surface/30 hover:bg-liquid-surface/50 rounded-xl transition-all duration-300 liquid-button text-sm font-medium text-gray-300 hover:text-white border border-liquid-border hover:border-iridescent-cyan/30"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteReport(report.id)}
                  className="p-2 rounded-xl hover:bg-red-500/20 transition-all duration-300 liquid-button text-gray-400 hover:text-red-400 border border-transparent hover:border-red-500/30"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportHistory;