import type {
  AdminBusinessOverview,
  AdminCatalogOverview,
  AdminClientOverview,
  AdminInventoryOverview,
  AdminPreProjectOverview,
  AdminProjectOverview,
  AdminReportsOverview,
} from "../types/types";

const simulateFetch = <T>(payload: T): Promise<T> =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(payload), 180);
  });

const mockAdminClientsOverview: AdminClientOverview = {
  stats: [
    {
      label: "Clientes activos",
      value: 42,
      detail: "CCTV, access control y mixtos",
    },
    {
      label: "Sitios monitoreados",
      value: 118,
      detail: "30 sitios con soporte VIP",
    },
    {
      label: "Tickets abiertos",
      value: 8,
      detail: "4 urgentes, 2 preventivos",
    },
    {
      label: "Visitas proximas",
      value: 5,
      detail: "Programadas en los proximos 7 dias",
    },
  ],
  clients: [
    {
      name: "Banco Horizonte",
      type: "empresa",
      sites: 3,
      status: "Activo",
      nextVisit: "23 mar 2026 · Tecnico: Luis Santana",
      tags: ["VIP", "Mantenimiento", "Pago recurrente"],
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?fit=crop&w=400&q=60",
      primaryContact: "Vanessa Díaz · vdiaz@horizonte.com",
      plan: "Enterprise Plus",
      nextAudit: "03 abr 2026",
    },
    {
      name: "Colmado del Valle",
      type: "comercio",
      sites: 1,
      status: "Pendiente",
      nextVisit: "25 mar 2026 · Levantamiento final",
      tags: ["Cotizacion aprobada", "Monitorizado"],
      image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?fit=crop&w=400&q=60",
      primaryContact: "Eduardo Ramírez · eramirez@colmado.com",
      plan: "Growth Vision",
      nextAudit: "27 mar 2026",
    },
    {
      name: "NovaTech Logistics",
      type: "empresa",
      sites: 5,
      status: "Activo",
      nextVisit: "29 mar 2026 · Seguimiento de averia",
      tags: ["Garantia", "Inventario reservado"],
      image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?fit=crop&w=400&q=60",
      primaryContact: "María Solano · msolano@novatech.com",
      plan: "Enterprise Plus",
      nextAudit: "12 abr 2026",
    },
  ],
};

const mockAdminBusinessOverview: AdminBusinessOverview = {
  currentPlan: "Enterprise Plus",
  renewalDate: "11 abr 2026",
  currency: "USD",
  limits: [
    { label: "Clientes", used: 86, limit: 125 },
    { label: "Tecnicos", used: 12, limit: 20 },
    { label: "Tickets activos", used: 23, limit: 40 },
    { label: "Sensores conectados", used: 189, limit: 220 },
  ],
  tenants: [
    {
      name: "Sede Santo Domingo",
      timezone: "America/Santo_Domingo",
      currency: "USD",
      status: "Activo",
    },
    {
      name: "Sucursal Santiago",
      timezone: "America/Santo_Domingo",
      currency: "DOP",
      status: "Activo",
    },
    {
      name: "Centro Caribe",
      timezone: "America/Santo_Domingo",
      currency: "USD",
      status: "Suspendido",
    },
  ],
  security: [
    {
      title: "Verificacion OTP",
      detail: "Envio de codigo de 6 digitos al correo del admin.",
      status: "Activo",
    },
    {
      title: "Roles y permisos",
      detail: "Asignados por modulo: Admin, Tecnica, Soporte y Cliente.",
      status: "En revision",
    },
    {
      title: "Auditoria y bitacora",
      detail: "Cambios criticos quedan logueados en Supabase.",
      status: "Activa",
    },
  ],
};

