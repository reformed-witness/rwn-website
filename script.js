document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Theme Engine
    const themeToggle = document.getElementById('theme-toggle');
    const updateIcons = () => {
        // Lucide re-rendering if needed
        lucide.createIcons();
    };

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('rwn-v2-theme', isDark ? 'dark' : 'light');
    });

    // Check LocalStorage
    if (localStorage.getItem('rwn-v2-theme') === 'dark') {
        document.documentElement.classList.add('dark');
    }

    // Scroll Progress
    window.addEventListener('scroll', () => {
        const bar = document.getElementById('scroll-progress');
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / height);
        bar.style.transform = `scaleX(${scrolled})`;
    });

    // Reveal Animation on Scroll
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.bento-card, #labs .group').forEach(el => {
        el.classList.add('reveal-init');
        revealObserver.observe(el);
    });

    // Simple Mobile Toggle
    const mobileBtn = document.getElementById('mobile-toggle');
    mobileBtn.addEventListener('click', () => {
        alert("Mobile menu implementation: Add a slide-over panel here.");
        // Usually you'd toggle a 'hidden' class on a menu div
    });
});