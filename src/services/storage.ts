import {
  StoreContent,
  MediaItem,
  ReviewItem,
  OrderItem,
  PaymentGatewaysSettings,
  StoreAnalytics
} from '../types/store';

const STORAGE_KEYS = {
  CONTENT: 'h2derm_store_content_v1',
  MEDIA: 'h2derm_store_media_v1',
  REVIEWS: 'h2derm_store_reviews_v1',
  ORDERS: 'h2derm_store_orders_v1',
  GATEWAYS: 'h2derm_gateways_v1',
  ANALYTICS: 'h2derm_analytics_v1',
  ADMIN_PIN: 'h2derm_admin_pin_v1',
  PUSH_SUBSCRIBED: 'h2derm_push_sub_v1',
  CART: 'h2derm_cart_v1'
};

export const DEFAULT_CONTENT: StoreContent = {
  announcementText: '🔥 OFERTA RELÁMPAGO DE HOY: 3 CUOTAS SIN INTERÉS + ENVÍO GRATIS A TODO EL PAÍS',
  announcementSubtext: 'PAGA AL RECIBIR O CON MERCADO PAGO · DESPACHO PRIORITARIO EN 24 HORAS',
  brandName: 'H2derm',
  productKicker: 'H2DERM DERMA-LABS · TRATAMIENTO PROFESIONAL DE ALTA GAMA',
  productTitle: 'H2derm® PROFESIONAL KIT — Rutina Completa Rostro & Piel Renovada',
  productTagline: 'Fórmula dermocosmética avanzada desarrollada para aliviar piel seca y con picazón, restaurar la barrera lipídica, aclarar manchas persistentes y aportar luminosidad inmediata en 14 días.',
  ratingScore: 4.9,
  ratingCount: 2847,
  stockRemaining: 7,
  viewersCount: 42,
  countdownMinutes: 14,
  currencySymbol: '$',
  currencyCode: 'ARS',

  packs: [
    {
      id: 'pack-1',
      title: '1x KIT ROSTRO H2derm',
      subtitle: 'Tratamiento Inicial (1 Mes de Renovación)',
      quantity: 1,
      originalPrice: 59900,
      salePrice: 38900,
      discountPercentage: 35,
      savings: 21000,
      features: [
        'Los 4 productos completos originales',
        'Envío GRATIS a domicilio asegurado',
        'Guía clínica de aplicación paso a paso'
      ]
    },
    {
      id: 'pack-2',
      title: '2x KITS ROSTRO H2derm',
      subtitle: 'Tratamiento Intensivo (2 Meses) o Para Compartir',
      badge: 'MÁS VENDIDO · 48% OFF',
      isPopular: true,
      quantity: 2,
      originalPrice: 119800,
      salePrice: 62200,
      discountPercentage: 48,
      savings: 57600,
      freeGift: '🎁 REGALO: Neceser Térmico Edición Limitada ($15.000 valor)',
      features: [
        '2 Cajas completas (8 productos en total)',
        'Neceser Térmico de lujo sin cargo',
        'Envío Prioritario Express en 24/48hs',
        'Garantía de Satisfacción Total 30 Días'
      ]
    },
    {
      id: 'pack-3',
      title: '3x KITS ROSTRO H2derm',
      subtitle: 'Máximo Ahorro Familiar o Tratamiento Anual Continuo',
      badge: 'MEJOR AHORRO · 58% OFF',
      quantity: 3,
      originalPrice: 179700,
      salePrice: 75400,
      discountPercentage: 58,
      savings: 104300,
      freeGift: '🎁 REGALO: Rodillo Facial Cuarzo Rosa + Neceser de Lujo',
      features: [
        '3 Cajas completas (12 productos en total)',
        'Set Doble de Regalos Exclusivos',
        'Despacho y Envío VIP Prioritario',
        'Garantía Extendida & Soporte Dermocosmético'
      ]
    }
  ],

  guaranteeDays: 30,
  guaranteeTitle: 'Garantía Incondicional de 30 Días',
  guaranteeText: 'Si tras usar el kit durante 30 días no notas tu piel visiblemente más hidratada, luminosa y sin picazón o tirantez, te reembolsamos el 100% de tu dinero sin preguntas ni complicaciones.',
  shippingPromise: 'Envíos a todo el país vía Correo Argentino / Andreani / Envío Express en el día en CABA y GBA.',

  problemTitle: '¿Tu piel se siente tirante, apagada, con picazón o manchas?',
  problemSubtitle: 'El 89% de las cremas convencionales solo hidratan la capa exterior temporalmente, evaporándose en pocas horas y dejando la barrera cutánea rota.',
  solutionTitle: 'La Solución Biotecnológica H2derm',
  solutionSubtitle: 'Nuestra fórmula multifásica penetra hasta la dermis profunda para restaurar los lípidos esenciales, desinflamar la irritación y reactivar la síntesis natural de colágeno.',

  beforeAfterTitle: 'Resultados Clínicos Reales en 14 y 28 Días',
  beforeAfterSubtitle: 'Desliza para ver la transformación real de piel seca, con tirantez y manchas a un rostro radiante, firme y rejuvenecido.',
  beforeLabel: 'Antes (Día 1)',
  afterLabel: 'Después (Día 28)',
  beforeDescription: 'Piel deshidratada, descamación en pómulos, rojez por picazón constante y tono opaco con manchas solares.',
  afterDescription: 'Barrera restaurada, hidratación continua por 24hs, manchas visiblemente aclaradas y luminosidad natural radiante.',
  beforeImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1200&auto=format&fit=crop',
  afterImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
  clinicalStats: [
    {
      percentage: '98%',
      badge: 'Desde el Día 1',
      title: 'Alivio Inmediato de Picazón y Tirantez',
      description: 'Calma la irritación y desinflama las zonas ásperas, hidratando sin sensación oleosa.'
    },
    {
      percentage: '94%',
      badge: 'Día 14 a 21',
      title: 'Aclarado Visible de Manchas Solares y Tono Parejo',
      description: 'Gracias a la acción combinada del Bakuchiol y la Rosa Mosqueta de prensado en frío.'
    },
    {
      percentage: '96%',
      badge: 'Día 28',
      title: 'Piel Más Luminosa, Tersa y Rejuvenecida',
      description: 'Efecto lifting natural, rellenado de líneas finas de expresión y brillo saludable.'
    }
  ],

  // Routine steps (100% editable from Admin)
  routineTitle: 'Tu Rutina Diaria Completa en 4 Pasos',
  routineSubtitle: 'Diseñada por expertos para máxima sinergia entre exfoliación botánica, nutrición celular e hidratación profunda.',
  routineSteps: [
    {
      number: '01',
      title: 'Crema Exfoliante Micro-cristalina',
      subtitle: 'Limpieza profunda y exfoliación suave',
      time: '2 a 3 veces por semana',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
      description: 'Elimina células muertas e impurezas sin dañar la barrera lipídica. Prepara la piel para absorber los activos concentrados al 100%.',
      benefits: ['Libera poros obstruidos', 'Suavidad sedosa al tacto', 'Cero irritación o ardor']
    },
    {
      number: '02',
      title: 'Anti-Age Rosehip & Bakuchiol Serum (50ml)',
      subtitle: 'Nutrición celular y cuidado específico',
      time: 'Día y Noche · Gotero dosificador',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
      description: 'El corazón de la fórmula: combina Rosa Mosqueta biológica rica en omegas y Bakuchiol al 1% (alternativa natural al retinol). Aclara manchas y regenera colágeno.',
      benefits: ['Atenúa manchas y líneas finas', 'Efecto lifting y luminosidad', 'Textura ligera no oleosa']
    },
    {
      number: '03',
      title: 'Crema Reestructurante Hidratante 24h',
      subtitle: 'Hidratación que dura todo el día',
      time: 'Diariamente tras el sérum',
      image: 'https://images.unsplash.com/photo-1608248597359-00122e232938?q=80&w=800&auto=format&fit=crop',
      description: 'Sella la humedad esencial en las capas profundas. Elimina por completo la picazón, descamación y sensación de tirantez desde la primera aplicación.',
      benefits: ['Barrera protectora reforzada', 'Calma picazón y rojez al instante', 'Acabado mate aterciopelado']
    },
    {
      number: '04',
      title: 'Emulsión Bifásica Hidratante Rostro & Escote',
      subtitle: 'El kit que tu cuerpo y piel necesitan',
      time: 'Uso diario y post-ducha',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
      description: 'Completa la rutina para unificar el tono y luminosidad no solo en la cara sino en el cuello, escote y zonas resecas del cuerpo.',
      benefits: ['Cuidado integral rostro y cuello', 'Antioxidantes activos', 'Piel tersa y radiante 24/7']
    }
  ],

  // Problems and Solutions
  problemItems: [
    {
      problemName: 'Piel Seca y Tirantez',
      problemDescription: 'La capa hidrolipídica pierde agua transepidérmica, causando sensación de cartón y grietas microscópicas.',
      solutionName: 'Triple Ácido Hialurónico',
      solutionDescription: 'Fija 1.000 veces su peso en agua en capas profundas.'
    },
    {
      problemName: 'Picazón y Rojez Constante',
      problemDescription: 'La barrera protectora rota deja expuestas las terminaciones nerviosas ante cualquier roce o cambio de clima.',
      solutionName: 'Ceramidas & Micro-nutrientes',
      solutionDescription: 'Calman y desinflaman el enrojecimiento en minutos.'
    },
    {
      problemName: 'Manchas y Tono Desparejo',
      problemDescription: 'Hiperpigmentación por radiación solar, daño oxidativo o marcas residuales que envejecen el rostro.',
      solutionName: 'Bakuchiol 1% + Rosa Mosqueta',
      solutionDescription: 'Inhibe la melanina y aclara progresivamente.'
    },
    {
      problemName: 'Piel Apagada y Envejecida',
      problemDescription: 'Células muertas acumuladas y falta de nutrición celular que restan brillo y elasticidad.',
      solutionName: 'Exfoliación Micro-cristalina',
      solutionDescription: 'Luminosidad glow natural desde la primera semana.'
    }
  ],

  // Active Ingredients
  activeIngredients: [
    {
      name: 'Bakuchiol 1.0%',
      type: 'Retinol Botánico Puro',
      benefit: 'Estimula la renovación celular y la síntesis de colágeno sin descamación, enrojecimiento ni fotosensibilidad.',
      tag: 'Antiedad & Manchas'
    },
    {
      name: 'Rosa Mosqueta Orgánica',
      type: 'Prensado en Frío',
      benefit: 'Rica en ácidos grasos esenciales omega 3, 6 y 9. Cicatriza, regenera tejidos dañados y atenúa manchas oscuras.',
      tag: 'Regenerador Celular'
    },
    {
      name: 'Ácido Hialurónico Triple',
      type: 'Bajo, Medio y Alto Peso Molecular',
      benefit: 'Hidrata desde la superficie hasta las capas dérmicas más profundas, rellenando líneas de expresión y sequedad.',
      tag: 'Hidratación 24H'
    },
    {
      name: 'Niacinamida 5.0%',
      type: 'Vitamina B3 Activa',
      benefit: 'Refuerza la barrera cutánea frente a la polución, calma la picazón de forma inmediata y unifica el tono facial.',
      tag: 'Anti-irritación'
    },
    {
      name: 'Ceramidas NP & Fitoesteroles',
      type: 'Lípidos Idénticos a la Piel',
      benefit: 'Reparan el cemento intercelular, frenando la pérdida de agua y sellando los nutrientes en el rostro.',
      tag: 'Barrera Cutánea'
    },
    {
      name: 'Vitamina C & E Liposomal',
      type: 'Antioxidantes de Alta Estabilidad',
      benefit: 'Neutralizan los radicales libres, iluminan la tez apagada y devuelven el brillo juvenil radiante.',
      tag: 'Máxima Luminosidad'
    }
  ],

  dermatologistDoctorName: 'Dra. Mariana Estévez · Médica Dermatóloga (M.N. 128.490)',
  dermatologistQuote: '«H2derm logra lo que pocos kits consiguen: combinar el poder antiedad del Bakuchiol sin resecar, y la hidratación intensiva sin sobrecargar la piel. Es la rutina más equilibrada y eficaz que he testeado para pacientes con piel seca, manchas y pérdida de luminosidad.»',
  dermatologistPhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop',

  shippingEstimatedDays: '24 a 48 horas en todo el país',
  freeShippingThresholdText: 'Envío 100% Bonificado Sin Cargo',

  whatsappNumber: '+54 9 11 4920-8842',
  supportEmail: 'contacto@h2derm.shop',
  supportPhone: '0800-444-H2DERM (4233)',
  shippingCarriersText: 'Andreani · Correo Argentino · Moto Express en el día'
};

