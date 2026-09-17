/* Minimal i18n: auto-detects the visitor's language, remembers manual choices. */

const SUPPORTED_LANGS = ['en', 'es'];
const DEFAULT_LANG = 'en';
const STORAGE_KEY = 'preferred-lang';

const translations = {
	en: {
		'nav.blog': 'Blogs',
		'nav.home': 'Home',

		'hero.greeting': 'Hello!',
		'hero.h1context': 'Sara San Martín, Game Developer and Designer',
		'hero.intro': 'I\'m <i>Sara San Martín</i>, professional <span class="highlight">Game Developer</span> and <span class="highlight">Designer</span>.',
		'hero.specialty': 'I specialize in C++ and C#, with 6 years of experience in Unity development. <br>My largest project to date has been the <i>design</i> and <i>development</i> of a complete custom animation software.',

		'category.projects': 'PROJECTS',
		'category.games': 'GAMES',
		'category.talks': 'TALKS',
		'talks.comingsoonalt': 'Coming soon',
		'talks.hoverme': 'Hover me',
		'talk.one': 'Introduction to Shaders',
		'talk.two': 'Data-Oriented Programming',
		'talk.three': 'Social Skills',
		'talk.four': 'Audio synchronization',
		'talk.channel': 'Game engines',

		'project.watercolor': 'Watercolor Processor',
		'project.kuwahara': 'Kuwahara Filter',
		'project.engine': 'Custom Game Engine',
		'project.assets': 'Co-Authored Assets',
		'project.eightfold': 'Credited in: The Eightfold Path',
		'project.animation': 'Custom Animation Software',
		'project.shaders': 'Minecraft Shaders with GLSL',
		'project.vulkan': 'C++ 3D Vulkan Renderer',
		'project.blogfur': 'Blog: Rendering Fur in games',
		'project.ecs': 'C++ ECS API',
		'project.pong': '<i>Pong</i> made in C and OpenGL',

		'game.whatwouldyoudo': 'What would you do?',
		'game.onemoresong': 'Just One More Song',
		'game.platformer': 'Short platformer experience',

		'category.contact': 'CONTACT ME',
		'contact.intro': 'Have a project in mind, a role to fill, or just want to talk about graphics programming? Write me.',
		'contact.name': 'Your name',
		'contact.nameplaceholder': 'Ada Lovelace',
		'contact.email': 'Your email',
		'contact.emailplaceholder': 'ada@example.com',
		'contact.subject': 'Subject',
		'contact.subjectplaceholder': 'Job opportunity',
		'contact.message': 'Message',
		'contact.messageplaceholder': 'Tell me what you have in mind...',
		'contact.send': 'Send message',
		'contact.direct': 'Or email me directly',

		'footer.madeby': 'Made with ♥ by Sara San Martín, 2026',

		'blog.title': 'Blogs',
		'blog.description': 'Technical articles about engine and game development, graphics programming and other things I find interesting.',
		'blog.readpost': 'Click to read',
		'blog.tag.rendering': 'Rendering',
		'blog.shell.excerpt': 'A step-by-step breakdown of the technique behind fur and grass in games, built from scratch in Unity.',
		'blog.shell.date': 'July 12, 2024',

		'post.shell.title': 'Shell Texturing',
		'post.shell.readingtime': '8 min read',
		'post.sourcecode': 'Source Code: ',
		'post.backtoblog': 'Back to blog',

		'meta.description': 'Sara is a Game Developer and Designer. Explore her projects, games, blogs and more on her website.',
		'meta.ogdescription': 'Personal Sara\'s website. Explore her projects, games, blogs and more.',
		'meta.blogdescription': 'Technical articles by Sara San Martín about engine and game development, graphics programming and shaders.',
		'meta.postdescription': 'A step-by-step breakdown of the Shell Texturing technique for rendering fur and grass in games, implemented in Unity with GLSL shaders.',

		'lang.toggle': 'ES',
		'lang.togglelabel': 'Ver esta página en español',
	},
	es: {
		'nav.blog': 'Blogs',
		'nav.home': 'Inicio',

		'hero.greeting': '¡Hola!',
		'hero.h1context': 'Sara San Martín, desarrolladora y diseñadora de videojuegos',
		'hero.intro': 'Soy <i>Sara San Martín</i>, <span class="highlight">desarrolladora</span> y <span class="highlight">diseñadora</span> de videojuegos profesional.',
		'hero.specialty': 'Me especializo en C++ y C#, con 6 años de experiencia en desarrollo con Unity. <br>Mi proyecto más grande hasta la fecha ha sido el <i>diseño</i> y <i>desarrollo</i> de un software de animación propio y completo.',

		'category.projects': 'PROYECTOS',
		'category.games': 'JUEGOS',
		'category.talks': 'CHARLAS',
		'talks.comingsoonalt': 'Disponible próximamente',
		'talks.hoverme': 'Mantén',
		'talk.one': 'Intro a los Shaders',
		'talk.two': 'Programación Orientada a Datos',
		'talk.three': 'Habilidades Sociales',
		'talk.four': 'Sincronización de audio',
		'talk.channel': 'Motores de videojuegos',

		'project.watercolor': 'Procesador acuarela',
		'project.kuwahara': 'Filtro de Kuwahara',
		'project.engine': 'Motor Gráfico Propio',
		'project.assets': 'Assets co-creados',
		'project.eightfold': 'Acreditada en: The Eightfold Path',
		'project.animation': 'Software de animación propio',
		'project.shaders': 'Shaders de Minecraft con GLSL',
		'project.vulkan': 'Renderizador 3D en C++ con Vulkan',
		'project.blogfur': 'Blog: Renderizado de pelaje en videojuegos',
		'project.ecs': 'API de ECS en C++',
		'project.pong': '<i>Pong</i> hecho en C y OpenGL',

		'game.whatwouldyoudo': '¿Qué harías tú?',
		'game.onemoresong': 'Just One More Song',
		'game.platformer': 'Plataformas 2D',

		'category.contact': 'CONTÁCTAME',
		'contact.intro': '¿Tienes un proyecto en mente, una vacante que llenar, o simplemente quieres hablar de programación gráfica? Escríbeme.',
		'contact.name': 'Tu nombre',
		'contact.nameplaceholder': 'Ada Lovelace',
		'contact.email': 'Tu correo',
		'contact.emailplaceholder': 'ada@ejemplo.com',
		'contact.subject': 'Asunto',
		'contact.subjectplaceholder': 'Oportunidad laboral',
		'contact.message': 'Mensaje',
		'contact.messageplaceholder': 'Cuéntame qué tienes en mente...',
		'contact.send': 'Enviar mensaje',
		'contact.direct': 'O escríbeme directamente',

		'footer.madeby': 'Hecho con ♥ por Sara San Martín, 2026',

		'blog.title': 'Blogs',
		'blog.description': 'Artículos técnicos sobre desarrollo de motores y videojuegos, programación gráfica y otras cosas que me parecen interesantes.',
		'blog.readpost': 'Clic para leer',
		'blog.tag.rendering': 'Renderizado',
		'blog.shell.excerpt': 'Análisis paso a paso de la técnica detrás del pelaje y el césped en videojuegos, implementada desde cero en Unity.',
		'blog.shell.date': '12 de julio de 2024',

		'post.shell.title': 'Shell Texturing',
		'post.shell.readingtime': '8 min de lectura',
		'post.sourcecode': 'Código fuente: ',
		'post.backtoblog': 'Volver al blog',

		'meta.description': 'Sara es desarrolladora y diseñadora de videojuegos. Explora sus proyectos, juegos, blogs y más en su sitio web.',
		'meta.ogdescription': 'Sitio web personal de Sara. Explora sus proyectos, juegos, blogs y más.',
		'meta.blogdescription': 'Artículos técnicos de Sara San Martín sobre desarrollo de motores y videojuegos, programación gráfica y shaders.',
		'meta.postdescription': 'Análisis paso a paso de la técnica de Shell Texturing para renderizar pelaje y césped en videojuegos, implementada en Unity con shaders GLSL.',

		'lang.toggle': 'EN',
		'lang.togglelabel': 'View this page in English',
	},
};