const mockAdminProjectOverview: AdminProjectOverview = {
  projectCount: 8,
  phaseStats: [
    { phase: "Planificado", count: 3, completion: 40 },
    { phase: "En progreso", count: 2, completion: 65 },
    { phase: "Configuracion", count: 2, completion: 82 },
    { phase: "Entrega", count: 1, completion: 95 },
  ],
  activeProjects: [
    {
      name: "Plaza Central CCTV",
      client: "NovaTech Logistics",
      status: "En progreso",
      nextMilestone: "Configuracion del simulador por zonas",
      notes: "Disco recomendado: 8TB. 6 camaras ya instaladas.",
      dueDate: "31 mar 2026",
    },
    {
      name: "Camaras Supermercado Riviera",
      client: "Colmado del Valle",
      status: "Planificado",
      nextMilestone: "Levantamiento tecnico y entrega de cotizacion",
      notes: "Cotizacion pendiente de aprobacion.",
      dueDate: "05 abr 2026",
    },
    {
      name: "Oficinas Grupo Polaris",
      client: "Grupo Polaris",
      status: "En progreso",
      nextMilestone: "Pruebas de red y entrenamiento de usuario",
      notes: "Checklist en curso, falta la capacitacion.",
      dueDate: "09 abr 2026",
    },
  ],
  surveyReports: [
    {
      ticketId: "TCK-1045",
      projectName: "Hotel Oasis Colonial CCTV",
      client: "Hotel Oasis Colonial",
      site: "Lobby, recepcion y pasillo principal",
      placeType: "Empresa mediana",
      technician: "Keila Martinez",
      surveyDate: "22 mar 2026",
      status: "Levantamiento completado",
      summary:
        "Se validaron puntos de camaras, energia, canalizacion y ubicacion del rack para la nueva etapa del proyecto.",
      zoneCoverage: [
        "Recepcion principal con cobertura frontal y lateral",
        "Pasillo de habitaciones con dos puntos ciegos detectados",
        "Area de caja con necesidad de camara fija adicional",
      ],
      infrastructure: [
        "Canaletas existentes reutilizables en un 70%",
        "Switch PoE actual con solo 2 puertos libres",
        "UPS instalada pero sin autonomia suficiente para 8 camaras",
      ],
      risks: [
        "Punto ciego en acceso de servicio",
        "Iluminacion nocturna baja en pasillo norte",
        "NVR actual cerca del limite de almacenamiento",
      ],
      recommendations: [
        "Agregar 1 bullet exterior en acceso de servicio",
        "Migrar a NVR de 16 canales con disco de 10TB",
        "Instalar iluminacion auxiliar en pasillo norte",
      ],
      evidence: [
        { label: "Altura promedio", value: "4.8 m" },
        { label: "Distancia cableado", value: "92 m max" },
        { label: "Energia disponible", value: "110V estable en rack" },
        { label: "Retencion estimada", value: "30 dias en H.265" },
      ],
      checklist: [
        { label: "Levantamiento fotografico", status: "Completo" },
        { label: "Revision electrica", status: "Completo" },
        { label: "Prueba de red", status: "Completo" },
        { label: "Firma del cliente", status: "Pendiente" },
      ],
      proposedDevices: [
        "4 camaras domo 6MP",
        "1 camara bullet exterior",
        "1 NVR 16CH",
        "1 disco 10TB surveillance",
      ],
      nextStep: "Enviar propuesta tecnica y cerrar aprobacion de equipos.",
      aiQuote: {
        generatedFor: "Empresa mediana / hotel",
        scope: "Cobertura de lobby, caja, pasillo principal y acceso de servicio",
        complexity: "Media",
        estimatedTime: "2 dias de instalacion",
        subtotal: "USD 3,920",
        installation: "USD 780",
        aiAdjustment: "USD 180",
        total: "USD 4,880",
        rationale:
          "La IA elevó la propuesta por iluminación nocturna deficiente, expansión del NVR y refuerzo en acceso exterior.",
        lineItems: [
          { concept: "Camara domo 6MP", quantity: 4, unitPrice: "USD 265", subtotal: "USD 1,060" },
          { concept: "Camara bullet exterior", quantity: 1, unitPrice: "USD 320", subtotal: "USD 320" },
          { concept: "NVR 16 canales", quantity: 1, unitPrice: "USD 780", subtotal: "USD 780" },
          { concept: "Disco 10TB surveillance", quantity: 1, unitPrice: "USD 240", subtotal: "USD 240" },
          { concept: "Canalizacion y accesorios", quantity: 1, unitPrice: "USD 620", subtotal: "USD 620" },
          { concept: "Mano de obra tecnica", quantity: 1, unitPrice: "USD 900", subtotal: "USD 900" },
        ],
      },
    },
    {
      ticketId: "TCK-1039",
      projectName: "CityBank Torre Norte Seguridad",
      client: "CityBank Torre Norte",
      site: "Cuarto de telecom, acceso principal y parqueo",
      placeType: "Empresa grande",
      technician: "Luis Santana",
      surveyDate: "23 mar 2026",
      status: "Listo para proyecto",
      summary:
        "El tecnico documentó temperatura del switch, capacidad de UPS, estado del cableado y zonas criticas de acceso vehicular.",
      zoneCoverage: [
        "Acceso principal con flujo alto de personas",
        "Parqueo con necesidad de lectura de placas",
        "Cuarto de telecom con reemplazo obligatorio de switch PoE",
      ],
      infrastructure: [
        "Rack con espacio suficiente para expansion",
        "Canalizacion principal disponible",
        "PoE 48CH con sobretemperatura recurrente",
      ],
      risks: [
        "Fallo del switch actual en horas pico",
        "Ausencia de respaldo de energia en parqueo",
        "Cables exteriores sin proteccion UV",
      ],
      recommendations: [
        "Cambiar switch por modelo administrable industrial",
        "Agregar UPS dedicada para parqueo",
        "Instalar dos camaras LPR para entrada y salida",
      ],
      evidence: [
        { label: "Temperatura switch", value: "68°C promedio" },
        { label: "Puertos ocupados", value: "44 de 48" },
        { label: "Cobertura deseada", value: "3 accesos + 2 carriles" },
        { label: "Capacidad UPS actual", value: "14 min" },
      ],
      checklist: [
        { label: "Levantamiento fotografico", status: "Completo" },
        { label: "Revision cableado", status: "Completo" },
        { label: "Evaluacion de riesgo", status: "Completo" },
        { label: "Validacion con seguridad", status: "Completo" },
      ],
      proposedDevices: [
        "2 camaras LPR 8MP",
        "1 switch PoE industrial 48CH",
        "2 UPS 1500VA",
        "1 gabinete exterior IP65",
      ],
      nextStep: "Pasar a cotizacion formal y reservar inventario critico.",
      aiQuote: {
        generatedFor: "Empresa grande / corporativo",
        scope: "Acceso principal, parqueo, telecom y continuidad operativa",
        complexity: "Alta",
        estimatedTime: "3 dias de instalacion",
        subtotal: "USD 8,250",
        installation: "USD 1,460",
        aiAdjustment: "USD 540",
        total: "USD 10,250",
        rationale:
          "La IA incrementó la cotización por criticidad bancaria, reemplazo industrial PoE, gabinetes exteriores y respaldo energético adicional.",
        lineItems: [
          { concept: "Camara LPR 8MP", quantity: 2, unitPrice: "USD 690", subtotal: "USD 1,380" },
          { concept: "Switch PoE industrial 48CH", quantity: 1, unitPrice: "USD 2,450", subtotal: "USD 2,450" },
          { concept: "UPS 1500VA", quantity: 2, unitPrice: "USD 380", subtotal: "USD 760" },
          { concept: "Gabinete exterior IP65", quantity: 1, unitPrice: "USD 420", subtotal: "USD 420" },
          { concept: "Proteccion UV y cableado exterior", quantity: 1, unitPrice: "USD 1,040", subtotal: "USD 1,040" },
          { concept: "Mano de obra especializada", quantity: 1, unitPrice: "USD 2,200", subtotal: "USD 2,200" },
        ],
      },
    },
  ],
};