export const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: 'media-video-1',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-skincare-cream-on-her-face-41138-large.mp4',
    title: 'Demostración de Rutina H2derm en Vivo',
    badge: 'VIDEO OFICIAL · EN ACCIÓN',
    thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=900&auto=format&fit=crop',
    duration: '0:35'
  },
  {
    id: 'media-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop',
    title: 'Kit H2derm Profesional Completo (Caja & 4 Productos)',
    badge: 'KIT COMPLETO'
  },
  {
    id: 'media-2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop',
    title: 'Anti-age Rosehip & Bakuchiol Serum 50ml Gotero',
    badge: 'PASO 2 · SÉRUM INTENSIVO'
  },
  {
    id: 'media-3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1608248597359-00122e232938?q=80&w=1200&auto=format&fit=crop',
    title: 'H2derm Crema Reestructurante Hidratante 24h',
    badge: 'PASO 3 · HIDRATACIÓN DÉRMICA'
  },
  {
    id: 'media-4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1200&auto=format&fit=crop',
    title: 'H2derm Crema Exfoliante Suave de Micro-cristales',
    badge: 'PASO 1 · LIMPIEZA PROFUNDA'
  },
  {
    id: 'media-5',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1512290900672-1f486518a09f?q=80&w=1200&auto=format&fit=crop',
    title: 'Textura Sedosa y Absorción Inmediata Sin Sensación Grasa',
    badge: 'ACABADO LUMINOSO'
  },
  {
    id: 'media-6',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
    title: 'Certificación y Respaldo Dermatológico en Clínica',
    badge: 'APROBADO POR DERMATÓLOGOS'
  }
];

