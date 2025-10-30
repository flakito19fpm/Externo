import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar } from 'lucide-react';

const ReportViewer = ({ reports = [], onDownload = () => {} }) => {
  return (
    <motion.div 
      className="py-8 bg-gradient-to-br from-brown-50 via-amber-50 to-cream-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.h2 
          className="text-3xl font-bold bg-gradient-to-r from-orange-700 to-brown-600 bg-clip-text text-transparent mb-8 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Reportes Mensuales
        </motion.h2>
        
        <div className="space-y-6">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300 relative"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brown-800">{report.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {report.date}
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={() => onDownload(report.id)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  Descargar
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-amber-50 rounded-2xl">
                  <p className="text-2xl font-bold text-amber-700">{report.servicesCompleted}</p>
                  <p className="text-sm text-gray-600">Servicios Completados</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl">
                  <p className="text-2xl font-bold text-emerald-700">{report.totalRevenue}</p>
                  <p className="text-sm text-gray-600">Ingresos Totales</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <p className="text-lg font-semibold text-blue-700">Ver Detalles</p>
                  <p className="text-sm text-gray-600">Resumen completo</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ReportViewer;