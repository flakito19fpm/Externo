import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Search, Calendar } from 'lucide-react';
import { mockReports } from '../mock/data';

const Reports = () => {
  const [reports] = useState(mockReports);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (reportId) => {
    alert(`Descargando reporte ${reportId}... (Función simulada)`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FileText className="w-8 h-8 text-blue-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Generador de Reportes</h2>
        </div>
        <button className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
          <Calendar className="w-5 h-5 mr-2" />
          Generar Nuevo
        </button>
      </div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar reportes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{report.title}</h3>
                <p className="text-gray-600 mb-2">Fecha: {report.date}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <p>Servicios: {report.servicesCompleted}</p>
                  <span className="mx-4">•</span>
                  <p>Ingresos: {report.totalRevenue}</p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(report.id)}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Descargar
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {filteredReports.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay reportes</h3>
          <p className="text-gray-500">Genera tu primer reporte.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Reports;