export const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Carolina M. Santillán',
    city: 'Buenos Aires, CABA',
    rating: 5,
    date: 'Hace 2 días',
    verified: true,
    title: '¡Adiós a la picazón y tirantez después de años sufriendo!',
    comment: 'Tengo piel atópica hipersensible, cualquier crema me ardía o me dejaba la cara colorada. Con H2derm el cambio fue desde la primera noche: me levanté sin esa sensación de sequedad insoportable. Y el sérum de rosa mosqueta con bakuchiol me atenuó notablemente dos manchas del sol. Lo pedí y me llegó al día siguiente con pago contraentrega. ¡1000% recomendable!',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
    likes: 34
  },
  {
    id: 'rev-2',
    name: 'Mariana Gomez Videla',
    city: 'Córdoba Capital',
    rating: 5,
    date: 'Hace 4 días',
    verified: true,
    title: 'Increíble luminosidad, parece que me hice un tratamiento láser',
    comment: 'Compré la promo de 2 kits para regalarle uno a mi mamá. A las dos nos encantó. La crema exfoliante no raspa para nada pero te deja la piel como seda de bebé, y la crema hidratante dura todo el día sin dejar brillo grasoso. Hasta mi marido notó que tenía la cara más fresca y descansada.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
    likes: 28
  },
  {
    id: 'rev-3',
    name: 'Valeria R. Benítez',
    city: 'Rosario, Santa Fe',
    rating: 5,
    date: 'Hace 6 días',
    verified: true,
    title: 'El seguimiento del pedido funcionó perfecto y el producto es de 10',
    comment: 'Tenía dudas porque nunca había comprado en esta tienda, pero el código de seguimiento me iba diciendo exactamente por dónde venía el paquete de Andreani. Pagué por Mercado Pago en 3 cuotas. La presentación de la caja es un lujo total y la textura de los 4 productos es de cosmética europea.',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
    likes: 19
  },
  {
    id: 'rev-4',
    name: 'Dra. Andrea Morales',
    city: 'Mendoza',
    rating: 5,
    date: 'Hace 1 semana',
    verified: true,
    title: 'Como cosmetóloga, la formulación me sorprendió gratamente',
    comment: 'El uso de Bakuchiol al 1% combinado con ácido hialurónico y rosa mosqueta es la combinación perfecta para pacientes que no toleran el retinol puro por irritación. Mis clientas ya lo están adoptando.',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop',
    likes: 47
  }
];

