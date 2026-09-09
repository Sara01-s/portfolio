marked.setOptions({
    sanitizer: false,
    escape: false,
    breaks: true
});

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

    fetch(file)
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

document.addEventListener('DOMContentLoaded', () => {
    loadContent(document.documentElement.lang);
});

/* i18n.js fires this whenever the visitor switches languages. */
document.addEventListener('langchange', (event) => {
    if (document.querySelector('#content')) {
        loadContent(event.detail.lang);
    }
});
