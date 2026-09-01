export const es = {
	meta: {
		title: 'Angel Hincho — Full Stack & DevSecOps Engineer',
		description:
			'Portafolio de Angel Hincho: más de 5 años construyendo plataformas educativas, e-commerce y sistemas multi-país con Spring Boot, NestJS, React, Angular y AWS. Enfocado en IA Generativa y MLOps.',
		ogLocale: 'es_PE',
	},
	nav: {
		ariaSections: 'Secciones del portafolio',
		themeToggle: 'Cambiar tema claro/oscuro',
		langSwitcher: 'Cambiar idioma',
		links: [
			{ href: '/#about', label: 'Sobre mí' },
			{ href: '/#project', label: 'Proyecto' },
			{ href: '/#experience', label: 'Experiencia' },
			{ href: '/#skills', label: 'Habilidades' },
			{ href: '/#contact', label: 'Contacto' },
		],
	},
	hero: {
		location: 'Arequipa, Perú',
		role: 'Full Stack & DevSecOps Engineer',
		lead: 'Más de 5 años construyendo plataformas educativas, e-commerce y sistemas multi-país — del diseño de la arquitectura al pipeline que la lleva a producción. Hoy, enfocado en IA Generativa y MLOps.',
		ctaProject: 'Ver proyecto destacado',
		ctaContact: 'Contáctame',
		githubAria: 'GitHub de Angel Hincho',
		linkedinAria: 'LinkedIn de Angel Hincho',
		whoami: 'Angel Hincho · Ingeniero de Sistemas',
		now: 'Especialización IA Generativa & MLOps — UNI',
		visits: 'visitas únicas',
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
	project: {
		eyebrow: 'proyecto destacado',
		title: 'Spark Match',
		tagline: 'Copiloto de orientación vocacional con IA Generativa',
		badgeTfp: 'TFP · UNI 2026',
		badgeStatus: 'En desarrollo activo',
		description:
			'Una plataforma que acompaña a estudiantes a descubrir su camino profesional conversando con un agente inteligente: evalúa su perfil vocacional, calcula la afinidad con carreras y construye planes de acción con recursos reales — no un chatbot, sino un agente con razonamiento multi-paso, memoria y delegación a subagentes.',
		archAria: 'Arquitectura: Angular se comunica por AG-UI con el deep agent, que usa AWS Bedrock',
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
			alt: 'Página de inicio de Spark Match',
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
			'Cada carrera se contrasta con cifras oficiales: tasa de admisión, duración, costo e ingreso al egresar.',
			'El informe se exporta en PDF con el detalle de cada programa recomendado.',
			'Evaluación automatizada en LangSmith: evaluadores propios y comparación entre modelos.',
		],
		roleLabel: 'Mi rol:',
		roleText:
			'lideré el diseño y la construcción de la plataforma de punta a punta — infraestructura, CI/CD, backend, frontend y el deep agent (400+ commits) — junto a mi equipo de apoyo en la investigación académica.',
		links: [
			{ href: 'https://github.com/spark-match', label: 'Organización en GitHub' },
			{ href: 'https://github.com/spark-match/spark-match-08-deep-agent', label: 'Deep agent' },
			{ href: 'https://github.com/spark-match/spark-match-02-infrastructure', label: 'Infraestructura' },
		],
	},
	experience: {
		eyebrow: 'trayectoria',
		title: 'Experiencia',
		jobs: [
			{
				company: 'Universidad Tecnológica del Perú (UTP)',
				role: 'FullStack & DevSecOps Engineer',
				meta: 'Ene 2024 — Mar 2026 · Lima',
				bullets: [
					'Desarrollo de UTP+Class, la plataforma de aprendizaje oficial usada por más de 300 000 alumnos, sobre 20+ microservicios orientados a eventos.',
					'Estandaricé pipelines de CI/CD con pruebas SAST/DAST y lideré la migración integral de Azure DevOps a GitHub sin interrupciones operativas.',
					'Implanté desarrollo asistido por agentes de codificación (AI-SDLC), reduciendo un 30% los tiempos de análisis, desarrollo y pruebas.',
				],
				tags: ['Java', 'Spring Boot', 'React', 'NestJS', 'AWS', 'Azure', 'SonarCloud'],
			},
			{
				company: 'Claro (Centroamérica)',
				role: 'Senior FullStack Engineer · Freelance',
				meta: 'May 2025 — Ago 2026 · Remoto',
				bullets: [
					'Plataforma de ventas convergente multi-país: 30+ microservicios serverless desplegados en 4 países y 12 ambientes.',
					'Lideré la migración de la arquitectura mono-país a multi-país y la modernización hacia NestJS, micro-frontends en Angular e Ionic.',
					'Pipelines centralizados y reutilizables con GitHub Actions, escaneo con CodeQL y despliegues automatizados con Terraform y AWS SAM.',
				],
				tags: ['TypeScript', 'NestJS', 'Angular', 'Ionic', 'AWS', 'Terraform', 'DynamoDB'],
			},
			{
				company: 'Falabella',
				role: 'Fullstack Engineer · Freelance',
				meta: 'Mar 2024 — Ago 2024 · Remoto, Chile',
				bullets: [
					'Funcionalidades para Pantalla Única y Servicio Técnico (SerTec), con usuarios en Perú, Colombia y Chile.',
					'Integré Salesforce y sistemas back office propietarios para una gestión centralizada de ventas en una sola interfaz.',
				],
				tags: ['Java', 'Spring Boot', 'FastAPI', 'React', 'Angular', 'GCP', 'Kubernetes'],
			},
			{
				company: 'JoyIt',
				role: 'Desarrollador Backend',
				meta: 'Mar 2023 — Dic 2023 · Lima',
				bullets: [
					'Applicant Tracking System: gestión de ofertas, postulaciones y recomendación de candidatos para las vacantes.',
					'Microservicios con DDD, mensajería y colas de eventos; autenticación y autorización con Keycloak.',
					'Facilité Scrum para un equipo de 10 personas, liderando ceremonias y documentación de onboarding.',
				],
				tags: ['Java', 'Kotlin', 'Spring Boot', 'Quarkus', 'AWS', 'Keycloak'],
			},
			{
				company: 'Universidad Nacional de San Agustín (UNSA)',
				role: 'Investigador y Desarrollador · Prácticas',
				meta: 'Abr 2022 — Abr 2023 · Arequipa',
				bullets: [
					'Software de escritorio y videojuegos en C#/.NET; aplicaciones web y APIs REST con Spring Boot.',
					'Investigación en Ingeniería de Software con producción de artículos técnicos.',
				],
				tags: ['C#', '.NET', 'Java', 'Angular', 'PostgreSQL'],
			},
		],
		educationTitle: 'Formación',
		education: [
			{ school: 'UNSA', degree: 'Bachiller en Ingeniería de Sistemas', meta: '2020 — 2024 · GPA 3.7/4.0' },
			{ school: 'UNI', degree: 'Especialización en IA Generativa & MLOps', meta: '2026' },
			{ school: 'Centro de Idiomas UNSA', degree: 'Inglés — nivel intermedio', meta: '2021 — 2022' },
		],
	},
	skills: {
		eyebrow: 'stack',
		title: 'Habilidades',
		groups: [
			{ name: 'Backend', items: ['Java', 'Spring Boot', 'Kotlin', 'Quarkus', 'Node.js', 'NestJS', 'Python', 'FastAPI', '.NET'] },
			{ name: 'Frontend', items: ['TypeScript', 'React', 'Angular', 'Vue', 'Ionic', 'Astro'] },
			{ name: 'DevSecOps & Cloud', items: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'SonarCloud', 'SAST/DAST', 'OpenTelemetry', 'Keycloak'] },
			{ name: 'IA & MLOps', items: ['LangChain', 'LangGraph', 'Deep Agents', 'RAG', 'Amazon Bedrock', 'Azure OpenAI', 'MLflow', 'DVC', 'Hugging Face'] },
			{ name: 'Bases de datos', items: ['PostgreSQL', 'MySQL', 'DynamoDB', 'SQLite'] },
			{ name: 'Prácticas', items: ['Scrum', 'DDD', 'Event-Driven', 'Micro-frontends', 'AI-SDLC', 'OpenAPI'] },
		],
	},
	contact: {
		eyebrow: 'contacto',
		title: '¿Construimos algo juntos?',
		lead: 'Estoy abierto a nuevos retos: roles full stack, DevSecOps o proyectos con IA. Escríbeme y conversemos.',
		emailCta: 'Enviar correo',
		cvCta: 'Descargar CV',
	},
	footer: {
		rights: '© 2026 Angel Hincho — Arequipa, Perú',
		madeWith: 'Hecho con',
	},
};