export const DEFAULT_GATEWAYS: PaymentGatewaysSettings = {
  mercadoPago: {
    enabled: true,
    publicKey: '',
    accessToken: '',
    mode: 'production',
    maxInstallments: 6,
    offerCuotasSinInteres: true,
    directPaymentLink: '',
    packLinks: {}
  },
  contraentrega: {
    enabled: true,
    title: 'Pago Contraentrega (Pagar al Recibir)',
    description: 'Pagas en efectivo o con débito en mano al repartidor cuando te entrega el paquete en tu puerta. 0% riesgo.',
    extraFee: 0
  },
  transferencia: {
    enabled: true,
    bankName: 'Banco Santander / Brubank',
    accountHolder: 'H2DERM DERMOCOSMETICA S.R.L.',
    cbu: '0720194888000039201948',
    cvu: '0000003100092837461920',
    alias: 'H2DERM.OFICIAL.PAGOS',
    cuit: '30-71649201-9',
    extraDiscountPercent: 10,
    instructions: 'Una vez hecha la transferencia bancaria o por Mercado Pago a nuestro Alias, adjunta tu comprobante o envíalo por WhatsApp con tu número de pedido.'
  }
};

export const DEFAULT_ORDERS: OrderItem[] = [
  {
    id: 'ord-84920',
    trackingCode: 'H2D-84920',
    customerName: 'Lucía Fernández',
    email: 'lucia.fernandez@gmail.com',
    phone: '+54 9 11 5829-3012',
    dni: '38.492.103',
    street: 'Av. Santa Fe',
    number: '3240',
    apartment: '4B',
    city: 'Palermo, CABA',
    state: 'Buenos Aires',
    zipCode: '1425',
    deliveryNotes: 'Tocar timbre 4B o dejar con encargado Roberto.',
    packId: 'pack-2',
    packTitle: '2x KITS ROSTRO H2derm (Más Vendido)',
    quantity: 1,
    unitPrice: 62200,
    totalPrice: 62200,
    discountApplied: 57600,
    paymentMethod: 'mercadopago',
    paymentStatus: 'paid',
    shippingStatus: 'in_transit',
    carrier: 'Andreani Express (Seguimiento #AND-77492019)',
    statusHistory: [
      {
        status: 'confirmed',
        title: 'Pedido Confirmado y Cobrado',
        description: 'Pago recibido correctamente mediante Mercado Pago.',
        timestamp: '05/10 10:14 hs'
      },
      {
        status: 'preparing',
        title: 'Empaquetado en Laboratorio H2derm',
        description: 'Kit verificado y embalado con sellado de seguridad térmico.',
        timestamp: '05/10 14:30 hs'
      },
      {
        status: 'shipped',
        title: 'Despachado en Centro Logístico',
        description: 'Paquete recibido por Andreani sucursal central.',
        timestamp: '06/10 09:20 hs'
      },
      {
        status: 'in_transit',
        title: 'En Camino a Domicilio',
        description: 'El móvil de reparto se encuentra en camino a tu dirección.',
        timestamp: '06/10 11:45 hs'
      }
    ],
    createdAt: '2026-10-05T13:14:00Z',
    updatedAt: '2026-10-06T14:45:00Z',
    mercadoPagoDetails: {
      paymentId: 'MP-994820192',
      cardLast4: '4182',
      cardBrand: 'Visa',
      installments: 3
    }
  },
  {
    id: 'ord-73194',
    trackingCode: 'H2D-73194',
    customerName: 'Sofía Almada',
    email: 'sofi.almada@hotmail.com',
    phone: '+54 9 351 682-1920',
    dni: '36.812.449',
    street: 'Bv. San Juan',
    number: '840',
    city: 'Córdoba Capital',
    state: 'Córdoba',
    zipCode: '5000',
    packId: 'pack-3',
    packTitle: '3x KITS ROSTRO H2derm (Mejor Ahorro)',
    quantity: 1,
    unitPrice: 75400,
    totalPrice: 67860, // With 10% transfer discount
    discountApplied: 104300,
    paymentMethod: 'transferencia',
    paymentStatus: 'paid',
    shippingStatus: 'shipped',
    carrier: 'Correo Argentino (#CA-94820184AR)',
    statusHistory: [
      {
        status: 'confirmed',
        title: 'Pedido Confirmado',
        description: 'Transferencia validada con comprobante recibido.',
        timestamp: '04/10 16:00 hs'
      },
      {
        status: 'preparing',
        title: 'Embalaje de 3 Kits Completos',
        description: 'Se agregaron los regalos Rodillo de Cuarzo y Neceser de Lujo.',
        timestamp: '05/10 08:30 hs'
      },
      {
        status: 'shipped',
        title: 'Despachado hacia Córdoba',
        description: 'En tránsito interprovincial.',
        timestamp: '05/10 18:00 hs'
      }
    ],
    createdAt: '2026-10-04T19:00:00Z',
    updatedAt: '2026-10-05T21:00:00Z'
  },
  {
    id: 'ord-91204',
    trackingCode: 'H2D-91204',
    customerName: 'Martina Benavídez',
    email: 'martu.benavidez@gmail.com',
    phone: '+54 9 341 490-2183',
    dni: '40.119.820',
    street: 'Corrientes',
    number: '1420',
    city: 'Rosario',
    state: 'Santa Fe',
    zipCode: '2000',
    packId: 'pack-1',
    packTitle: '1x KIT ROSTRO H2derm',
    quantity: 1,
    unitPrice: 38900,
    totalPrice: 38900,
    discountApplied: 21000,
    paymentMethod: 'contraentrega',
    paymentStatus: 'pending',
    shippingStatus: 'preparing',
    carrier: 'Andreani Contraentrega (#AND-3391024)',
    statusHistory: [
      {
        status: 'confirmed',
        title: 'Pedido Contraentrega Registrado',
        description: 'Confirmado por WhatsApp para pago en efectivo al recibir.',
        timestamp: '06/10 08:20 hs'
      },
      {
        status: 'preparing',
        title: 'En Preparación en Depósito',
        description: 'Armando paquete para colecta de Andreani.',
        timestamp: '06/10 10:15 hs'
      }
    ],
    createdAt: '2026-10-06T11:20:00Z',
    updatedAt: '2026-10-06T13:15:00Z'
  }
];

