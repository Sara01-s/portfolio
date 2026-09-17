/* Landing page behaviour: contact form and on-screen video playback. */

/* Where the contact form delivers.
   With FORM_ENDPOINT empty the form opens the visitor's mail client with the
   message already written. Paste a Formspree / Web3Forms URL here and it posts
   in the background instead, without leaving the page. */
const CONTACT_EMAIL = 'saraosses01@gmail.com';
const FORM_ENDPOINT = '';

const FORM_MESSAGES = {
	en: {
		missing: 'Please fill in every field.',
		bademail: 'That email address does not look valid.',
		opening: 'Opening your mail client...',
		sending: 'Sending...',
		sent: 'Thank you! Your message is on its way.',
		failed: 'Something went wrong. You can email me directly at ' + CONTACT_EMAIL + '.',
	},
	es: {
		missing: 'Por favor completa todos los campos.',
		bademail: 'Ese correo no parece válido.',
		opening: 'Abriendo tu cliente de correo...',
		sending: 'Enviando...',
		sent: '¡Gracias! Tu mensaje va en camino.',
		failed: 'Algo salió mal. Puedes escribirme directamente a ' + CONTACT_EMAIL + '.',
	},
};

function formMessage(key) {
	const lang = document.documentElement.lang === 'es' ? 'es' : 'en';

	return FORM_MESSAGES[lang][key];
}

function looksLikeEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setupContactForm() {
	const form = document.querySelector('.contact-form');

	if (!form) {
		return;
	}

	const status = form.querySelector('.form-status');
	const submit = form.querySelector('.submit-button');

	/* Built in JS so the address is not sitting in the HTML for scrapers. */
	form.querySelectorAll('[data-contact-mailto]').forEach((link) => {
		link.href = 'mailto:' + CONTACT_EMAIL;
	});

	function report(key, kind) {
		status.textContent = formMessage(key);
		status.dataset.kind = kind;
		status.dataset.key = key;
	}

	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		const data = new FormData(form);
		const name = data.get('name').trim();
		const email = data.get('email').trim();
		const subject = data.get('subject').trim();
		const message = data.get('message').trim();

		/* The honeypot is invisible, so anything in it came from a bot.
		   Pretend it worked rather than telling the bot it was caught. */
		if (data.get('website')) {
			report('sent', 'ok');
			form.reset();
			return;
		}

		if (!name || !email || !subject || !message) {
			report('missing', 'error');
			return;
		}

		if (!looksLikeEmail(email)) {
			report('bademail', 'error');
			return;
		}

		if (!FORM_ENDPOINT) {
			const body = message + '\n\n---\n' + name + ' <' + email + '>';

			report('opening', 'ok');
			window.location.href = 'mailto:' + CONTACT_EMAIL
				+ '?subject=' + encodeURIComponent(subject)
				+ '&body=' + encodeURIComponent(body);

			return;
		}

		submit.disabled = true;
		report('sending', 'ok');

		try {
			const response = await fetch(FORM_ENDPOINT, {
				method: 'POST',
				headers: { Accept: 'application/json' },
				body: data,
			});

			if (!response.ok) {
				throw new Error('Request failed: ' + response.status);
			}

			report('sent', 'ok');
			form.reset();
		} catch (error) {
			report('failed', 'error');
		} finally {
			submit.disabled = false;
		}
	});

	/* Keep any visible message in the language the visitor just picked. */
	document.addEventListener('langchange', () => {
		if (status.dataset.key) {
			status.textContent = formMessage(status.dataset.key);
		}
	});
}

/* Cards play on their own. The observer only pauses what scrolls off screen
   so the browser is not decoding six videos at once, and resumes it on return. */
function setupVideoPlayback() {
	const videos = document.querySelectorAll('video[data-autoplay]');

	if (!videos.length) {
		return;
	}

	const holds = new Map();

	function play(video) {
		/* Some browsers only honour autoplay when muted is set on the element
		   itself, not just present as an attribute. */
		video.muted = true;

		const attempt = video.play();

		if (attempt) {
			attempt.catch(() => {
				/* Blocked by the browser's autoplay policy, nothing to do. */
			});
		}
	}

	function start(video) {
		const hold = Number(video.dataset.delay) || 0;

		/* `data-delay` keeps the poster on screen for a moment before the video
		   takes over. Only the first time: coming back into view plays at once,
		   otherwise scrolling past would replay the same wait each time. */
		if (hold > 0 && video.dataset.held !== 'yes') {
			if (holds.has(video)) {
				return;
			}

			holds.set(video, setTimeout(() => {
				holds.delete(video);
				video.dataset.held = 'yes';
				play(video);
			}, hold));

			return;
		}

		play(video);
	}

	function stop(video) {
		clearTimeout(holds.get(video));
		holds.delete(video);
		video.pause();
	}

	/* No eager start: calling play() on all of them would begin downloading
	   every video at once, and pausing afterwards does not cancel a download
	   already in flight. The observer fires on setup for whatever is already
	   in view, so the visible cards still start immediately. Without observer
	   support there is no way to tell, so fall back to starting everything. */
	if (!('IntersectionObserver' in window)) {
		videos.forEach(start);
		return;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				start(entry.target);
			} else {
				stop(entry.target);
			}
		});
	}, { rootMargin: '300px 0px', threshold: 0 });

	videos.forEach((video) => observer.observe(video));
}

