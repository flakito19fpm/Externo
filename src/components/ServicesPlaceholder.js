import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Coffee } from 'lucide-react';

const ServicesPlaceholder = () => {
  return (
    <motion.div 
      className="py-8 bg-gradient-to-br from-orange-50 via-brown-50 to-amber-50 min-h-screen flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center max-w-md">
        <Settings className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brown-800 mb-4">Servicios Próximamente</h2>
        <p className="text-gray-600 mb-6">Esta sección se expandirá con el manejo de reparaciones una vez que tengas clientes y equipos.</p>
        <Coffee className="w-8 h-8 text-amber-600 mx-auto mb-4" />
        <p className="text-sm text-gray-500">Por ahora, enfócate en registrar tu taller.</p>
      </div>
    </motion.div>
  );
};

export default ServicesPlaceholder;