export const DEFAULT_ANALYTICS: StoreAnalytics = {
  totalVisits: 14280,
  addToCartCount: 2940,
  initiatedCheckouts: 1680,
  completedOrders: 942,
  totalRevenue: 58874600,
  dailyVisits: [
    { date: '01/10', visits: 1820, sales: 114 },
    { date: '02/10', visits: 2100, sales: 138 },
    { date: '03/10', visits: 1950, sales: 122 },
    { date: '04/10', visits: 2450, sales: 164 },
    { date: '05/10', visits: 2890, sales: 198 },
    { date: '06/10', visits: 3070, sales: 206 }
  ]
};

// IndexedDB setup for large media (unlimited browser storage for photos/videos)
const DB_NAME = 'H2DermStoreDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_store';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveMediaToIndexedDB = async (media: MediaItem[]): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(media, 'media_list');
  } catch (err) {
    console.warn('IndexedDB write skipped', err);
  }
};

export const getMediaFromIndexedDB = async (): Promise<MediaItem[] | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get('media_list');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

export const saveContentToIndexedDB = async (content: StoreContent): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(content, 'store_content');
  } catch (err) {
    console.warn('IndexedDB content write skipped', err);
  }
};

export const getContentFromIndexedDB = async (): Promise<StoreContent | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get('store_content');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

