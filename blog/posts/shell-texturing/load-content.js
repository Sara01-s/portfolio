marked.setOptions({
    sanitizer: false,
    escape: false,
    breaks: true
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('./content.md')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load content');
            }
            return response.text();
        })
        .then(markdown => {
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
        })
        .catch(error => {
            console.error('Error loading content:', error);
        });
});