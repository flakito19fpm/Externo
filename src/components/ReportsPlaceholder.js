import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, BarChart3 } from 'lucide-react';

const ReportsPlaceholder = () => {
  return (
    <motion.div 
      className="py-8 bg-gradient-to-br from-brown-50 via-amber-50 to-cream-50 min-h-screen flex items-center justify-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-md">
        <FileText className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brown-800 mb-4">Reportes en Desarrollo</h2>
        <p className="text-gray-600 mb-6">Pronto generarás informes de ingresos por visitas (¡ese cobro extra!), mantenimientos y reparaciones – con gráficos de Jonathan y Carlos.</p>
        <BarChart3 className="w-8 h-8 text-amber-600 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Mientras, agrega visitas y servicios para acumular datos ☕</p>
      </div>
    </motion.div>
  );
};

export default ReportsPlaceholder;