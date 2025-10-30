import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Building, User, Plus } from 'lucide-react';
import { supabase } from '../utils/supabase';

const AddClientModal = ({ isOpen, onClose, onAddClient }) => {
  const [formData, setFormData] = useState({
    sucursal: '',
    nombreCliente: '',
    telefono: '',
    direccion: '',
    zona: '',
    zonaPersonalizada: ''
  });
  const [showZonaPersonalizada, setShowZonaPersonalizada] = useState(false);
  const [loading, setLoading] = useState(false);

  const zonas = ['Tulum', 'Cancun', 'Playa del Carmen', 'Cozumel', 'Merida', 'Otro'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'zona' && value !== 'Otro') {
      setShowZonaPersonalizada(false);
      setFormData(prev => ({ ...prev, zonaPersonalizada: '' }));
    }
  };

  const handleZonaChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, zona: value }));
    setShowZonaPersonalizada(value === 'Otro');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sucursal || !formData.nombreCliente || !formData.telefono || (!formData.zona && !formData.zonaPersonalizada)) {
      alert('¡Completa los campos obligatorios para el nuevo cliente!');
      return;
    }
    
    setLoading(true);
    const zonaFinal = formData.zona === 'Otro' ? formData.zonaPersonalizada : formData.zona;
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert({
          sucursal: formData.sucursal.trim(),
          nombre_cliente: formData.nombreCliente.trim(),
          telefono: formData.telefono.trim(),
          direccion: formData.direccion.trim() || null,
          zona: zonaFinal.trim()
        })
        .select()
        .single();
      
      if (error) {
        alert('Error creando cliente: ' + error.message);
      } else {
        onAddClient(data);
        onClose();
        setFormData({ sucursal: '', nombreCliente: '', telefono: '', direccion: '', zona: '', zonaPersonalizada: '' });
        setShowZonaPersonalizada(false);
      }
    } catch (err) {
      alert('Error inesperado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-200/50 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-brown-600 bg-clip-text text-transparent flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Nuevo Cliente
            </h3>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-amber-100 rounded-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-gray-500" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-brown-700 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Sucursal *
              </label>
              <input
                name="sucursal"
                value={formData.sucursal}
                onChange={handleChange}
                placeholder="Ej: Café Maya"
                className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-brown-800 placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Cliente *
              </label>
              <input
                name="nombreCliente"
                value={formData.nombreCliente}
                onChange={handleChange}
                placeholder="Ej: Ana López"
                className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-brown-800 placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: +52 984 123 4567"
                className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-brown-800 placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Dirección (opcional)
              </label>
              <input
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ej: Calle Tulum 45"
                className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-brown-800 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-700 mb-2">Zona *</label>
              <select
                name="zona"
                value={formData.zona}
                onChange={handleZonaChange}
                className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-brown-800"
                required
              >
                <option value="">Elige zona</option>
                {zonas.map(zona => <option key={zona} value={zona}>{zona}</option>)}
              </select>
              <AnimatePresence>
                {showZonaPersonalizada && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    name="zonaPersonalizada"
                    value={formData.zonaPersonalizada}
                    onChange={handleChange}
                    placeholder="Nueva zona (ej: Valladolid)"
                    className="w-full px-4 py-3 mt-2 bg-amber-50 border border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-400 text-brown-800 placeholder-gray-500"
                    required
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <User className="w-5 h-5" />
                )}
                {loading ? 'Guardando...' : 'Guardar Cliente'}
              </motion.button>
              <motion.button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancelar
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddClientModal;