/* Bumped on deploy so GitHub Pages' asset caching cannot serve a stale post.
   Keep in step with the ?v= stamps on the CSS/JS tags in index.html. */
const CONTENT_VERSION = '20260917-5';

marked.setOptions({
	sanitizer: false,
	escape: false,
	breaks: true
});

function updateReadingProgress() {
	const bar = document.querySelector('.reading-progress span');
	const article = document.querySelector('.blog-section');

	if (!bar || !article) {
		return;
	}

	function draw() {
		const start = article.offsetTop;
		const scrollable = article.offsetHeight - window.innerHeight;
		const progress = scrollable <= 0
			? 1
			: (window.scrollY - start) / scrollable;

		bar.style.width = Math.min(100, Math.max(0, progress * 100)) + '%';
	}

	draw();
	window.addEventListener('scroll', draw, { passive: true });
	window.addEventListener('resize', draw);
}

function renderContent(markdown) {
	const equationPlaceholder = '<!-- MATHJAX_EQUATION_';
	const equations = [];
	let index = 0;

	const protectedMarkdown = markdown.replace(/\$\$([\s\S]*?)\$\$/g, (match, content) => {
		equations.push(content);
		return `${equationPlaceholder}${index++} -->`;
	});

	let htmlContent = marked.parse(protectedMarkdown, { mangle: false, smartypants: false });

	htmlContent = htmlContent.replace(
		new RegExp(`${equationPlaceholder}(\\d+) -->`, 'g'),
		(_, index) => `$$${equations[index]}$$`
	);

	const container = document.querySelector('#content');
	container.innerHTML = htmlContent;

	document.querySelectorAll('pre code').forEach((block) => {
		/* A fence with no language gets auto-detected, which colours the binary
		   AND diagram as if it were source. Leave those blocks plain. */
		if (!/\blanguage-/.test(block.className)) {
			return;
		}

		hljs.highlightElement(block);
	});

	function renderMathJax() {
		if (typeof MathJax !== 'undefined' && MathJax.startup && MathJax.startup.promise) {
			MathJax.startup.promise.then(() => {
				MathJax.typesetPromise([container]);
			});
		} else {
			setTimeout(renderMathJax, 100);
		}
	}
	renderMathJax();
}

/* The post is written in both languages, one Markdown file each. */
function loadContent(lang) {
	const file = lang === 'es' ? './content.es.md' : './content.en.md';

	fetch(`${file}?v=${CONTENT_VERSION}`)
		.then(response => {
			if (!response.ok) {
				throw new Error('Failed to load content');
			}
			return response.text();
		})
		.then(renderContent)
		.catch(error => {
			console.error('Error loading content:', error);
		});
}

/* The lead video plays on its own; this just pauses it off screen. */
function setupVideoPlayback() {
	const videos = document.querySelectorAll('video[data-autoplay]');

	if (!videos.length || !('IntersectionObserver' in window)) {
		return;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.muted = true;
				const attempt = entry.target.play();

				if (attempt) {
					attempt.catch(() => {});
				}
			} else {
				entry.target.pause();
			}
		});
	}, { rootMargin: '300px 0px', threshold: 0 });

	videos.forEach((video) => observer.observe(video));
}

document.addEventListener('DOMContentLoaded', () => {
	loadContent(document.documentElement.lang);
	updateReadingProgress();
	setupVideoPlayback();
});

/* i18n.js fires this whenever the visitor switches languages. */
document.addEventListener('langchange', (event) => {
	if (document.querySelector('#content')) {
		loadContent(event.detail.lang);
	}
});