/* Reads the stored choice first, then falls back to the browser's preferences. */
function detectLang() {
	let stored = null;

	try {
		stored = localStorage.getItem(STORAGE_KEY);
	} catch (error) {
		/* Private mode or blocked storage, detection still works. */
	}

	if (SUPPORTED_LANGS.includes(stored)) {
		return stored;
	}

	const preferences = navigator.languages || [navigator.language];

	for (const preference of preferences) {
		if (!preference) {
			continue;
		}

		const lang = preference.toLowerCase().split('-')[0];

		if (SUPPORTED_LANGS.includes(lang)) {
			return lang;
		}
	}

	return DEFAULT_LANG;
}

function translate(key, lang) {
	const dictionary = translations[lang] || translations[DEFAULT_LANG];

	return dictionary[key] !== undefined ? dictionary[key] : translations[DEFAULT_LANG][key];
}

function applyLang(lang) {
	document.documentElement.lang = lang;

	document.querySelectorAll('[data-i18n]').forEach((element) => {
		const text = translate(element.dataset.i18n, lang);

		if (text !== undefined) {
			element.innerHTML = text;
		}
	});

	/* Attributes such as alt, title, content and aria-label. */
	document.querySelectorAll('[data-i18n-attr]').forEach((element) => {
		element.dataset.i18nAttr.split(',').forEach((pair) => {
			const [attribute, key] = pair.split(':').map((part) => part.trim());
			const text = translate(key, lang);

			if (attribute && text !== undefined) {
				element.setAttribute(attribute, text);
			}
		});
	});

	document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

function setLang(lang) {
	if (!SUPPORTED_LANGS.includes(lang)) {
		return;
	}

	try {
		localStorage.setItem(STORAGE_KEY, lang);
	} catch (error) {
		/* Choice just won't persist between visits. */
	}

	applyLang(lang);
}

function currentLang() {
	return SUPPORTED_LANGS.includes(document.documentElement.lang)
		? document.documentElement.lang
		: DEFAULT_LANG;
}

/* Set the language before first paint to avoid a flash of the wrong text. */
applyLang(detectLang());

document.addEventListener('DOMContentLoaded', () => {
	applyLang(currentLang());

	document.querySelectorAll('.lang-toggle').forEach((toggle) => {
		toggle.addEventListener('click', (event) => {
			event.preventDefault();
			setLang(currentLang() === 'es' ? 'en' : 'es');
		});
	});
});
