document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('resize', function() {
        const contentWrapper = document.querySelector('.content-wrapper');
        const isMobile = window.innerWidth <= 640;

        if (!isMobile) {
            contentWrapper.scrollTop = 0
        }
    });
});