const mockAdminPreProjectOverview: AdminPreProjectOverview = {
  surveys: [
    {
      site: "Centro Logistico Norte",
      zone: "Entrada, lobby y parqueo",
      objective: "Cobertura perimetral con camaras PTZ",
      risks: ["Puntos ciegos en torre sur", "Acceso no autorizado"],
      nextSteps: "Mediciones de altura, fotos y cotizacion",
      measurements: "12m distancia, altura 5m en parqueo",
      networkStatus: "Switch PoE 16CH con 10 puertos disponibles",
      timeline: "Levantamiento 24 mar, instalacion 30 mar",
    },
    {
      site: "Oficina Torre Valle",
      zone: "Lobby, pasillos y caja",
      objective: "Monitoreo 24/7 y alertas de movimiento",
      risks: ["Saturacion de NVR 4K", "UPS incompleta"],
      nextSteps: "Revisar compatibilidad de NVR y calcular retencion",
      measurements: "6 camaras 4MP, 30fps, retencion 30 dias",
      networkStatus: "Red estable, prueba final MinPoE",
      timeline: "Relevamiento 26 mar, cotizacion 27 mar",
    },
  ],
  storageRecommendations: [
    {
      cameras: 8,
      resolution: "4MP / 15fps",
      codec: "H.265",
      retentionDays: 30,
      recommendedDisk: "Seagate 6TB Surveillance",
      nvr: "NVR 8 canales, PoE integrado",
    },
    {
      cameras: 16,
      resolution: "8MP / 20fps",
      codec: "H.265+",
      retentionDays: 60,
      recommendedDisk: "WD Purple 10TB",
      nvr: "NVR 16 canales, RAID 1",
    },
  ],
};