// Storage helper functions
export const getStoreContent = (): StoreContent => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTENT);
    if (!raw) return DEFAULT_CONTENT;
    const parsed = JSON.parse(raw);
    return { 
      ...DEFAULT_CONTENT, 
      ...parsed,
      routineSteps: Array.isArray(parsed.routineSteps) ? parsed.routineSteps : DEFAULT_CONTENT.routineSteps,
      clinicalStats: Array.isArray(parsed.clinicalStats) ? parsed.clinicalStats : DEFAULT_CONTENT.clinicalStats,
      problemItems: Array.isArray(parsed.problemItems) ? parsed.problemItems : DEFAULT_CONTENT.problemItems,
      activeIngredients: Array.isArray(parsed.activeIngredients) ? parsed.activeIngredients : DEFAULT_CONTENT.activeIngredients,
      packs: Array.isArray(parsed.packs) && parsed.packs.length > 0 
        ? parsed.packs.map((p: any, idx: number) => {
            const defPack = DEFAULT_CONTENT.packs[idx] || DEFAULT_CONTENT.packs[0];
            return {
              ...defPack,
              ...p,
              // Explicitly respect user deletions (empty string, empty array, or undefined)
              freeGift: p.freeGift !== undefined ? p.freeGift : defPack.freeGift,
              features: Array.isArray(p.features) ? p.features : defPack.features,
              badge: p.badge !== undefined ? p.badge : defPack.badge,
              subtitle: p.subtitle !== undefined ? p.subtitle : defPack.subtitle
            };
          })
        : DEFAULT_CONTENT.packs
    };
  } catch {
    return DEFAULT_CONTENT;
  }
};

export const saveStoreContent = (content: StoreContent): void => {
  const contentWithTimestamp: StoreContent = {
    ...content,
    updatedAt: Date.now()
  };
  try {
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(contentWithTimestamp));
  } catch (err) {
    console.warn('LocalStorage saturado, guardando en IndexedDB...', err);
  }
  // Guarantee unlimited image storage persistence
  saveContentToIndexedDB(contentWithTimestamp);
  window.dispatchEvent(new CustomEvent('h2derm_content_updated', { detail: contentWithTimestamp }));

  // Asynchronously send to server to persist permanently for all users & Render deployment
  fetch('/api/store/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contentWithTimestamp)
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      if (data.content) {
        localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(data.content));
        saveContentToIndexedDB(data.content);
        window.dispatchEvent(new CustomEvent('h2derm_content_updated', { detail: data.content }));
      }
    }
  }).catch(() => {});

  fetch('/api/store/save-defaults', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: contentWithTimestamp })
  }).catch(() => {});
};

// Fetch latest content from server (Render deployment / shared users)
export const fetchServerContent = async (): Promise<StoreContent | null> => {
  try {
    const res = await fetch('/api/store/content');
    if (res.ok) {
      const serverContent = await res.json();
      if (serverContent && serverContent.brandName) {
        localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(serverContent));
        saveContentToIndexedDB(serverContent);
        window.dispatchEvent(new CustomEvent('h2derm_content_updated', { detail: serverContent }));
        return serverContent;
      }
    }
  } catch {}
  return null;
};

// Fetch latest media from server (Render deployment / shared users)
export const fetchServerMedia = async (): Promise<MediaItem[] | null> => {
  try {
    const res = await fetch('/api/store/media');
    if (res.ok) {
      const serverMedia = await res.json();
      if (Array.isArray(serverMedia) && serverMedia.length > 0) {
        localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(serverMedia));
        saveMediaToIndexedDB(serverMedia);
        window.dispatchEvent(new CustomEvent('h2derm_media_updated', { detail: serverMedia }));
        return serverMedia;
      }
    }
  } catch {}
  return null;
};

// Fetch latest payment gateways from server
export const fetchServerGateways = async (): Promise<PaymentGatewaysSettings | null> => {
  try {
    const res = await fetch('/api/store/gateways');
    if (res.ok) {
      const serverGateways = await res.json();
      if (serverGateways && serverGateways.mercadoPago) {
        localStorage.setItem(STORAGE_KEYS.GATEWAYS, JSON.stringify(serverGateways));
        window.dispatchEvent(new CustomEvent('h2derm_gateways_updated', { detail: serverGateways }));
        return serverGateways;
      }
    }
  } catch {}
  return null;
};

// Cart State Persistence
export interface CartState {
  isCartEmpty: boolean;
  cartCount: number;
  selectedPackId: string;
}

export const getStoredCart = (): CartState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    if (!raw) {
      return { isCartEmpty: false, cartCount: 1, selectedPackId: 'pack-2' };
    }
    const parsed = JSON.parse(raw);
    const isCartEmpty = Boolean(parsed.isCartEmpty);
    const cartCount = isCartEmpty ? 0 : (typeof parsed.cartCount === 'number' && parsed.cartCount >= 0 ? parsed.cartCount : 1);
    const selectedPackId = typeof parsed.selectedPackId === 'string' && parsed.selectedPackId ? parsed.selectedPackId : 'pack-2';
    return { isCartEmpty, cartCount, selectedPackId };
  } catch {
    return { isCartEmpty: false, cartCount: 1, selectedPackId: 'pack-2' };
  }
};

