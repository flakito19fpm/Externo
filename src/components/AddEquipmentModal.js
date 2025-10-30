import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coffee, Tag, Settings, AlertCircle, MessageCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

const AddEquipmentModal = ({ isOpen, onClose, clientId, onAddEquipment }) => {
  const [formData, setFormData] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    serie: '',
    estado: '',
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);
  const [serieExists, setSerieExists] = useState(false);
  const [checkingSerie, setCheckingSerie] = useState(false);

  const tipos = ['Cafetera', 'Molino'];
  const estados = ['Activo', 'En Reparación', 'En Almacén', 'Desecho'];

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'serie' && value.trim().length >= 3) {
      setCheckingSerie(true);
      try {
        const { data } = await supabase
          .from('equipos')
          .select('id')
          .eq('serie', value.trim())
          .maybeSingle();
        setSerieExists(!!data);
      } catch (err) {
        console.error('Error checking serie:', err);
        setSerieExists(false);
      } finally {
        setCheckingSerie(false);
      }
    } else if (name === 'serie') {
      setSerieExists(false);
      setCheckingSerie(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tipo || !formData.marca || !formData.modelo || !formData.serie || !formData.estado) {
      alert('¡Completa todos los campos para el equipo!');
      return;
    }
    
    if (serieExists) {
      alert(`¡La serie "${formData.serie}" ya está en otro equipo! Elige una única o chequea en Supabase.`);
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('equipos')
        .insert({
          cliente_id: clientId,
          tipo: formData.tipo,
          marca: formData.marca.trim(),
          modelo: formData.modelo.trim(),
          serie: formData.serie.trim(),
          estado: formData.estado,
          observaciones: formData.observaciones.trim() || null
        })
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') {
          alert(`¡Serie duplicada confirmada! "${formData.serie}" ya existe. Resuélvelo en Table Editor de Supabase.`);
        } else {
          alert('Error agregando equipo: ' + error.message);
        }
      } else {
        onAddEquipment(data);
        onClose();
        setFormData({ tipo: '', marca: '', modelo: '', serie: '', estado: '', observaciones: '' });
        setSerieExists(false);
      }
    } catch (err) {
      alert('Error inesperado al guardar: ' + err.message);
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
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-200/50 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-amber-700 to-brown-600 bg-clip-text text-transparent flex items-center gap-2">
              <Coffee className="w-5 h-5" />
              Nuevo Equipo
            </h3>
            <motion.button
              onClick={onClose}
              className="p-1.5 hover:bg-amber-100 rounded-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-gray-500" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                <Coffee className="w-4 h-4" />
                Tipo *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800"
                required
              >
                <option value="">Selecciona tipo</option>
                {tipos.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Marca *
              </label>
              <input
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                placeholder="Ej: Nespresso"
                className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800 placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Modelo *
              </label>
              <input
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                placeholder="Ej: Vertuo Next"
                className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800 placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Serie * (Única)
              </label>
              <input
                name="serie"
                value={formData.serie}
                onChange={handleChange}
                placeholder="Ej: SN123456 (debe ser única en todo el taller)"
                className={`w-full px-3 py-2.5 bg-amber-50 border rounded-xl focus:ring-2 focus:border-transparent text-brown-800 placeholder-gray-500 transition-all duration-200 ${
                  checkingSerie ? 'border-blue-300 focus:ring-blue-400' :
                  serieExists ? 'border-red-300 focus:ring-red-400 ring-2 ring-red-200 bg-red-50/50' : 'border-amber-200 focus:ring-amber-400'
                }`}
                required
              />
              {checkingSerie && (
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1 animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  Verificando si la serie es única...
                </p>
              )}
              {serieExists && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  ¡Serie ya registrada! Elige otra o resuélvelo en Supabase.
                </p>
              )}
              {!serieExists && formData.serie.trim().length >= 3 && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Serie única – perfecta para guardar.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Estado *
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800"
                required
              >
                <option value="">Selecciona estado</option>
                {estados.map(estado => <option key={estado} value={estado}>{estado}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Observaciones (opcional)
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                placeholder="Ej: Requiere visita inicial, o notas de mantenimiento previo"
                rows={3}
                className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800 placeholder-gray-500 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-3">
              <motion.button
                type="submit"
                disabled={loading || serieExists || checkingSerie}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <>
                    <AlertCircle className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Coffee className="w-4 h-4" />
                    Agregar Equipo
                  </>
                )}
              </motion.button>
              <motion.button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
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

export default AddEquipmentModal;