const mockAdminCatalogOverview: AdminCatalogOverview = {
  categories: [
    {
      name: "Camaras IP / PTZ",
      items: 24,
      description: "2MP a 12MP, ONVIF, IR y WDR.",
      recommended: "Elite Dome 4K - PoE + Audio",
    },
    {
      name: "NVR / DVR",
      items: 6,
      description: "8/16 canales, compatibilidad H.265 y RAID.",
      recommended: "NVR 16CH Pro con 2 bahias de disco",
    },
    {
      name: "Switch PoE / UPS",
      items: 12,
      description: "Switch 8/16 puertos PoE y UPS 1500VA.",
      recommended: "Switch 16CH Uplink + UPS 220V",
    },
    {
      name: "Accesorios",
      items: 48,
      description: "UTP, canaletas, conectores y patch cords.",
      recommended: "Kit cableado completo + etiquetas",
    },
    {
      name: "Sensores de movimiento",
      items: 9,
      description: "PIR, dual tech y sensores para interior/exterior.",
      recommended: "Ajax MotionProtect Outdoor",
    },
  ],
  compatibilityAlerts: [
    "NVR 8 canales no soporta 4K en mas de 6 camaras.",
    "Switch PoE 8CH sin suficiente potencia para 10 camaras 30W.",
    "Disco 4TB no cubre retencion 45 dias con camaras 4K.",
  ],
  cameraCatalog: [
    {
      name: "Axis P3265-LV",
      type: "Domo PTZ",
      resolution: "4K UHD · 30x Zoom",
      lens: "4.3-129 mm",
      poe: true,
      onvif: true,
      nightVision: "150 m (IR)",
      description:
        "PTZ profesional para coberturas externas con estabilizador óptico y seguimiento automático.",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?fit=crop&w=600&q=60",
      price: "USD 1,450",
      stock: 6,
      features: ["AI tracker", "WDR", "IP66", "Audio bidireccional"],
    },
    {
      name: "Hikvision DS-2CD2387G2-LU",
      type: "Bullet AI",
      resolution: "8MP · Color nocturno",
      lens: "2.8 mm",
      poe: true,
      onvif: true,
      nightVision: "Color hasta 30 m",
      description:
        "Bullet alimentado por AI con detección de intrusión y vídeo a color en baja luz.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?fit=crop&w=600&q=60",
      price: "USD 320",
      stock: 18,
      features: ["ColorVu", "Compresión H.265+", "Smart Dual Light"],
    },
    {
      name: "Bosch NBN-73023BA",
      type: "Mini dome",
      resolution: "2MP",
      lens: "3.6 mm",
      poe: true,
      onvif: true,
      nightVision: "25 m",
      description:
        "Mini dome discreta con analítica integrada para entradas y pasillos con detección de personas.",
      image: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?fit=crop&w=600&q=60",
      price: "USD 390",
      stock: 12,
      features: ["Analítica en cámara", "Audio integrado", "IP66"],
    },
    {
      name: "Dahua N52AADA",
      type: "Turbo HD",
      resolution: "5MP",
      lens: "2.8 mm",
      poe: false,
      onvif: false,
      nightVision: "40 m",
      description:
        "Alternativa analógica para DVRs existentes, con compresión HDCVI y backhaul coaxial.",
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?fit=crop&w=600&q=60",
      price: "USD 120",
      stock: 42,
      features: ["Compatible HDCVI", "IK10", "Smart IR"],
    },
  ],
  motionSensorCatalog: [
    {
      name: "Ajax MotionProtect Outdoor",
      coverage: "15 m · 90°",
      detection: "PIR dual con antimascota",
      connectivity: "Jeweller RF",
      installation: "Exterior / muro perimetral",
      description:
        "Sensor premium para perimetro con filtro de falsas alarmas y deteccion estable bajo lluvia o calor.",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?fit=crop&w=600&q=60",
      price: "USD 210",
      stock: 14,
      idealFor: ["Perimetro", "Parqueos", "Residencial premium"],
      features: ["Antimasking", "IP55", "Mascotas ignoradas", "Bateria larga duracion"],
    },
    {
      name: "Bosch ISC-BPR2-W12",
      coverage: "12 m · 85°",
      detection: "PIR interior",
      connectivity: "Cableado",
      installation: "Interior / pared",
      description:
        "Sensor de movimiento para lobby y oficinas con analisis de ruido y compensacion automatica de temperatura.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?fit=crop&w=600&q=60",
      price: "USD 48",
      stock: 37,
      idealFor: ["Lobby", "Oficinas", "Retail"],
      features: ["Blue line", "Tamper", "Bajo consumo", "Montaje rapido"],
    },
    {
      name: "DSC LC-151",
      coverage: "15 m · 90°",
      detection: "Dual tech exterior",
      connectivity: "Cableado",
      installation: "Exterior / acceso principal",
      description:
        "Sensor exterior con inmunidad a mascotas y mayor tolerancia a vibracion para accesos y patios.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?fit=crop&w=600&q=60",
      price: "USD 96",
      stock: 11,
      idealFor: ["Patios", "Accesos", "Comercios"],
      features: ["Dual tech", "IP65", "Anti-sabotaje", "Pet immunity"],
    },
  ],
};