/* Talk cards show a muted preview of the YouTube video. The iframe is built
   when it is wanted and thrown away after, so a visitor who never reaches the
   talks section loads nothing from YouTube at all. */
const talkPreviews = new WeakMap();

function mountPreview(card) {
	if (talkPreviews.has(card)) {
		return;
	}

	const params = new URLSearchParams({
		autoplay: '1',
		mute: '1',
		controls: '0',
		modestbranding: '1',
		rel: '0',
		playsinline: '1',
		disablekb: '1',
		loop: '1',
		playlist: card.dataset.youtube,
	});

	/* Starts where her part of the talk begins, the same timestamp the card's
	   own link carries. */
	if (card.dataset.start) {
		params.set('start', card.dataset.start);
	}

	const frame = document.createElement('iframe');

	frame.className = 'video-preview';
	/* nocookie: no tracking cookie unless the visitor clicks through. */
	frame.src = 'https://www.youtube-nocookie.com/embed/'
		+ card.dataset.youtube + '?' + params.toString();
	frame.allow = 'autoplay; encrypted-media';
	frame.title = '';
	frame.tabIndex = -1;
	frame.setAttribute('aria-hidden', 'true');

	/* Before the caption so the title stays readable over it. */
	card.querySelector('.item-content')
		.insertBefore(frame, card.querySelector('.item-text'));

	talkPreviews.set(card, frame);
	card.classList.add('is-previewing');
}

function unmountPreview(card) {
	const frame = talkPreviews.get(card);

	if (frame) {
		frame.remove();
		talkPreviews.delete(card);
	}

	card.classList.remove('is-previewing');
}

/* Pointer: preview whichever card the cursor or keyboard focus is on. */
function previewOnHover(cards) {
	cards.forEach((card) => {
		let pending = null;

		function show() {
			if (pending || talkPreviews.has(card)) {
				return;
			}

			/* A short wait so sweeping the cursor across the row does not fire
			   off four requests to YouTube. */
			pending = setTimeout(() => {
				pending = null;
				mountPreview(card);
			}, 220);
		}

		function hide() {
			clearTimeout(pending);
			pending = null;
			unmountPreview(card);
		}

		card.addEventListener('mouseenter', show);
		card.addEventListener('mouseleave', hide);
		card.addEventListener('focusin', show);
		card.addEventListener('focusout', hide);
	});
}

/* Touch: there is no hover, so the card the reader has scrolled to is the one
   that plays — and only that one. Four YouTube players at once would be a lot
   of data and battery to spend on a phone. */
function previewOnScroll(cards) {
	const visibility = new Map();
	let active = null;
	let pending = null;

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => visibility.set(entry.target, entry.intersectionRatio));

		let best = null;
		let bestRatio = 0;

		visibility.forEach((ratio, card) => {
			if (ratio > bestRatio) {
				bestRatio = ratio;
				best = card;
			}
		});

		/* Mostly on screen, otherwise nothing plays. */
		const next = bestRatio >= 0.6 ? best : null;

		if (next === active) {
			return;
		}

		clearTimeout(pending);

		/* Long enough that flicking past the section starts nothing. */
		pending = setTimeout(() => {
			if (active) {
				unmountPreview(active);
			}

			active = next;

			if (active) {
				mountPreview(active);
			}
		}, 400);
	}, { threshold: [0, 0.25, 0.5, 0.6, 0.75, 0.9, 1] });

	cards.forEach((card) => observer.observe(card));
}

function setupTalkPreviews() {
	const cards = document.querySelectorAll('.project[data-youtube]');

	if (!cards.length) {
		return;
	}

	if (window.matchMedia('(hover: hover)').matches) {
		previewOnHover(cards);
		return;
	}

	if (!('IntersectionObserver' in window)) {
		return;
	}

	/* A player costs far more than the thumbnail it replaces, so leave the
	   still image alone when the visitor is saving data or barely connected. */
	const connection = navigator.connection;

	if (connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || ''))) {
		return;
	}

	previewOnScroll(cards);
}

document.addEventListener('DOMContentLoaded', () => {
	setupContactForm();
	setupVideoPlayback();
	setupTalkPreviews();
});