export const saveStoredCart = (cart: CartState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('h2derm_cart_updated', { detail: cart }));
  } catch (err) {
    console.error('Error saving cart state', err);
  }
};

export const getStoreMedia = (): MediaItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEDIA);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    return DEFAULT_MEDIA;
  } catch {
    return DEFAULT_MEDIA;
  }
};

export const saveStoreMedia = (media: MediaItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
  } catch (err) {
    console.warn('LocalStorage lleno, persistiendo en IndexedDB...', err);
  }
  // Always persist in IndexedDB for large media support
  saveMediaToIndexedDB(media);
  window.dispatchEvent(new CustomEvent('h2derm_media_updated', { detail: media }));

  // Asynchronously sync to server
  fetch('/api/store/media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(media)
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      if (data.media) {
        localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(data.media));
        saveMediaToIndexedDB(data.media);
        window.dispatchEvent(new CustomEvent('h2derm_media_updated', { detail: data.media }));
      }
    }
  }).catch(() => {});

  fetch('/api/store/save-defaults', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ media })
  }).catch(() => {});
};

export const getStoreReviews = (): ReviewItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!raw) return DEFAULT_REVIEWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_REVIEWS;
  } catch {
    return DEFAULT_REVIEWS;
  }
};

export const saveStoreReviews = (reviews: ReviewItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  window.dispatchEvent(new CustomEvent('h2derm_reviews_updated', { detail: reviews }));
};

export const addReview = (review: Omit<ReviewItem, 'id' | 'likes'>): ReviewItem => {
  const current = getStoreReviews();
  const newReview: ReviewItem = {
    ...review,
    id: `rev-${Date.now()}`,
    likes: 1
  };
  const updated = [newReview, ...current];
  saveStoreReviews(updated);
  return newReview;
};

export const getStoreOrders = (): OrderItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_ORDERS;
  } catch {
    return DEFAULT_ORDERS;
  }
};

export const saveStoreOrders = (orders: OrderItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent('h2derm_orders_updated', { detail: orders }));
};

export const createOrder = (orderData: Omit<OrderItem, 'id' | 'trackingCode' | 'createdAt' | 'updatedAt' | 'statusHistory'>): OrderItem => {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const trackingCode = `H2D-${randomSuffix}`;
  const now = new Date().toISOString();
  const nowFormatted = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) + ' ' + 
                       new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs';

  const newOrder: OrderItem = {
    ...orderData,
    id: `ord-${Date.now()}`,
    trackingCode,
    carrier: 'Andreani Express & Correo Argentino',
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      {
        status: 'confirmed',
        title: 'Pedido Registrado con Éxito',
        description: orderData.paymentMethod === 'contraentrega' 
          ? 'Pedido listo para despacho contraentrega. Abonás al recibir.'
          : orderData.paymentMethod === 'transferencia'
          ? 'Pedido reservado a la espera de confirmación de transferencia.'
          : 'Pago procesado exitosamente por Mercado Pago.',
        timestamp: nowFormatted
      }
    ]
  };

  const currentOrders = getStoreOrders();
  const updatedOrders = [newOrder, ...currentOrders];
  saveStoreOrders(updatedOrders);

  // Update analytics
  recordOrderAnalytics(newOrder.totalPrice);

  return newOrder;
};

export const updateOrderStatus = (
  orderId: string, 
  newShippingStatus: OrderItem['shippingStatus'],
  newPaymentStatus?: OrderItem['paymentStatus'],
  customNote?: string
): OrderItem | null => {
  const orders = getStoreOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return null;

  const current = orders[index];
  const nowFormatted = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) + ' ' + 
                       new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs';

  const statusTitles: Record<string, string> = {
    confirmed: 'Pedido Confirmado',
    preparing: 'Empaquetado en Laboratorio H2derm',
    shipped: 'Despachado en Sucursal Logística',
    in_transit: 'En Camino a Domicilio',
    delivered: 'Entregado al Cliente',
    cancelled: 'Pedido Cancelado'
  };

  const updatedOrder: OrderItem = {
    ...current,
    shippingStatus: newShippingStatus,
    paymentStatus: newPaymentStatus || current.paymentStatus,
    updatedAt: new Date().toISOString(),
    statusHistory: [
      ...current.statusHistory,
      {
        status: newShippingStatus,
        title: statusTitles[newShippingStatus] || 'Actualización de Envío',
        description: customNote || `El estado del envío cambió a ${statusTitles[newShippingStatus]}`,
        timestamp: nowFormatted
      }
    ]
  };

  orders[index] = updatedOrder;
  saveStoreOrders(orders);
  return updatedOrder;
};

