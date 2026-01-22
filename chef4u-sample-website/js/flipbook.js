document.addEventListener('DOMContentLoaded', function () {

    const checkLibrary = setInterval(() => {
        if (typeof St.PageFlip !== 'undefined') {
            clearInterval(checkLibrary);
            initBook();
        }
    }, 100);

    function initBook() {
        const pageFlip = new St.PageFlip(document.getElementById('book'), {
            width: 500, // Reduced width
            height: 600, // Reduced height
            size: "stretch",
            minWidth: 300,
            maxWidth: 1000,
            minHeight: 400,
            maxHeight: 1200,
            maxShadowOpacity: 0.5,
            showCover: true,
            mobileScrollSupport: false
        });

        // Load pages
        pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        // Controls
        document.querySelector('.btn-prev').addEventListener('click', () => {
            pageFlip.flipPrev();
        });

        document.querySelector('.btn-next').addEventListener('click', () => {
            pageFlip.flipNext();
        });

        // New: FIRST PAGE BUTTON
        const btnFirst = document.querySelector('.btn-first');
        if (btnFirst) {
            // Initially hide if on page 0 (usually starts on 0)
            btnFirst.style.display = 'none';

            btnFirst.addEventListener('click', () => {
                // Flip to the very first page (Cover)
                pageFlip.flip(0);
            });
        }

        // Trigger on page change
        pageFlip.on('flip', (e) => {
            if (btnFirst) {
                if (e.data === 0) {
                    btnFirst.style.display = 'none';
                } else {
                    btnFirst.style.display = 'flex'; // Restore display style
                }
            }
        });

        // Handle index links
        const indexLinks = document.querySelectorAll('.index-link');
        indexLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const pageEl = targetElement.closest('.page');
                    if (pageEl) {
                        const allPages = Array.from(document.querySelectorAll('.page'));
                        const index = allPages.indexOf(pageEl);
                        if (index !== -1) {
                            pageFlip.flip(index);
                        }
                    }
                }
            });
        });
    }
});
