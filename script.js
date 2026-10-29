/**
 * Prajul Ahmad — Portfolio Interactions
 * Powered by vanilla ES6 + Motion Library
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Motion Library Integration & Scroll Animations
    // -------------------------------------------------------------------------
    const hasMotion = typeof window.Motion !== 'undefined';

    if (hasMotion) {
        const { inView, animate } = window.Motion;

        // Animate section headers on scroll into view
        document.querySelectorAll('.section-title-wrap').forEach(el => {
            inView(el, () => {
                animate(
                    el,
                    { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0)'] },
                    { duration: 0.6, easing: [0.16, 1, 0.3, 1] }
                );
            }, { amount: 0.2 });
        });

        // Staggered entrance for project cards
        document.querySelectorAll('.project-bento-card').forEach((card, index) => {
            inView(card, () => {
                animate(
                    card,
                    { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
                    { duration: 0.5, delay: (index % 3) * 0.1, easing: [0.16, 1, 0.3, 1] }
                );
            }, { amount: 0.15 });
        });

        // Animate architecture cards
        document.querySelectorAll('.arch-card').forEach((card, index) => {
            inView(card, () => {
                animate(
                    card,
                    { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0)'] },
                    { duration: 0.5, delay: index * 0.12, easing: [0.16, 1, 0.3, 1] }
                );
            }, { amount: 0.2 });
        });
    }

    // -------------------------------------------------------------------------
    // 2. Project Category Filtering
    // -------------------------------------------------------------------------
    const filterPills = document.querySelectorAll('.filter-pill');
    const projectCards = document.querySelectorAll('.project-bento-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const isMatch = filter === 'all' || category === filter;

                if (isMatch) {
                    card.style.display = 'flex';
                    if (hasMotion) {
                        window.Motion.animate(
                            card,
                            { opacity: [0, 1], transform: ['scale(0.96)', 'scale(1)'] },
                            { duration: 0.35, easing: [0.16, 1, 0.3, 1] }
                        );
                    } else {
                        card.style.opacity = '1';
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // -------------------------------------------------------------------------
    // 3. Copy-to-Clipboard & Toast Feedback
    // -------------------------------------------------------------------------
    const copyButtons = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toastNotice');
    const toastMsg = document.getElementById('toastMsg');
    let toastTimer = null;

    const displayToast = (msg) => {
        if (!toast) return;
        toastMsg.textContent = msg;
        toast.classList.add('show');

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2600);
    };

    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const text = btn.getAttribute('data-copy') || 'work.prajulahmad@gmail.com';

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => {
                    displayToast(`Copied ${text}`);
                }).catch(() => fallbackCopy(text));
            } else {
                fallbackCopy(text);
            }
        });
    });

    const fallbackCopy = (text) => {
        const el = document.createElement('textarea');
        el.value = text;
        el.style.position = 'fixed';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.focus();
        el.select();
        try {
            document.execCommand('copy');
            displayToast(`Copied ${text}`);
        } catch {
            displayToast(`Copy: ${text}`);
        }
        document.body.removeChild(el);
    };

    // -------------------------------------------------------------------------
    // 4. Command Console Shell Modal
    // -------------------------------------------------------------------------
    const cmdPaletteBtn = document.getElementById('cmdPaletteBtn');
    const cmdModalBackdrop = document.getElementById('cmdModalBackdrop');
    const cmdCloseBtn = document.getElementById('cmdCloseBtn');
    const cmdInput = document.getElementById('cmdInput');
    const cmdLog = document.getElementById('cmdLog');
    const cmdScreen = document.getElementById('cmdScreen');
    const termPills = document.querySelectorAll('.term-pill');

    const openShell = () => {
        cmdModalBackdrop.classList.add('open');
        cmdModalBackdrop.setAttribute('aria-hidden', 'false');
        setTimeout(() => cmdInput.focus(), 80);
    };

    const closeShell = () => {
        cmdModalBackdrop.classList.remove('open');
        cmdModalBackdrop.setAttribute('aria-hidden', 'true');
    };

    if (cmdPaletteBtn) cmdPaletteBtn.addEventListener('click', openShell);
    if (cmdCloseBtn) cmdCloseBtn.addEventListener('click', closeShell);

    if (cmdModalBackdrop) {
        cmdModalBackdrop.addEventListener('click', (e) => {
            if (e.target === cmdModalBackdrop) closeShell();
        });
    }

    // Keyboard Shortcuts: '/' or 'Cmd/Ctrl + K' opens shell; 'Esc' closes it
    document.addEventListener('keydown', (e) => {
        if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) &&
            document.activeElement.tagName !== 'INPUT' &&
            document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            openShell();
        } else if (e.key === 'Escape' && cmdModalBackdrop.classList.contains('open')) {
            closeShell();
        }
    });

    const shellCommands = {
        help: () => `
<div class="term-res">
  Commands list:
  <div style="margin-top:6px; display:flex; flex-direction:column; gap:4px;">
    <div><span class="t-hl">projects</span> &mdash; Full breakdown of verified projects &amp; architecture</div>
    <div><span class="t-hl">skills</span> &mdash; Categorized technologies, backends &amp; databases</div>
    <div><span class="t-hl">about</span> &mdash; Engineering positioning, background &amp; university</div>
    <div><span class="t-hl">research</span> &mdash; ICATFS 2026 published conference paper details</div>
    <div><span class="t-hl">contact</span> &mdash; Email, phone, LinkedIn &amp; GitHub links</div>
    <div><span class="t-hl">fetch</span> &mdash; Workstation specs &amp; Fedora Linux developer info</div>
    <div><span class="t-hl">clear</span> &mdash; Clear current terminal screen</div>
  </div>
</div>`,

        projects: () => `
<div class="term-res">
  <strong>Featured Technical Projects:</strong><br>
  1. <strong>TaskFlow</strong> &mdash; Node.js, Express, PostgreSQL, JWT RBAC, Kanban. Live: taskflow-production-2bfd.up.railway.app<br>
  2. <strong>DoodhWala</strong> &mdash; Offline-first Android app; Vue.js, SQLite, Supabase sync, integer paise billing, PDF generation.<br>
  3. <strong>Linux Resource Monitor</strong> &mdash; Direct C parsing of /proc/stat &amp; /proc/meminfo without daemons.<br>
  4. <strong>Automated LLM Evaluation</strong> &mdash; Async Python (asyncio) multi-model benchmarking against gold standards.<br>
  5. <strong>Smart Bin Robot</strong> &mdash; Dual ESP32 + ESP32-CAM, ultrasonic avoidance, DC motors &amp; Li-ion battery subsystem.<br>
  6. <strong>TechFlow SaaS</strong> &mdash; Razorpay subscription webhook verification via HMAC SHA-256 &amp; Row Level Security.
</div>`,

        skills: () => `
<div class="term-res">
  <strong>Verified Technical Capabilities:</strong><br>
  &bull; <strong>Languages:</strong> Java, C, C++, JavaScript (ES6+), Python, SQL, Bash<br>
  &bull; <strong>Backend:</strong> Node.js, Express.js, REST APIs, JWT, bcrypt, Socket.io<br>
  &bull; <strong>Databases:</strong> PostgreSQL, SQLite (Local-first), Supabase (RLS), MySQL<br>
  &bull; <strong>Systems:</strong> Fedora Linux, /proc FS, Docker, Git, Vim, ADB<br>
  &bull; <strong>Testing:</strong> Manual testing, Postman API testing, edge case audits
</div>`,

        about: () => `
<div class="term-res">
  <strong>Prajul Ahmad</strong> &mdash; B.E. Computer Science &amp; Engineering ('26), Chandigarh University.<br>
  Specializing in backend engineering, distributed synchronization, Linux kernel observability, and relational databases.<br>
  Workbench: Fedora Linux (Wayland), Bash, terminal-oriented engineering.
</div>`,

        research: () => `
<div class="term-res">
  <strong>Conference Publication:</strong><br>
  &ldquo;AI-Powered Smart City Management Systems&rdquo;<br>
  Venue: 1st International Conference on Advances in Thermal and Fluid Systems (ICATFS 2026), CGC University Mohali (Paper ID: 46 / 1053).<br>
  Investigates federated learning simulations, IoT sensor topologies &amp; urban infrastructure optimization.
</div>`,

        contact: () => `
<div class="term-res">
  <strong>Direct Contact Details:</strong><br>
  &bull; Email: <a href="mailto:work.prajulahmad@gmail.com" style="color:#38bdf8;">work.prajulahmad@gmail.com</a><br>
  &bull; Phone: <a href="tel:+917017497566" style="color:#38bdf8;">+91 7017497566</a><br>
  &bull; LinkedIn: <a href="https://linkedin.com/in/prajulahmad" target="_blank" style="color:#38bdf8;">linkedin.com/in/prajulahmad</a><br>
  &bull; GitHub: <a href="https://github.com/PrajulAhmad" target="_blank" style="color:#38bdf8;">github.com/PrajulAhmad</a>
</div>`,

        fetch: () => `
<div class="term-res font-mono">
  <span style="color:#38bdf8;">ahmad</span>@<span style="color:#2dd4bf;">fedora-polar-photon</span><br>
  --------------------------------<br>
  <span style="color:#38bdf8;">OS:</span> Fedora Linux x86_64 (Wayland)<br>
  <span style="color:#38bdf8;">Shell:</span> Bash 5.2<br>
  <span style="color:#38bdf8;">Terminal:</span> Alacritty / Pty<br>
  <span style="color:#38bdf8;">Education:</span> Chandigarh University, CSE '26<br>
  <span style="color:#38bdf8;">Primary Focus:</span> Backend APIs, Databases, Offline Sync, Low-Level C<br>
  <span style="color:#38bdf8;">Status:</span> <span style="color:#34d399;">● Available for 2026 Opportunities</span>
</div>`,

        clear: () => {
            cmdLog.innerHTML = '';
            return null;
        }
    };

    const runShellCommand = (cmdText) => {
        const query = cmdText.trim().toLowerCase();
        if (!query) return;

        // Command echo
        const echo = document.createElement('div');
        echo.className = 'term-echo';
        echo.innerHTML = `<span class="cmd-prompt">ahmad@fedora:~$</span> ${escapeText(cmdText)}`;
        cmdLog.appendChild(echo);

        if (shellCommands[query]) {
            const out = shellCommands[query]();
            if (out !== null) {
                const res = document.createElement('div');
                res.innerHTML = out;
                cmdLog.appendChild(res);
            }
        } else {
            const err = document.createElement('div');
            err.className = 'term-res';
            err.style.color = '#ef4444';
            err.textContent = `bash: command not found: ${query}. Type 'help' for available commands.`;
            cmdLog.appendChild(err);
        }

        cmdScreen.scrollTop = cmdScreen.scrollHeight;
    };

    const escapeText = (str) => {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    };

    if (cmdInput) {
        cmdInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = cmdInput.value;
                cmdInput.value = '';
                runShellCommand(val);
            }
        });
    }

    termPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const command = pill.getAttribute('data-run');
            if (command) {
                runShellCommand(command);
                cmdInput.focus();
            }
        });
    });

    // -------------------------------------------------------------------------
    // 5. Mobile Menu Toggle
    // -------------------------------------------------------------------------
    const menuBurger = document.getElementById('menuBurger');
    const navLinks = document.getElementById('navLinks');

    if (menuBurger && navLinks) {
        menuBurger.addEventListener('click', () => {
            const active = navLinks.classList.toggle('active');
            menuBurger.setAttribute('aria-expanded', active);
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBurger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // -------------------------------------------------------------------------
    // 6. Navigation Active Link on Scroll
    // -------------------------------------------------------------------------
    const trackedSections = document.querySelectorAll('main section[id]');
    const navAnchors = document.querySelectorAll('.nav-links .nav-link');

    const updateActiveNav = () => {
        const scrollY = window.scrollY + 130;

        trackedSections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navAnchors.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${id}`) {
                        a.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
});