export const findOrderByTracking = (query: string): OrderItem | null => {
  const clean = query.trim().toUpperCase();
  const orders = getStoreOrders();
  return orders.find(
    o => o.trackingCode.toUpperCase() === clean || 
         o.email.toLowerCase() === query.trim().toLowerCase() ||
         o.phone.replace(/\D/g, '').includes(query.replace(/\D/g, ''))
  ) || null;
};

export const getPaymentGateways = (): PaymentGatewaysSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GATEWAYS);
    if (!raw) return DEFAULT_GATEWAYS;
    return { ...DEFAULT_GATEWAYS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_GATEWAYS;
  }
};

export const savePaymentGateways = (gateways: PaymentGatewaysSettings): void => {
  localStorage.setItem(STORAGE_KEYS.GATEWAYS, JSON.stringify(gateways));
  window.dispatchEvent(new CustomEvent('h2derm_gateways_updated', { detail: gateways }));

  fetch('/api/store/gateways', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gateways)
  }).catch(() => {});

  fetch('/api/store/save-defaults', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gateways })
  }).catch(() => {});
};

// Upload image to server filesystem so it persists universally on Render and all devices
export const uploadImageToServer = async (fileOrBase64: File | string, prefix = 'img'): Promise<string> => {
  let base64String = '';
  if (typeof fileOrBase64 === 'string') {
    base64String = fileOrBase64;
  } else {
    base64String = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 1400;
          let { width, height } = img;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBase64);
    });
  }

  // If already a server relative URL (e.g. /uploads/...), return as is
  if (base64String.startsWith('/uploads/')) return base64String;

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64String, prefix })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.url) return data.url;
    }
  } catch (err) {
    console.warn('Server upload failed, falling back to local storage URL:', err);
  }

  return base64String;
};

// MERCADO PAGO: Checkout Pro Preference Request
export interface CreatePreferenceParams {
  packId?: string;
  packTitle: string;
  unitPrice: number;
  quantity: number;
  orderId: string;
  payer: {
    name: string;
    email: string;
    phone: string;
    street: string;
    number: string;
    city: string;
    zipCode: string;
  };
  returnUrl?: string;
}

export const createMercadoPagoPreference = async (params: CreatePreferenceParams): Promise<{
  success: boolean;
  init_point?: string;
  preferenceId?: string;
  error?: string;
  message?: string;
  mode?: string;
}> => {
  try {
    const res = await fetch('/api/mercadopago/create-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: 'network_error',
      message: 'No se pudo conectar con el servidor para iniciar Mercado Pago.'
    };
  }
};

// Sync all local configurations, media, and images directly to Render server files
export const syncAllToServer = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const content = getStoreContent();
    const media = getStoreMedia();
    const gateways = getPaymentGateways();

    const [resContent, resMedia, resGateways, resDefaults] = await Promise.all([
      fetch('/api/store/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      }),
      fetch('/api/store/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(media)
      }),
      fetch('/api/store/gateways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gateways)
      }),
      fetch('/api/store/save-defaults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, media, gateways })
      })
    ]);

    if (resContent.ok) {
      const dataContent = await resContent.json();
      if (dataContent.content) {
        localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(dataContent.content));
        saveContentToIndexedDB(dataContent.content);
        window.dispatchEvent(new CustomEvent('h2derm_content_updated', { detail: dataContent.content }));
      }
    }

    if (resMedia.ok) {
      const dataMedia = await resMedia.json();
      if (dataMedia.media) {
        localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(dataMedia.media));
        saveMediaToIndexedDB(dataMedia.media);
        window.dispatchEvent(new CustomEvent('h2derm_media_updated', { detail: dataMedia.media }));
      }
    }

    return { 
      success: true, 
      message: '¡Toda la tienda (imágenes, textos y pasarelas) se sincronizó con éxito en el servidor de Render!' 
    };
  } catch (err: any) {
    return { 
      success: false, 
      message: 'Error al sincronizar con el servidor: ' + (err.message || 'Desconocido') 
    };
  }
};

export const getAnalytics = (): StoreAnalytics => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (!raw) return DEFAULT_ANALYTICS;
    return { ...DEFAULT_ANALYTICS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ANALYTICS;
  }
};

export const recordVisit = (): void => {
  const current = getAnalytics();
  current.totalVisits += 1;
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(current));
};

export const recordAddToCart = (): void => {
  const current = getAnalytics();
  current.addToCartCount += 1;
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(current));
};

export const recordInitiateCheckout = (): void => {
  const current = getAnalytics();
  current.initiatedCheckouts += 1;
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(current));
};

export const recordOrderAnalytics = (amount: number): void => {
  const current = getAnalytics();
  current.completedOrders += 1;
  current.totalRevenue += amount;
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(current));
};

export const getAdminPin = (): string => {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || 'admin123';
};

export const setAdminPin = (newPin: string): void => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin);
};

export const isPushSubscribed = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.PUSH_SUBSCRIBED) === 'true';
};

export const setPushSubscribed = (val: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.PUSH_SUBSCRIBED, val ? 'true' : 'false');
};
