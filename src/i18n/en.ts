import type { Translations } from './index';

export const en: Translations = {
	meta: {
		title: 'Angel Hincho — Full Stack & DevSecOps Engineer',
		description:
			"Angel Hincho's portfolio: 5+ years building education platforms, e-commerce and multi-country systems with Spring Boot, NestJS, React, Angular and AWS. Focused on Generative AI and MLOps.",
		ogLocale: 'en_US',
		ogImageAlt: 'Angel Hincho — Full Stack & DevSecOps Engineer, Arequipa, Peru',
		siteName: "Angel Hincho's portfolio",
	},
	nav: {
		ariaSections: 'Portfolio sections',
		themeToggle: 'Toggle light/dark theme',
		menuToggle: 'Open the sections menu',
		langSwitcher: 'Switch language',
		links: [
			{ href: '/en/#about', label: 'About' },
			{ href: '/en/#projects', label: 'Projects' },
			{ href: '/en/#experience', label: 'Experience' },
			{ href: '/en/#skills', label: 'Skills' },
			{ href: '/en/#contact', label: 'Contact' },
		],
	},
	hero: {
		location: 'Arequipa, Peru',
		role: 'Full Stack & DevSecOps Engineer',
		lead: '5+ years building education platforms, e-commerce and multi-country systems — from architecture design to the pipeline that ships it to production. Currently focused on Generative AI and MLOps.',
		ctaProject: 'See my projects',
		ctaContact: 'Get in touch',
		githubAria: "Angel Hincho's GitHub",
		linkedinAria: "Angel Hincho's LinkedIn",
		whoami: 'Angel Hincho · BSc in Systems Engineering',
		now: 'Generative AI & MLOps specialization — UNI',
		visits: 'unique visits',
		stats: [
			{ value: '5+', label: 'years of experience' },
			{ value: '300k+', label: 'users in production' },
			{ value: '30+', label: 'serverless microservices' },
			{ value: '4', label: 'countries deployed' },
		],
	},
	about: {
		eyebrow: 'about me',
		title: 'End-to-end engineering',
		paragraphs: [
			"I hold a bachelor's degree in Systems Engineering from UNSA (Arequipa, Peru) and I've spent 5+ years building software that ships: education platforms with hundreds of thousands of users, e-commerce solutions and sales systems deployed across several countries. I'm equally at home in the backend (Spring Boot, NestJS), the frontend (React, Angular) and the pipeline that takes it all to the cloud.",
			'My hallmark is the <strong>DevSecOps</strong> approach: CI/CD pipelines with SAST/DAST security analysis, measurable quality through quality gates and distributed observability. I believe in accelerating time to market without mortgaging software quality.',
			"Today my energy goes into <strong>Generative AI and MLOps</strong>: I'm completing the specialization program at UNI while building Spark Match, a vocational guidance copilot powered by LLM agents on AWS Bedrock.",
		],
		focusTitle: 'Current focus',
		focus: [
			'Generative AI & MLOps',
			'LLM agents (LangChain · LangGraph)',
			'Serverless & event-driven architectures',
			'AI-SDLC: agent-assisted development',
		],
	},
	projects: {
		index: {
			title: 'Projects | Angel Hincho',
			description:
				"Angel Hincho's projects: Spark Match, a career guidance agent built with Generative AI, and Nova, a meta-framework for enterprise microservices.",
			heading: 'Projects',
			back: 'Back to the portfolio',
			read: 'Read the case study',
		},
		all: 'All projects',
		eyebrow: 'what I build',
		title: 'Featured projects',
		lead: 'Two platforms I designed and built end to end. Each one has its own case study.',
		sparkMatch: {
			eyebrow: 'featured project',
			title: 'Spark Match',
			tagline: 'Vocational guidance copilot powered by Generative AI',
			badgeTfp: 'Capstone · UNI 2026',
			badgeStatus: 'In active development',
			description:
				'A platform that helps students discover their career path by talking to an intelligent agent: it assesses their vocational profile, computes affinity with careers and builds action plans with real resources — not a chatbot, but an agent with multi-step reasoning, memory and delegation to subagents.',
			figures: [
				{ value: '550+', label: 'degree programmes analysed' },
				{ value: '1,000+', label: 'institutions' },
				{ value: '25', label: 'regions of Peru' },
			],
			figuresSource: 'Official data from Ponte en Carrera · MINEDU Peru',
			archAria: 'Architecture: Angular talks over AG-UI to the deep agent, which uses AWS Bedrock',
			subagentsLabel: 'subagents',
			infraLabel: 'infra',
			highlights: [
				"Deep agent with 3 specialized subagents and student profile memory (langmem), grounded in Holland's RIASEC vocational model.",
				'Serverless backend with DDD and event-driven architecture on Lambda and EventBridge; Angular 22 frontend with Signals and i18n.',
				'Multi-environment infrastructure (dev/prod) with pure Terraform and OIDC-based CI/CD — zero access keys — plus quality gates and security scanning.',
				'Real MLOps: datasets versioned with DVC, experiments tracked with MLflow and an academic paper with an automated LaTeX build.',
			],
			video: {
				label: 'Video demo',
				caption:
					'Final presentation for the Generative AI & MLOps specialization at UNI, with the platform running.',
				play: 'Play the Spark Match demo',
				alt: 'Spark Match landing page',
				iframeTitle: 'Spark Match demo',
			},
			cta: 'Read the case study',
			back: 'Back to the portfolio',
			detailMeta: {
				title: 'Spark Match — Case study | Angel Hincho',
				description:
					'How I designed and built Spark Match: a career guidance agent using LangChain Deep Agents on AWS Bedrock, a serverless backend on Lambda and infrastructure managed with Terraform.',
			},
			shotsLabel: 'The platform',
			shots: [
				'The agent delegates to specialised subagents and surfaces every step as it reasons.',
				'Each programme is matched against official MINEDU figures: admission rate, length, annual cost and monthly starting salary.',
				'The report is exported as a PDF detailing every recommended programme.',
				'Automated evaluation in LangSmith: custom evaluators and model comparison.',
			],
			roleLabel: 'My role:',
			roleText:
				'I led the design and construction of the platform end to end — infrastructure, CI/CD, backend, frontend and the deep agent (400+ commits) — alongside teammates who supported the academic research.',
			links: [
				{ href: 'https://github.com/spark-match', label: 'GitHub organization' },
				{ href: 'https://github.com/spark-match/spark-match-08-deep-agent', label: 'Deep agent' },
				{ href: 'https://github.com/spark-match/spark-match-02-infrastructure', label: 'Infrastructure' },
			],
		},
		nova: {
			eyebrow: 'own platform',
			title: 'Nova',
			tagline: 'A meta-framework for enterprise microservices',
			badgeKind: 'Own platform',
			badgeStatus: 'In active development',
			description:
				'The plumbing every company rewrites in every service — API standards, observability, security and build conventions — solved once, versioned and published. A core in plain Java with no framework dependencies, and thin adapters on top of it for Spring Boot, Quarkus and NestJS.',
			figures: [
				{ value: '28', label: 'public repositories' },
				{ value: '3', label: 'stacks supported' },
				{ value: '7', label: 'framework-free core libraries' },
			],
			archAria:
				'Layered architecture: a plain Java core, per-stack adapters and the microservice that consumes them',
			layersLabel: 'How it stacks up',
			layers: [
				{
					name: 'core',
					note: 'plain Java, no framework',
					items: ['api-standard', 'mask-utils', 'observability-utils', 'date-utils', 'mapper-utils', 'keycloak', 'architecture-rules'],
				},
				{
					name: 'adapters',
					note: 'one wiring per stack',
					items: ['Spring Boot starters', 'Quarkus extensions', 'NestJS starters'],
				},
				{
					name: 'your service',
					note: 'starts already configured',
					items: ['Maven archetypes', 'Gradle templates', 'reusable CI/CD'],
				},
			],
			highlights: [
				'The core depends on no framework: API standards, sensitive-data masking, observability and Keycloak are plain Java; the Spring Boot starters and Quarkus extensions only wire them in.',
				'The architecture checks itself: ArchUnit tests that enforce Layered, Clean and Hexagonal styles on whoever builds on the platform.',
				'Three stacks from a single BOM — Spring Boot, Quarkus and NestJS — with versions centralised in one place.',
				'Observability as a first-class concern: Four Golden Signals and OpenTelemetry tracing wired into the starter, not bolted on later.',
				'Every decision is written down as an ADR, with semantic versioning and a maturity assessment guide per module.',
			],
			roleLabel: 'My role:',
			roleText:
				'I design and build the whole platform — the architecture, all 28 repositories, the reusable pipelines and the documentation.',
			cta: 'Read the case study',
			back: 'Back to the portfolio',
			detailMeta: {
				title: 'Nova — Case study | Angel Hincho',
				description:
					'A meta-framework for enterprise microservices: a plain Java core, adapters for Spring Boot, Quarkus and NestJS, and architecture verified with ArchUnit.',
			},
			links: [
				{ href: 'https://github.com/ahincho?tab=repositories&q=nova', label: 'All 28 repositories' },
				{ href: 'https://github.com/ahincho/nova-java-api-standard', label: 'Core: API standard' },
				{ href: 'https://github.com/ahincho/nova-java-architecture-rules', label: 'Architecture rules' },
				{ href: 'https://github.com/ahincho/nova-docs', label: 'ADRs and documentation' },
			],
		},
	},
	experience: {
		eyebrow: 'career',
		title: 'Experience',
		jobs: [
			{
				company: 'Universidad Tecnológica del Perú (UTP)',
				role: 'FullStack & DevSecOps Engineer',
				meta: 'Jan 2024 — Mar 2026 · Lima',
				bullets: [
					'Built features for UTP+Class, the official learning platform serving 300,000+ students, on top of 20+ event-driven microservices.',
					'Standardized CI/CD pipelines with SAST/DAST testing and led the full migration from Azure DevOps to GitHub with zero operational downtime.',
					'Introduced agent-assisted development (AI-SDLC), cutting analysis, development and testing times by 30%.',
				],
				tags: ['Java', 'Spring Boot', 'React', 'NestJS', 'AWS', 'Azure', 'SonarCloud'],
			},
			{
				company: 'Claro (Central America)',
				role: 'Senior FullStack Engineer · Freelance',
				meta: 'May 2025 — Mar 2026 · Remote',
				bullets: [
					'Multi-country convergent sales platform: 30+ serverless microservices deployed across 4 countries and 12 environments.',
					'Led the migration from a single-country to a multi-country architecture and the modernization to NestJS, Angular micro-frontends and Ionic.',
					'Centralized, reusable pipelines with GitHub Actions, CodeQL scanning and automated deployments with Terraform and AWS SAM.',
				],
				tags: ['TypeScript', 'NestJS', 'Angular', 'Ionic', 'AWS', 'Terraform', 'DynamoDB'],
			},
			{
				company: 'Falabella',
				role: 'Fullstack Engineer · Freelance',
				meta: 'Mar 2024 — Aug 2024 · Remote, Chile',
				bullets: [
					'Features for the Pantalla Única and Technical Service (SerTec) platforms, serving users in Peru, Colombia and Chile.',
					'Integrated Salesforce and proprietary back-office systems for centralized sales management in a single interface.',
				],
				tags: ['Java', 'Spring Boot', 'FastAPI', 'React', 'Angular', 'GCP', 'Kubernetes'],
			},
			{
				company: 'JoyIt',
				role: 'Backend Developer',
				meta: 'Mar 2023 — Dec 2023 · Lima',
				bullets: [
					'Applicant Tracking System: job posting management, applications and candidate recommendation for open positions.',
					'Microservices with DDD, messaging and event queues; authentication and authorization with Keycloak.',
					'Facilitated Scrum for a 10-person team, leading ceremonies and onboarding documentation.',
				],
				tags: ['Java', 'Kotlin', 'Spring Boot', 'Quarkus', 'AWS', 'Keycloak'],
			},
			{
				company: 'Universidad Nacional de San Agustín (UNSA)',
				role: 'Researcher & Developer · Internship',
				meta: 'Apr 2022 — Apr 2023 · Arequipa',
				bullets: [
					'Desktop software and games in C#/.NET; web applications and REST APIs with Spring Boot.',
					'Software Engineering research with published technical articles.',
				],
				tags: ['C#', '.NET', 'Java', 'Angular', 'PostgreSQL'],
			},
			{
				company: 'ByteXByte',
				role: 'FullStack Developer',
				meta: 'Apr 2021 — Apr 2022 · Arequipa',
				bullets: [
					'Retail point-of-sale (POS) system, with several clients and their branches running on the same platform.',
					'Took part in migrating the desktop client from JavaFX to .NET Framework 4.8 with Windows Forms.',
					'A second migration to a web application with Spring Boot and React, multi-tenant per client and branch.',
				],
				tags: ['Java', 'JavaFX', 'C#', '.NET', 'Spring Boot', 'React', 'MySQL'],
			},
		],
		educationTitle: 'Education',
		education: [
			{ school: 'UNSA', degree: "Bachelor's in Systems Engineering", meta: '2020 — 2024 · GPA 3.7/4.0' },
			{ school: 'UNI', degree: 'Generative AI & MLOps specialization', meta: '2026' },
			{ school: 'UNSA Language Center', degree: 'English — intermediate level', meta: '2021 — 2022' },
		],
	},
	skills: {
		eyebrow: 'stack',
		title: 'Skills',
		groups: [
			{ name: 'Backend', items: ['Java', 'Spring Boot', 'Kotlin', 'Quarkus', 'Node.js', 'NestJS', 'Python', 'FastAPI', '.NET'] },
			{ name: 'Frontend', items: ['TypeScript', 'React', 'Angular', 'Vue', 'Ionic', 'Astro'] },
			{ name: 'DevSecOps & Cloud', items: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'SonarCloud', 'SAST/DAST', 'OpenTelemetry', 'Keycloak'] },
			{ name: 'AI & MLOps', items: ['LangChain', 'LangGraph', 'Deep Agents', 'RAG', 'Amazon Bedrock', 'Azure OpenAI', 'MLflow', 'DVC', 'Hugging Face'] },
			{ name: 'Databases', items: ['PostgreSQL', 'MySQL', 'DynamoDB', 'SQLite'] },
			{ name: 'Practices', items: ['Scrum', 'DDD', 'Event-Driven', 'Micro-frontends', 'AI-SDLC', 'OpenAPI'] },
		],
	},
	contact: {
		eyebrow: 'contact',
		title: "Let's build something together",
		lead: "I'm open to new challenges: full stack roles, DevSecOps or AI projects. Drop me a line and let's talk.",
		emailCta: 'Send email',
		cvCta: 'Download CV',
	},
	notFound: {
		title: '404 — Page not found | Angel Hincho',
		description: 'The page you are looking for does not exist in this portfolio.',
		heading: 'This page does not exist',
		lead: 'The link may be broken or the address mistyped. Everything published is reachable from the home page.',
		home: 'Back to home',
		project: 'See my projects',
	},
	footer: {
		rights: '© 2026 Angel Hincho — Arequipa, Peru',
		madeWith: 'Built with',
	},
};
