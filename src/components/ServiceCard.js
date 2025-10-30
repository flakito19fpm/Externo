import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, CheckCircle2, Clock, User } from 'lucide-react';

const statusColors = {
  'Pendiente': 'from-yellow-400 to-amber-500',
  'En Proceso': 'from-blue-400 to-indigo-500',
  'Completado': 'from-green-400 to-emerald-500'
};

const ServiceCard = ({ service = {}, onClick = () => {} }) => {
  const color = statusColors[service.status] || 'from-gray-400 to-gray-500';

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <div className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center opacity-10`} />
      
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 bg-gradient-to-br ${color} rounded-2xl flex-shrink-0`}>
          <Wrench className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-brown-800 text-lg">{service.description}</h3>
          <p className="text-sm text-gray-600 mt-1">Equipo: {service.equipmentName || 'Molino/Cafetera'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">{service.technician}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">{service.estimatedCompletion}</span>
        </div>
      </div>

      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${color} text-white`}>
        <CheckCircle2 className="w-4 h-4" />
        {service.status}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
    </motion.div>
  );
};

export default ServiceCard;