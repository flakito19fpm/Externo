import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Settings, MessageCircle, Plus, Wrench, Calendar, AlertTriangle, Eye, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';
import { supabase } from '../utils/supabase';

const AddServiceModal = ({ isOpen, onClose, clients, equipments, onAddService, initialTipo = 'Reparacion', isVisitaMode = false }) => {
  const [formData, setFormData] = useState({
    clienteId: '',
    equipoId: '',
    tipo: initialTipo,
    descripcion: '',
    zonaVisita: '',
    observacionesVisita: '',
    estado: 'Pendiente',
    tecnico: '',
    fechaVisita: '',
    cobro: 0,
    estimatedCompletion: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  
  // Checklists por tipo
  const [checklists, setChecklists] = useState({
    preventivo: {
      cambioEmpaques: false,
      limpiezaDuchas: false,
      cambioValvula: false,
      limpiezaElectrovalvulas: false,
      limpiezaChasis: false,
      recalibracionPresostato: false,
      recalibracionBomba: false,
      lavadoManguera: false,
      lavadoEspreas: false,
      limpiezaSonda: false,
      limpiezaExterior: false,
      engrasadoLlaves: false
    },
    general: {
      descalcificacion: false,
      pulidoCaldera: false,
      cambioEmpaques: false,
      cambioDuchas: false,
      cambioValvula: false,
      limpiezaElectrovalvulas: false,
      limpiezaChasis: false,
      recalibracionPresostato: false,
      recalibracionBomba: false,
      cambioMangueraEntrada: false,
      cambioMangueraDesague: false,
      cambioEspreas: false
    },
    reconstruccion: {
      descalcificacion: false,
      pulidoCaldera: false,
      cambioEmpaques: false,
      cambioDuchas: false,
      cambioValvula: false,
      limpiezaElectrovalvulas: false,
      limpiezaChasis: false,
      recalibracionPresostato: false,
      recalibracionBomba: false,
      cambioMangueraEntrada: false,
      cambioMangueraDesague: false,
      cambioEspreas: false,
      resanadoChasis: false,
      pinturaChasis: false,
      pinturaPaneles: false
    }
  });

  const tipos = ['Mantenimiento preventivo', 'Mantenimiento General', 'Reconstruccion', 'Reparacion', 'Visita'];
  const tecnicos = ['Jonathan Quintal', 'Carlos Valencia'];
  const estados = ['Pendiente', 'En Proceso', 'Completado'];
  const zonasVisita = ['PDC', 'Exterior'];
  const IVA_RATE = 0.16;

  // Tareas del checklist para Mantenimiento preventivo
  const preventivoTareas = [
    { id: 'cambioEmpaques', label: 'Cambio de empaques: grupos, electroválvulas y llaves de vapor.' },
    { id: 'limpiezaDuchas', label: 'Limpieza de duchas.' },
    { id: 'cambioValvula', label: 'Cambio de válvula antiremolino (de alivio).' },
    { id: 'limpiezaElectrovalvulas', label: 'Limpieza de electrovalvulas.' },
    { id: 'limpiezaChasis', label: 'Limpieza de chasis.' },
    { id: 'recalibracionPresostato', label: 'Recalibración de presostato.' },
    { id: 'recalibracionBomba', label: 'Recalibración de bomba.' },
    { id: 'lavadoManguera', label: 'Lavado de manguera de desague.' },
    { id: 'lavadoEspreas', label: 'Lavado de espreas de grupo.' },
    { id: 'limpiezaSonda', label: 'Limpieza de sonda de nivel.' },
    { id: 'limpiezaExterior', label: 'Limpieza exterior.' },
    { id: 'engrasadoLlaves', label: 'Engrasado de llaves en general.' }
  ];

  // Tareas del checklist para Mantenimiento General
  const generalTareas = [
    { id: 'descalcificacion', label: 'Descalcificación de Caldera y tuberías en general (desmonte de toda la máquina).' },
    { id: 'pulidoCaldera', label: 'Pulido de caldera y tuberías.' },
    { id: 'cambioEmpaques', label: 'Cambio de empaques: grupos, electroválvulas, lancetas, grifo de agua y bloque de válvulas.' },
    { id: 'cambioDuchas', label: 'Cambio de duchas.' },
    { id: 'cambioValvula', label: 'Cambio de válvula antiremolino (de alivio).' },
    { id: 'limpiezaElectrovalvulas', label: 'Limpieza de electroválvulas.' },
    { id: 'limpiezaChasis', label: 'Limpieza profunda de chasis.' },
    { id: 'recalibracionPresostato', label: 'Recalibración de presostato.' },
    { id: 'recalibracionBomba', label: 'Recalibración de bomba.' },
    { id: 'cambioMangueraEntrada', label: 'Cambio de manguera de entrada de agua.' },
    { id: 'cambioMangueraDesague', label: 'Cambio de manguera de desague.' },
    { id: 'cambioEspreas', label: 'Cambio de espreas de grupo.' }
  ];

  // Tareas del checklist para Reconstrucción
  const reconstruccionTareas = [
    { id: 'descalcificacion', label: 'Descalcificación de Caldera y tuberías en general (desmonte de toda la máquina).' },
    { id: 'pulidoCaldera', label: 'Pulido de caldera y tuberías.' },
    { id: 'cambioEmpaques', label: 'Cambio de empaques: grupos, electroválvulas, lancetas, grifo de agua y bloque de válvulas.' },
    { id: 'cambioDuchas', label: 'Cambio de duchas.' },
    { id: 'cambioValvula', label: 'Cambio de válvula antiremolino (de alivio).' },
    { id: 'limpiezaElectrovalvulas', label: 'Limpieza de electroválvulas.' },
    { id: 'limpiezaChasis', label: 'Limpieza profunda de chasis.' },
    { id: 'recalibracionPresostato', label: 'Recalibración de presostato.' },
    { id: 'recalibracionBomba', label: 'Recalibración de bomba.' },
    { id: 'cambioMangueraEntrada', label: 'Cambio de manguera de entrada de agua.' },
    { id: 'cambioMangueraDesague', label: 'Cambio de manguera de desague.' },
    { id: 'cambioEspreas', label: 'Cambio de espreas de grupo.' },
    { id: 'resanadoChasis', label: 'Resanado de chasis y paneles.' },
    { id: 'pinturaChasis', label: 'Pintura de todo el chasis.' },
    { id: 'pinturaPaneles', label: 'Pintura de paneles laterales.' }
  ];

  useEffect(() => {
    const defaultCobro = isVisitaMode ? 0 : 0;
    setFormData(prev => ({
      ...prev,
      tipo: initialTipo,
      estado: isVisitaMode ? 'Completado' : 'Pendiente',
      descripcion: isVisitaMode ? '' : '',
      observacionesVisita: isVisitaMode ? '' : '',
      zonaVisita: isVisitaMode ? '' : '',
      fechaVisita: isVisitaMode ? new Date().toISOString().split('T')[0] : '',
      cobro: defaultCobro
    }));
    
    // Reset checklists inicial
    const reset = {
      preventivo: Object.fromEntries(preventivoTareas.map(t => [t.id, false])),
      general: Object.fromEntries(generalTareas.map(t => [t.id, false])),
      reconstruccion: Object.fromEntries(reconstruccionTareas.map(t => [t.id, false]))
    };
    if (initialTipo === 'Mantenimiento preventivo') {
      reset.preventivo = Object.fromEntries(preventivoTareas.map(t => [t.id, false]));
    } else if (initialTipo === 'Mantenimiento General') {
      reset.general = Object.fromEntries(generalTareas.map(t => [t.id, false]));
    } else if (initialTipo === 'Reconstruccion') {
      reset.reconstruccion = Object.fromEntries(reconstruccionTareas.map(t => [t.id, false]));
    }
    setChecklists({
      preventivo: reset.preventivo,
      general: reset.general,
      reconstruccion: reset.reconstruccion
    });
  }, [initialTipo, isVisitaMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (isVisitaMode && name === 'zonaVisita') {
      const base = value === 'PDC' ? 550 : 950;
      const ivaAmount = base * IVA_RATE;
      const total = base + ivaAmount;
      setFormData(prev => ({ ...prev, cobro: total.toFixed(2) }));
    }

    // Reset checklists basado en nuevo tipo (solo si no es visita)
    if (!isVisitaMode && name === 'tipo') {
      const newTipo = value;
      const allChecklists = {
        preventivo: Object.fromEntries(preventivoTareas.map(t => [t.id, false])),
        general: Object.fromEntries(generalTareas.map(t => [t.id, false])),
        reconstruccion: Object.fromEntries(reconstruccionTareas.map(t => [t.id, false]))
      };
      setChecklists(allChecklists);
    }
  };

  const handleChecklistChange = (e, tipoChecklist) => {
    const { name, checked } = e.target;
    setChecklists(prev => ({
      ...prev,
      [tipoChecklist]: {
        ...prev[tipoChecklist],
        [name]: checked
      }
    }));
  };

  const getChecklistText = (tipo) => {
    let tareas = [];
    let numCompleted = 0;
    let totalTasks = 0;
    let progress = 0;

    if (tipo === 'preventivo') {
      tareas = preventivoTareas;
      const selected = Object.entries(checklists.preventivo).filter(([key, value]) => value === true).map(([key]) => {
        const tarea = tareas.find(t => t.id === key);
        return `- ${tarea ? tarea.label : key} ✓`;
      });
      numCompleted = selected.length;
      totalTasks = tareas.length;
      progress = Math.round((numCompleted / totalTasks) * 100);
      return selected.length > 0 ? `Checklist Mantenimiento Preventivo (${numCompleted}/${totalTasks} - ${progress}% completado):\n${selected.join('\n')}` : 'Checklist Mantenimiento Preventivo pendiente.';
    } else if (tipo === 'general') {
      tareas = generalTareas;
      const selected = Object.entries(checklists.general).filter(([key, value]) => value === true).map(([key]) => {
        const tarea = tareas.find(t => t.id === key);
        return `- ${tarea ? tarea.label : key} ✓`;
      });
      numCompleted = selected.length;
      totalTasks = tareas.length;
      progress = Math.round((numCompleted / totalTasks) * 100);
      return selected.length > 0 ? `Checklist Mantenimiento General (${numCompleted}/${totalTasks} - ${progress}% completado):\n${selected.join('\n')}` : 'Checklist Mantenimiento General pendiente.';
    } else if (tipo === 'reconstruccion') {
      tareas = reconstruccionTareas;
      const selected = Object.entries(checklists.reconstruccion).filter(([key, value]) => value === true).map(([key]) => {
        const tarea = tareas.find(t => t.id === key);
        return `- ${tarea ? tarea.label : key} ✓`;
      });
      numCompleted = selected.length;
      totalTasks = tareas.length;
      progress = Math.round((numCompleted / totalTasks) * 100);
      return selected.length > 0 ? `Checklist Reconstrucción (${numCompleted}/${totalTasks} - ${progress}% completado):\n${selected.join('\n')}` : 'Checklist Reconstrucción pendiente.';
    }
    return '';
  };

  const getCobroBreakdown = () => {
    if (!isVisitaMode || formData.zonaVisita === '') return '';
    const base = formData.zonaVisita === 'PDC' ? 550 : 950;
    const ivaAmount = base * IVA_RATE;
    return `Base $${base} + IVA 16% ($${ivaAmount.toFixed(0)}) = Total $${formData.cobro}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isVisitaMode) {
      if (!formData.clienteId || !formData.zonaVisita || !formData.observacionesVisita || !formData.tecnico || !formData.fechaVisita || formData.cobro <= 0) {
        alert('¡Para visita, completa todos los campos obligatorios!');
        return;
      }
    } else {
      if (!formData.clienteId || !formData.equipoId || !formData.tecnico || !formData.tipo || !formData.descripcion) {
        alert('¡Completa todos los campos obligatorios para el servicio!');
        return;
      }
    }
    
    setLoading(true);
    try {
      let insertData = {
        cliente_id: formData.clienteId,
        estado: formData.estado,
        tecnico: formData.tecnico,
        cobro: formData.cobro || 0
      };

      if (isVisitaMode) {
        insertData.tipo = 'Visita';
        insertData.descripcion = formData.observacionesVisita.trim() || 'Inspección de visita';
        insertData.assigned_date = formData.fechaVisita ? new Date(formData.fechaVisita).toISOString() : new Date().toISOString();
        insertData.notes = `Zona: ${formData.zonaVisita}. ${getCobroBreakdown()}`.trim();
        insertData.estimated_completion = null; // Visitas no necesitan estimado
      } else {
        insertData.equipo_id = formData.equipoId;
        insertData.tipo = formData.tipo;
        insertData.descripcion = formData.descripcion.trim();
        insertData.estimated_completion = formData.estimatedCompletion ? new Date(formData.estimatedCompletion).toISOString() : null;
        // Agregar checklist a notes basado en tipo
        const checklistType = formData.tipo === 'Mantenimiento preventivo' ? 'preventivo' : formData.tipo === 'Mantenimiento General' ? 'general' : formData.tipo === 'Reconstruccion' ? 'reconstruccion' : null;
        let additionalNotes = formData.notes ? formData.notes + '\n\n' : '';
        if (checklistType) {
          additionalNotes += getChecklistText(checklistType);
        }
        insertData.notes = additionalNotes.trim();
      }

      const { data, error } = await supabase
        .from('servicios')
        .insert(insertData)
        .select();
      
      if (error) {
        alert(`Error creando ${isVisitaMode ? 'visita' : 'servicio'}: ` + error.message);
      } else {
        onAddService();
        onClose();
        setFormData({
          clienteId: '',
          equipoId: '',
          tipo: 'Reparacion',
          descripcion: '',
          zonaVisita: '',
          observacionesVisita: '',
          estado: 'Pendiente',
          tecnico: '',
          fechaVisita: '',
          cobro: 0,
          estimatedCompletion: '',
          notes: ''
        });
        // Reset all checklists
        setChecklists({
          preventivo: Object.fromEntries(preventivoTareas.map(t => [t.id, false])),
          general: Object.fromEntries(generalTareas.map(t => [t.id, false])),
          reconstruccion: Object.fromEntries(reconstruccionTareas.map(t => [t.id, false]))
        });
      }
    } catch (err) {
      alert('Error inesperado al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredEquipments = equipments.filter(eq => eq.cliente_id === formData.clienteId);
  const isVisita = formData.tipo === 'Visita' || isVisitaMode;
  const showChecklist = !isVisita && (formData.tipo === 'Mantenimiento preventivo' || formData.tipo === 'Mantenimiento General' || formData.tipo === 'Reconstruccion');
  const currentChecklistType = formData.tipo === 'Mantenimiento preventivo' ? 'preventivo' : formData.tipo === 'Mantenimiento General' ? 'general' : formData.tipo === 'Reconstruccion' ? 'reconstruccion' : null;

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
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-amber-200/50 relative overflow-y-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-amber-700 to-brown-600 bg-clip-text text-transparent flex items-center gap-2">
              {isVisita ? <Eye className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
              {currentChecklistType ? `${currentChecklistType.charAt(0).toUpperCase() + currentChecklistType.slice(1)} (Checklist)` : (isVisita ? 'Nueva Visita (Cobro Auto)' : 'Nuevo Servicio')}
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
            {/* Cliente común */}
            <div>
              <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                <User className="w-4 h-4" />
                Cliente *
              </label>
              <select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800"
                required
              >
                <option value="">Selecciona cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.sucursal} - {client.nombre_cliente} ({client.zona})</option>
                ))}
              </select>
            </div>

            {isVisita ? (
              // Modo Visita - Campos específicos (sin cambios recientes)
              <>
                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Zona de Visita *
                  </label>
                  <select
                    name="zonaVisita"
                    value={formData.zonaVisita}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800"
                    required
                  >
                    <option value="">Elige zona (calcula cobro auto)</option>
                    {zonasVisita.map(zona => <option key={zona} value={zona}>{zona}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Equipo (opcional para visita general)
                  </label>
                  <select
                    name="equipoId"
                    value={formData.equipoId}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800"
                    disabled={!formData.clienteId}
                  >
                    <option value="">Inspección general</option>
                    {filteredEquipments.map(equip => (
                      <option key={equip.id} value={equip.id}>
                        {equip.tipo}: {equip.marca} {equip.modelo} (Serie: {equip.serie})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Observaciones de la Visita *
                  </label>
                  <textarea
                    name="observacionesVisita"
                    value={formData.observacionesVisita}
                    onChange={handleChange}
                    placeholder="Ej: Inspección en sitio, diagnóstico de equipo, cotización verbal al cliente"
                    rows={4}
                    className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800 placeholder-gray-500 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Técnico *
                  </label>
                  <select
                    name="tecnico"
                    value={formData.tecnico}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800"
                    required
                  >
                    <option value="">Elige técnico</option>
                    {tecnicos.map(tecnico => <option key={tecnico} value={tecnico}>{tecnico}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fecha de Visita *
                  </label>
                  <input
                    type="date"
                    name="fechaVisita"
                    value={formData.fechaVisita}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Cobro Total (Auto calculado) *
                  </label>
                  <input
                    type="number"
                    name="cobro"
                    value={formData.cobro}
                    readOnly
                    className="w-full px-3 py-2.5 bg-amber-100 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800 font-semibold bg-opacity-50"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1 italic">{getCobroBreakdown()}</p>
                </div>
              </>
            ) : (
              // Modo Servicio normal - Checklists para tipos específicos
              <>
                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Equipo *
                  </label>
                  <select
                    name="equipoId"
                    value={formData.equipoId}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800"
                    required
                    disabled={!formData.clienteId}
                  >
                    <option value="">Selecciona equipo</option>
                    {filteredEquipments.map(equip => (
                      <option key={equip.id} value={equip.id}>
                        {equip.tipo}: {equip.marca} {equip.modelo} (Serie: {equip.serie})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    Tipo de Servicio *
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800"
                    required
                  >
                    <option value="">Selecciona tipo (muestra checklist si aplica)</option>
                    {tipos.filter(t => t !== 'Visita').map(tipo => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Descripción *
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Ej: Molino atascado, limpiar y calibrar molienda completa (detalles generales)"
                    rows={3}
                    className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800 placeholder-gray-500 resize-none"
                    required={!showChecklist}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Técnico *
                  </label>
                  <select
                    name="tecnico"
                    value={formData.tecnico}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800"
                    required
                  >
                    <option value="">Elige técnico</option>
                    {tecnicos.map(tecnico => <option key={tecnico} value={tecnico}>{tecnico}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Estado Inicial *
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800"
                    required
                  >
                    {estados.map(estado => <option key={estado} value={estado}>{estado}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fecha Estimada (opcional)
                  </label>
                  <input
                    type="date"
                    name="estimatedCompletion"
                    value={formData.estimatedCompletion}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800"
                  />
                </div>

                {showChecklist && (
                  <div className="space-y-3 p-4 bg-amber-50/50 border border-amber-200 rounded-xl">
                    <h4 className="font-semibold text-brown-700 flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Checklist para {currentChecklistType} (marca lo realizado)
                    </h4>
                    {currentChecklistType === 'preventivo' && (
                      preventivoTareas.map(tarea => (
                        <label key={tarea.id} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            name={tarea.id}
                            checked={checklists.preventivo[tarea.id]}
                            onChange={(e) => handleChecklistChange(e, 'preventivo')}
                            className="rounded text-amber-500 focus:ring-amber-400"
                          />
                          <span>{tarea.label}</span>
                        </label>
                      ))
                    )}
                    {currentChecklistType === 'general' && (
                      generalTareas.map(tarea => (
                        <label key={tarea.id} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            name={tarea.id}
                            checked={checklists.general[tarea.id]}
                            onChange={(e) => handleChecklistChange(e, 'general')}
                            className="rounded text-amber-500 focus:ring-amber-400"
                          />
                          <span>{tarea.label}</span>
                        </label>
                      ))
                    )}
                    {currentChecklistType === 'reconstruccion' && (
                      reconstruccionTareas.map(tarea => (
                        <label key={tarea.id} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            name={tarea.id}
                            checked={checklists.reconstruccion[tarea.id]}
                            onChange={(e) => handleChecklistChange(e, 'reconstruccion')}
                            className="rounded text-amber-500 focus:ring-amber-400"
                          />
                          <span>{tarea.label}</span>
                        </label>
                      ))
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-brown-700 mb-1 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Notas Adicionales
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Ej: Notas extras (el checklist se agrega automáticamente si aplica)"
                    rows={2}
                    className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 text-brown-800 placeholder-gray-500 resize-none"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                {loading ? `Creando ${isVisita ? 'Visita...' : 'Servicio...'}` : `Crear ${isVisita ? 'Visita' : 'Servicio'}`}
              </motion.button>
              <motion.button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300"
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

export default AddServiceModal;