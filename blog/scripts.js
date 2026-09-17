/* Post cards play on their own via the `autoplay` attribute. The observer only
   pauses what scrolls off screen and resumes it on return. */
function setupVideoPlayback() {
	const videos = document.querySelectorAll('video[data-autoplay]');

	if (!videos.length) {
		return;
	}

	function start(video) {
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

	videos.forEach(start);

	if (!('IntersectionObserver' in window)) {
		return;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				start(entry.target);
			} else {
				entry.target.pause();
			}
		});
	}, { rootMargin: '300px 0px', threshold: 0 });

	videos.forEach((video) => observer.observe(video));
}

document.addEventListener('DOMContentLoaded', setupVideoPlayback);
