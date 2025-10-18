addEventListener("DOMContentLoaded", (event) => { 
    (function () {
            const container = document.querySelector('.container.nav');
            const toggle = container && container.querySelector('.nav-toggle');
            const nav = container && container.querySelector('nav');

            if (!toggle || !nav) return;

            function setExpanded(isOpen) {
                toggle.setAttribute('aria-expanded', String(!!isOpen));
                container.classList.toggle('nav-open', !!isOpen);
            }

            toggle.addEventListener('click', function (e) {
                e.stopPropagation();
                setExpanded(!container.classList.contains('nav-open'));
            });

            // close when clicking a link or outside
            nav.addEventListener('click', function (e) {
                if (e.target.tagName === 'A') setExpanded(false);
            });
            document.addEventListener('click', function (e) {
                if (!container.contains(e.target)) setExpanded(false);
            });

            // optional: close on ESC
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') setExpanded(false);
            });
        })();
});