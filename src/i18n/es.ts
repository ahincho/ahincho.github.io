import type { JobCopy, StudyCopy } from '../domain/experience';
import type { JobId, StudyId } from '../data/experience';

export const es = {
	meta: {
		title: 'Angel Hincho — Full Stack, DevSecOps & AI Engineer',
		description:
			'Portafolio de Angel Hincho: más de 5 años construyendo plataformas educativas, e-commerce y sistemas multi-país con Spring Boot, NestJS, React, Angular y AWS. Enfocado en IA Generativa y MLOps.',
		ogLocale: 'es_PE',
		ogImageAlt: 'Angel Hincho — Full Stack, DevSecOps & AI Engineer, Arequipa, Perú',
		siteName: 'Portafolio de Angel Hincho',
	},
	nav: {
		skipToContent: 'Saltar al contenido',
		ariaSections: 'Secciones del portafolio',
		themeToggle: 'Cambiar tema claro/oscuro',
		menuToggle: 'Abrir el menú de secciones',
		langSwitcher: 'Cambiar idioma',
		links: [
			{ href: '/#about', label: 'Sobre mí' },
			{ href: '/#projects', label: 'Proyectos' },
			{ href: '/#experience', label: 'Experiencia' },
			{ href: '/#skills', label: 'Habilidades' },
			{ href: '/#contact', label: 'Contacto' },
		],
	},
	hero: {
		location: 'Arequipa, Perú',
		role: 'Full Stack, DevSecOps & AI Engineer',
		lead: 'Más de 5 años construyendo plataformas educativas, e-commerce y sistemas multi-país — del diseño de la arquitectura al pipeline que la lleva a producción. Hoy, enfocado en IA Generativa y MLOps.',
		ctaProject: 'Ver mis proyectos',
		ctaContact: 'Contáctame',
		githubAria: 'GitHub de Angel Hincho',
		linkedinAria: 'LinkedIn de Angel Hincho',
		whoami: 'Angel Hincho · Bachiller en Ing. de Sistemas',
		now: 'Especialización IA Generativa & MLOps — UNI',
		visits: { one: 'visita única', other: 'visitas únicas' },
		downloads: { one: 'descarga del CV', other: 'descargas del CV' },
		questions: { one: 'pregunta al asistente', other: 'preguntas al asistente' },
		stats: [
			{ value: '5+', label: 'años de experiencia' },
			{ value: '300k+', label: 'usuarios en producción' },
			{ value: '30+', label: 'microservicios serverless' },
			{ value: '4', label: 'países con despliegues' },
		],
	},
	about: {
		eyebrow: 'sobre mí',
		title: 'Ingeniería de punta a punta',
		paragraphs: [
			'Soy bachiller en Ingeniería de Sistemas por la UNSA (Arequipa) y llevo más de 5 años construyendo software que llega a producción: plataformas educativas con cientos de miles de usuarios, soluciones de e-commerce y sistemas de ventas desplegados en varios países. Me muevo con la misma comodidad en el backend (Spring Boot, NestJS), el frontend (React, Angular) y el pipeline que lo lleva todo a la nube.',
			'Mi sello es el enfoque <strong>DevSecOps</strong>: pipelines de CI/CD con análisis de seguridad SAST/DAST, calidad medible con quality gates y observabilidad distribuida. Creo en acelerar el <em>time to market</em> sin hipotecar la calidad del software.',
			'Hoy mi energía está en la <strong>IA Generativa y MLOps</strong>: termino la especialización en la UNI mientras construyo Spark Match, un copiloto de orientación vocacional basado en agentes LLM sobre AWS Bedrock.',
		],
		focusTitle: 'Enfoque actual',
		focus: [
			'IA Generativa & MLOps',
			'Agentes LLM (LangChain · LangGraph)',
			'Arquitecturas serverless y event-driven',
			'AI-SDLC: desarrollo asistido por agentes',
		],
	},
	projects: {
		index: {
			title: 'Proyectos | Angel Hincho',
			description:
				'Proyectos de Angel Hincho: Spark Match, un agente de orientación vocacional con IA Generativa; Nova, un meta-framework para microservicios empresariales; y el asistente con IA de este portafolio.',
			heading: 'Proyectos',
			back: 'Volver al portafolio',
			read: 'Leer el caso de estudio',
		},
		all: 'Todos los proyectos',
		eyebrow: 'lo que construyo',
		title: 'Proyectos destacados',
		lead: 'Tres cosas que diseñé y construí de punta a punta. Una de ellas está funcionando en esta misma página.',
		sparkMatch: {
			eyebrow: 'proyecto destacado',
			title: 'Spark Match',
			tagline: 'Copiloto de orientación vocacional con IA Generativa',
			badgeTfp: 'TFP · UNI 2026',
			badgeStatus: 'En desarrollo activo',
			description:
				'Una plataforma que acompaña a estudiantes a descubrir su camino profesional conversando con un agente inteligente: evalúa su perfil vocacional, calcula la afinidad con carreras y construye planes de acción con recursos reales — no un chatbot, sino un agente con razonamiento multi-paso, memoria y delegación a subagentes.',
			figures: [
				{ value: '550+', label: 'carreras analizadas' },
				{ value: '1.000+', label: 'instituciones' },
				{ value: '25', label: 'regiones del Perú' },
			],
			figuresSource: 'Datos oficiales de Ponte en Carrera · MINEDU Perú',
			archAria:
				'Arquitectura: Angular se comunica por AG-UI con el deep agent, que usa AWS Bedrock',
			subagentsLabel: 'subagentes',
			infraLabel: 'infra',
			highlights: [
				'Deep agent con 3 subagentes especializados y memoria de perfil del estudiante (langmem), basado en el modelo vocacional RIASEC de Holland.',
				'Backend serverless con DDD y arquitectura orientada a eventos sobre Lambda y EventBridge; frontend Angular 22 con Signals e i18n.',
				'Infraestructura multi-ambiente (dev/prod) con Terraform puro y CI/CD vía OIDC — cero access keys — con quality gates y análisis de seguridad.',
				'MLOps de verdad: datasets versionados con DVC, experimentos trazados con MLflow y artículo académico con build automatizado en LaTeX.',
			],
			video: {
				label: 'Demo en video',
				caption:
					'Presentación final del programa de especialización en IA Generativa y MLOps de la UNI, con la plataforma en funcionamiento.',
				play: 'Reproducir la demo de Spark Match',
				iframeTitle: 'Demo de Spark Match',
			},
			cta: 'Ver el caso de estudio',
			back: 'Volver al portafolio',
			detailMeta: {
				title: 'Spark Match — Caso de estudio | Angel Hincho',
				description:
					'Cómo diseñé y construí Spark Match: un agente de orientación vocacional con LangChain Deep Agents sobre AWS Bedrock, backend serverless en Lambda e infraestructura con Terraform.',
			},
			shotsLabel: 'La plataforma',
			shots: [
				'El agente delega en subagentes especializados y muestra cada paso mientras razona.',
				'Cada carrera se contrasta con cifras oficiales del MINEDU: tasa de admisión, duración, costo anual e ingreso mensual al egresar.',
				'El informe se exporta en PDF con el detalle de cada programa recomendado.',
				'Evaluación automatizada en LangSmith: evaluadores propios y comparación entre modelos.',
			],
			roleLabel: 'Mi rol:',
			roleText:
				'lideré el diseño y la construcción de la plataforma de punta a punta — infraestructura, CI/CD, backend, frontend y el deep agent (400+ commits) — junto a mi equipo de apoyo en la investigación académica.',
			links: [
				{ href: 'https://github.com/spark-match', label: 'Organización en GitHub' },
				{ href: 'https://github.com/spark-match/spark-match-08-deep-agent', label: 'Deep agent' },
				{
					href: 'https://github.com/spark-match/spark-match-02-infrastructure',
					label: 'Infraestructura',
				},
			],
		},
		nova: {
			eyebrow: 'plataforma propia',
			title: 'Nova',
			tagline: 'Meta-framework para microservicios empresariales',
			badgeKind: 'Plataforma propia',
			badgeStatus: 'En construcción',
			description:
				'La fontanería que toda empresa reescribe en cada servicio — estándar de API, observabilidad, seguridad y convenciones de build — resuelta una vez, versionada y publicada. Un núcleo en Java puro, sin dependencias de framework, y encima adaptadores finos para Spring Boot, Quarkus y NestJS.',
			figures: [
				{ value: '30', label: 'repositorios públicos' },
				{ value: '3', label: 'stacks soportados' },
				{ value: '7', label: 'librerías de núcleo sin framework' },
			],
			archAria:
				'Arquitectura en capas: un núcleo en Java puro, adaptadores por stack y el microservicio que los consume',
			layersLabel: 'Cómo se apila',
			layers: [
				{
					name: 'núcleo',
					note: 'Java puro, sin framework',
					items: [
						'api-standard',
						'mask-utils',
						'observability-utils',
						'date-utils',
						'mapper-utils',
						'keycloak',
						'architecture-rules',
					],
				},
				{
					name: 'adaptadores',
					note: 'un cableado por stack',
					items: ['Spring Boot starters', 'Quarkus extensions', 'NestJS starters'],
				},
				{
					name: 'tu servicio',
					note: 'arranca ya configurado',
					items: ['arquetipos Maven', 'templates Gradle', 'CI/CD reutilizable'],
				},
			],
			highlights: [
				'El núcleo no depende de ningún framework: el estándar de API, el enmascarado de datos sensibles, la observabilidad y Keycloak son Java puro; los starters de Spring Boot y las extensiones de Quarkus solo los cablean.',
				'La arquitectura se verifica sola: pruebas con ArchUnit que imponen los estilos Layered, Clean y Hexagonal a quien construya sobre la plataforma.',
				'Tres stacks desde un único BOM — Spring Boot, Quarkus y NestJS — con las versiones centralizadas en un solo sitio.',
				'Observabilidad de primera clase: Four Golden Signals y trazas con OpenTelemetry ya cableadas en el starter, no añadidas después.',
				'Cada decisión queda escrita como ADR, con versionado semántico y una guía de evaluación de madurez por módulo.',
			],
			roleLabel: 'Mi rol:',
			roleText:
				'diseño y construyo la plataforma entera — la arquitectura, los 30 repositorios, los pipelines reutilizables y la documentación.',
			cta: 'Ver el caso de estudio',
			back: 'Volver al portafolio',
			detailMeta: {
				title: 'Nova — Caso de estudio | Angel Hincho',
				description:
					'Meta-framework para microservicios empresariales: núcleo en Java puro, adaptadores para Spring Boot, Quarkus y NestJS, y arquitectura verificada con ArchUnit.',
			},
			links: [
				{
					href: 'https://github.com/ahincho?tab=repositories&q=nova',
					label: 'Los 30 repositorios',
				},
				{
					href: 'https://github.com/ahincho/nova-java-api-standard',
					label: 'Núcleo: estándar de API',
				},
				{
					href: 'https://github.com/ahincho/nova-java-architecture-rules',
					label: 'Reglas de arquitectura',
				},
				{ href: 'https://github.com/ahincho/nova-docs', label: 'ADRs y documentación' },
			],
		},
		assistant: {
			eyebrow: 'herramienta propia',
			title: 'Asistente del portafolio',
			tagline: 'Un chatbot que no puede inventarse mi experiencia',
			badgeKind: 'En producción',
			badgeStatus: 'Vivo en esta web',
			description:
				'El chat que espera en la esquina de esta página. Responde únicamente con lo que dice este portafolio: el corpus se genera en cada build desde las mismas fuentes que renderizan la web, viaja entero en el prompt y no hay nada más. Corre sobre un Worker de Cloudflare con límites de abuso, guardarraíles contra inyección de prompts y dos modelos compitiendo por contestar primero.',
			figures: [
				{ value: '0,9 s', label: 'pregunta repetida' },
				{ value: '3,8 s', label: 'pregunta nueva' },
				{ value: '$0', label: 'coste al mes' },
			],
			answered: { one: 'pregunta respondida', other: 'preguntas respondidas' },
			archAria:
				'El camino de una pregunta: del navegador al Worker, de ahí a la pasarela y al modelo',
			flowLabel: 'El camino de una pregunta',
			flow: [
				{
					name: 'el navegador',
					note: 'widget propio, sin framework',
					items: ['la pregunta', '4 turnos de contexto', 'lee la respuesta a trozos'],
				},
				{
					name: 'el Worker',
					note: 'Cloudflare, en el borde',
					items: [
						'12 por visitante/hora',
						'90 en total/hora',
						'arma el prompt',
						'filtra la salida',
					],
				},
				{
					name: 'la pasarela',
					note: 'AI Gateway',
					items: ['caché de una semana', 'registro para revisión', 'dos modelos a la vez'],
				},
				{
					name: 'el modelo',
					note: 'Gemini Flash-Lite, capa gratuita',
					items: ['prosa anclada al documento'],
				},
			],
			highlights: [
				'No puede afirmar nada que esta web ya no diga: el corpus se genera en el build desde las mismas fuentes que renderizan el sitio, así que publicar es la única manera de cambiar lo que el asistente sabe.',
				'Dos capas contra la inyección de prompts. El sistema ignora las instrucciones que vengan dentro de la pregunta, y un filtro de salida borra cualquier enlace o correo que no sea mío antes de llegar a la pantalla — aunque el modelo se haya dejado convencer.',
				'Ese filtro sobrevive al streaming, que es la parte difícil: un enlace solo se puede juzgar entero, así que nada se publica hasta que ha empezado la palabra siguiente. La propiedad se verifica contra todos los cortes posibles del texto, no contra uno elegido.',
				'Cuando el primer modelo tarda más de 4 segundos, el segundo arranca en paralelo y gana el que conteste antes. La media bajó de 8,3 s a 3,8 s y el peor caso de 13,0 s a 5,8 s.',
				'Una pregunta repetida vuelve de la caché en menos de un segundo sin gastar cuota del proveedor, y publicar el sitio invalida las entradas por sí solo porque el corpus forma parte de la clave.',
				'Coste cero y sin tarjeta: Workers, Durable Objects con SQLite, AI Gateway y la capa gratuita de Google AI Studio.',
			],
			roleLabel: 'Mi rol:',
			roleText:
				'lo diseñé y construí entero — el widget, el endpoint, los guardarraíles, las mediciones que decidieron cada ajuste y el ADR que explica por qué.',
			cta: 'Ver el caso de estudio',
			back: 'Volver al portafolio',
			detailMeta: {
				title: 'Asistente del portafolio — Caso de estudio | Angel Hincho',
				description:
					'Chatbot anclado al contenido del portafolio: corpus generado en el build, guardarraíles contra inyección de prompts, dos modelos en paralelo y caché. Sobre Cloudflare Workers, coste cero.',
			},
			links: [
				{
					href: 'https://github.com/ahincho/ahincho.github.io/blob/main/docs/adr/0002-portfolio-chatbot.md',
					label: 'La decisión escrita (ADR)',
				},
				{
					href: 'https://github.com/ahincho/ahincho.github.io/tree/main/chat',
					label: 'El Worker del asistente',
				},
				{
					href: 'https://github.com/ahincho/ahincho.github.io/blob/main/chat/src/answer.ts',
					label: 'El filtro de salida y sus pruebas',
				},
			],
		},
	},
	experience: {
		eyebrow: 'trayectoria',
		title: 'Experiencia',
		present: 'Actualidad',
		marketsLabel: 'Mercados:',
		cities: {} as Record<string, string>,
		modality: { onsite: 'Presencial', hybrid: 'Híbrido', remote: 'Remoto' },
		employment: { staff: 'Planilla', freelance: 'Freelance', internship: 'Prácticas' },
		industry: {
			education: 'Educación',
			telecom: 'Telecomunicaciones',
			retail: 'Retail',
			hr: 'Recursos Humanos',
			academia: 'Academia',
		},
		jobs: {
			utp: {
				role: 'FullStack & DevSecOps Engineer',
				bullets: [
					'Desarrollo de UTP+Class, la plataforma de aprendizaje oficial usada por más de 300 000 alumnos, sobre 20+ microservicios orientados a eventos.',
					'Estandaricé pipelines de CI/CD con pruebas SAST/DAST y lideré la migración integral de Azure DevOps a GitHub sin interrupciones operativas.',
					'Implanté desarrollo asistido por agentes de codificación (AI-SDLC), reduciendo un 30% los tiempos de análisis, desarrollo y pruebas.',
				],
			},
			claro: {
				role: 'Senior FullStack Engineer',
				bullets: [
					'Plataforma de ventas convergente multi-país: 30+ microservicios serverless desplegados en 4 países y 12 ambientes.',
					'Lideré la migración de la arquitectura mono-país a multi-país y la modernización hacia NestJS, micro-frontends en Angular e Ionic.',
					'Pipelines centralizados y reutilizables con GitHub Actions, escaneo con CodeQL y despliegues automatizados con Terraform y AWS SAM.',
				],
			},
			falabella: {
				role: 'Fullstack Engineer',
				bullets: [
					'Funcionalidades para Pantalla Única y Servicio Técnico (SerTec), con usuarios en Perú, Colombia y Chile.',
					'Integré Salesforce y sistemas back office propietarios para una gestión centralizada de ventas en una sola interfaz.',
				],
			},
			joyit: {
				role: 'Desarrollador Backend',
				bullets: [
					'Applicant Tracking System: gestión de ofertas, postulaciones y recomendación de candidatos para las vacantes.',
					'Microservicios con DDD, mensajería y colas de eventos; autenticación y autorización con Keycloak.',
					'Facilité Scrum para un equipo de 10 personas, liderando ceremonias y documentación de onboarding.',
				],
			},
			unsa: {
				role: 'Investigador y Desarrollador',
				bullets: [
					'Software de escritorio y videojuegos en C#/.NET; aplicaciones web y APIs REST con Spring Boot.',
					'Investigación en Ingeniería de Software con producción de artículos técnicos.',
				],
			},
			bytexbyte: {
				role: 'Desarrollador FullStack',
				bullets: [
					'Sistema de punto de venta (POS) para retail, con varios clientes y sus sedes operando sobre la misma plataforma.',
					'Participé en la migración del cliente de escritorio de JavaFX a .NET Framework 4.8 con Windows Forms.',
					'Segunda migración hacia una aplicación web con Spring Boot y React, con arquitectura multi-tenant por cliente y sede.',
				],
			},
		} satisfies Record<JobId, JobCopy>,
		educationTitle: 'Formación',
		studies: {
			'unsa-degree': { degree: 'Bachiller en Ingeniería de Sistemas' },
			'uni-specialization': { degree: 'Especialización en IA Generativa & MLOps' },
			'unsa-language-centre': { degree: 'Inglés — nivel intermedio' },
		} satisfies Record<StudyId, StudyCopy>,
	},
	skills: {
		eyebrow: 'stack',
		title: 'Habilidades',
		groups: [
			{
				name: 'Backend',
				items: [
					'Java',
					'Spring Boot',
					'Kotlin',
					'Quarkus',
					'Node.js',
					'NestJS',
					'Python',
					'FastAPI',
					'.NET',
				],
			},
			{ name: 'Frontend', items: ['TypeScript', 'React', 'Angular', 'Vue', 'Ionic', 'Astro'] },
			{
				name: 'DevSecOps & Cloud',
				items: [
					'AWS',
					'Azure',
					'GCP',
					'Docker',
					'Kubernetes',
					'Terraform',
					'GitHub Actions',
					'SonarCloud',
					'SAST/DAST',
					'OpenTelemetry',
					'Keycloak',
				],
			},
			{
				name: 'IA & MLOps',
				items: [
					'LangChain',
					'LangGraph',
					'Deep Agents',
					'RAG',
					'Amazon Bedrock',
					'Azure OpenAI',
					'MLflow',
					'DVC',
					'Hugging Face',
				],
			},
			{ name: 'Bases de datos', items: ['PostgreSQL', 'MySQL', 'DynamoDB', 'SQLite'] },
			{
				name: 'Prácticas',
				items: ['Scrum', 'DDD', 'Event-Driven', 'Micro-frontends', 'AI-SDLC', 'OpenAPI'],
			},
		],
	},
	contact: {
		eyebrow: 'contacto',
		title: '¿Construimos algo juntos?',
		lead: 'Estoy abierto a nuevos retos: roles full stack, DevSecOps o proyectos con IA. Escríbeme y conversemos.',
		emailCta: 'Enviar correo',
		cvCta: 'Descargar CV',
	},
	notFound: {
		title: '404 — Página no encontrada | Angel Hincho',
		description: 'La página que buscas no existe en este portafolio.',
		heading: 'Esta página no existe',
		lead: 'El enlace puede estar roto o la dirección mal escrita. Desde el inicio llegas a todo lo que hay publicado.',
		home: 'Volver al inicio',
		project: 'Ver mis proyectos',
	},
	chat: {
		open: 'Pregúntale a la IA',
		close: 'Cerrar el asistente',
		title: 'Asistente con IA',
		subtitle: 'Hecho por mí. Responde solo con lo que hay en esta web.',
		greeting:
			'¡Hola! Soy el asistente de Angel. Puedo responderte sobre su experiencia, sus proyectos y su stack. ¿Qué necesitas saber?',
		suggestions: [
			'¿Qué experiencia tiene liderando migraciones?',
			'¿Ha trabajado en remoto para otros países?',
			'¿Qué hizo exactamente en Spark Match?',
			'¿Cuál es su nivel de inglés?',
		],
		placeholder: 'Escribe tu pregunta…',
		send: 'Enviar',
		thinking: 'Pensando…',
		error: 'Algo falló al responder. Vuelve a intentarlo en un momento.',
		exhausted:
			'He alcanzado mi límite de consultas por hoy. Escríbele directamente desde la sección de contacto.',
		preview:
			'Todavía estoy en construcción: mi motor de respuestas aún no está conectado. Mientras tanto puedes escribirle directamente desde la sección de contacto.',
		disclaimer: 'Respuestas generadas por IA.',
		status: {
			online: 'En línea',
			offline: 'Sin conectar',
			trouble: 'Con problemas',
		},
		privacy: {
			summary: 'Privacidad',
			body: [
				'Lo que escribes aquí y lo que responde el asistente quedan registrados en Cloudflare AI Gateway. Los reviso cada semana para detectar anomalías y mejorar el servicio, y los más antiguos se borran automáticamente.',
				'El modelo lo provee Google en su capa gratuita, y eso implica que Google usa lo que escribes para mejorar sus productos y que sus revisores humanos pueden leerlo. No escribas datos personales, confidenciales ni de terceros.',
				'No guardo tu nombre ni se crea ninguna cuenta. Para limitar el abuso uso un código derivado de tu dirección y tu navegador con una clave secreta, del que no se puede volver a la dirección original.',
				'Tratamiento conforme a la Ley N.º 29733 de Protección de Datos Personales. Para acceder, rectificar, cancelar u oponerte, escribe a ahincho@unsa.edu.pe.',
			],
		},
	},
	reactions: {
		label: 'Me gusta',
	},
	footer: {
		rights: '© 2026 Angel Hincho — Arequipa, Perú',
		madeWith: 'Hecho con',
		privacy: 'Las visitas y las reacciones se cuentan sin cookies ni datos personales.',
	},
};