const mockAdminInventoryOverview: AdminInventoryOverview = {
  stockLevels: [
    {
      material: "Camara domo 5MP PoE",
      current: 12,
      minimum: 5,
      location: "Bodega Santo Domingo",
      status: "Disponible",
    },
    {
      material: "Switch PoE 16CH",
      current: 3,
      minimum: 4,
      location: "Bodega Santiago",
      status: "Reorden pendiente",
    },
    {
      material: "Disco duro 8TB Surveillance",
      current: 6,
      minimum: 3,
      location: "Bodega Santo Domingo",
      status: "Estable",
    },
    {
      material: "UPS 1500VA",
      current: 1,
      minimum: 2,
      location: "Taller tecnico",
      status: "Reserva urgente",
    },
  ],
  alerts: [
    "Switch PoE 16CH: stock por debajo del minimo, pedir 5 unidades.",
    "UPS 1500VA: solo queda 1 unidad para entrega urgente.",
  ],
  lastUpdated: "20 mar 2026 - 09:00",
};

const mockAdminReportsOverview: AdminReportsOverview = {
  reports: [
    {
      title: "Proyectos en curso",
      metric: "8",
      trend: "+2 vs. mes anterior",
      details: "2 en planificacion, 3 en ejecucion y 3 en pruebas.",
    },
    {
      title: "Ingresos mensuales",
      metric: "USD 98,600",
      trend: "+14% vs febrero",
      details: "Cotizaciones aprobadas y pagos recientes contabilizados.",
    },
    {
      title: "Tickets abiertos",
      metric: "11",
      trend: "-3 vs ayer",
      details: "2 urgentes siguen activos, 4 resueltos.",
    },
    {
      title: "Equipos instalados",
      metric: "152",
      trend: "+24 este mes",
      details: "Camaras, NVR, discos y accesorios confirmados.",
    },
  ],
  exports: [
    {
      type: "Clientes & sitios",
      lastExported: "18 mar 2026",
      format: "Excel",
    },
    {
      type: "Cotizaciones aprobadas",
      lastExported: "17 mar 2026",
      format: "PDF",
    },
    {
      type: "Tickets y SLA",
      lastExported: "20 mar 2026",
      format: "CSV",
    },
  ],
};

export const fetchAdminClientsOverview = () =>
  simulateFetch(mockAdminClientsOverview);

export const fetchAdminBusinessOverview = () =>
  simulateFetch(mockAdminBusinessOverview);

export const fetchAdminProjectOverview = () =>
  simulateFetch(mockAdminProjectOverview);

export const fetchAdminPreProjectOverview = () =>
  simulateFetch(mockAdminPreProjectOverview);

export const fetchAdminCatalogOverview = () =>
  simulateFetch(mockAdminCatalogOverview);

export const fetchAdminInventoryOverview = () =>
  simulateFetch(mockAdminInventoryOverview);

export const fetchAdminReportsOverview = () =>
  simulateFetch(mockAdminReportsOverview);
