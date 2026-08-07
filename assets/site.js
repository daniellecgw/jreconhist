/* site.js
 *
 * Single source of truth for the conference chrome: top strip, masthead,
 * hero, and footer. Edit the CONFERENCE object below and every page updates.
 * Do not hand-edit that markup in any index.html -- it is generated from here.
 *
 * Each page needs three things:
 *   1. <script src="assets/site.js" defer></script>   in the <head>
 *   2. <div id="site-header" data-page="ID"></div>    first thing in <body>
 *   3. <div id="site-footer"></div>                   last thing in <body>
 * where ID matches one of the `id` values in CONFERENCE.pages.
 */

const CONFERENCE = {

    siteName: 'Junior Economic History Conference',
    year: '2027',
    description: 'The Junior Economic History Conference is a seminar-style workshop for early career researchers in economic history.',

    /* The oversized display type on the home page, one array entry per line.
     * Each line is auto-scaled to the same width, so short lines get bigger
     * type -- aim for lines of roughly similar length. */
    heroLines: ['Junior', 'Economic', 'History'],

    /* How much of the page width the hero lines span, 0-1. Lower = smaller type.
     * They stay flush with each other either way. */
    heroFill: 0.6,

    /* Bottom-left block under the hero. */
    taglineLines: ['Conference for', 'Early-Career Research'],
    city: 'Rhodes College, Memphis',

    /* The circular date badge, and the long-form date used in the footer. */
    badge: { month: 'April', days: '10-11', pennant: '2027' },
    dates: 'April 10-11, 2027',
    venue: 'Rhodes College, Memphis, Tennessee',

    /* Letters inside the oval logo mark. Three or four characters work best. */
    logoText: 'JEHC',

    /* The pill button in the masthead. Set to null to hide it. */
    cta: { label: 'Registration', href: 'registration' },

    /* Site navigation, in order. `id` is what a page puts in data-page.
     * `topbar: false` keeps a page out of the thin strip (used for the CTA
     * page, which already has the pill button). */
    pages: [
        { id: 'home',         label: 'Home',            href: '.',            title: 'Conference Home Page' },
        { id: 'registration', label: 'Registration',    href: 'registration', title: 'Register for the Conference', topbar: false },
        { id: 'program',      label: 'Program',         href: 'program',      title: 'Conference Program' },
        { id: 'directions',   label: 'Directions',      href: 'directions',   title: 'Directions to the Conference' },
        { id: 'flyer',        label: 'Call for Papers', href: 'flyer',        title: 'Call for Papers' },
    ],

    /* Rendered as raw HTML so it can carry links. */
    footerCredit: 'Adapted from Mike Pierce’s <a href="https://github.com/mikepierce/conference-website-template">conference website template</a>. '
                + 'Design inspired by <a href="https://www.povbudapest.com/">POV Budapest</a>.',

};


/* ------------------------------------------------------------------------- *
 * Everything below renders the object above. You shouldn't need to edit it.
 * ------------------------------------------------------------------------- */

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function renderSiteHeader() {
    const mount = document.getElementById('site-header');
    if (!mount) return;

    const currentId = mount.dataset.page;
    const current = CONFERENCE.pages.find(p => p.id === currentId);
    const isHome = currentId === 'home';

    const link = (page, cls) => {
        const active = page.id === currentId ? ' current' : '';
        return `<a class="${cls}${active}" title="${esc(page.title)}" href="${esc(page.href)}">${esc(page.label)}</a>`;
    };

    const topbar = `
    <div class="topbar">
        <nav class="topbar-inner" aria-label="Primary">
            ${CONFERENCE.pages.filter(p => p.topbar !== false).map(p => link(p, '')).join('\n            ')}
        </nav>
    </div>`;

    const cta = CONFERENCE.cta
        ? `<a class="btn-pill" href="${esc(CONFERENCE.cta.href)}">${esc(CONFERENCE.cta.label)}</a>`
        : '';

    const masthead = `
    <header class="masthead">
        <a class="logo" href="." title="${esc(CONFERENCE.siteName)}">${esc(CONFERENCE.logoText)}</a>
        <div class="masthead-right">
            ${cta}
            <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-drawer" aria-label="Menu">
                <span></span><span></span>
            </button>
        </div>
    </header>
    <nav class="drawer" id="site-drawer" aria-label="Menu">
        ${CONFERENCE.pages.map(p => link(p, '')).join('\n        ')}
    </nav>`;

    let hero;
    if (isHome) {
        const fill = CONFERENCE.heroFill || 1;
        const lines = CONFERENCE.heroLines
            .map(l => `<span class="hero-line" data-fit data-fit-fill="${fill}">${esc(l)}</span>`)
            .join('\n            ');
        const tagline = CONFERENCE.taglineLines.map(esc).join('<br>');
        const b = CONFERENCE.badge;
        hero = `
    <section class="hero">
        <h1 class="hero-title">
            ${lines}
        </h1>
        <div class="hero-foot">
            <div class="hero-tagline">
                ${tagline}
                <span class="hero-city">${esc(CONFERENCE.city)}</span>
            </div>
            <div class="date-badge">
                <span class="month">${esc(b.month)}</span>
                <span class="days">${esc(b.days)}</span>
                ${b.pennant ? `<span class="pennant">${esc(b.pennant)}</span>` : ''}
            </div>
        </div>
    </section>`;
    } else {
        const label = current ? current.label : '';
        hero = `
    <section class="page-hero">
        <h1><span class="hero-line" data-fit data-fit-max="150">${esc(label)}</span></h1>
        <div class="page-meta">${esc(CONFERENCE.dates)} &nbsp;&middot;&nbsp; ${esc(CONFERENCE.venue)}</div>
    </section>`;
    }

    mount.innerHTML = topbar + masthead + hero;

    const toggle = mount.querySelector('.menu-toggle');
    const drawer = mount.querySelector('.drawer');
    toggle.addEventListener('click', () => {
        const open = drawer.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });

    // Keep <title> and the meta description in sync with the object too.
    const fullName = `${CONFERENCE.siteName} ${CONFERENCE.year}`;
    document.title = (current && !isHome) ? `${current.label} | ${fullName}` : fullName;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', CONFERENCE.description);
}

function renderSiteFooter() {
    const mount = document.getElementById('site-footer');
    if (!mount) return;
    mount.outerHTML = `
    <footer class="site-footer">
        <div class="footer-inner">
            <div class="footer-name">${esc(CONFERENCE.siteName)} ${esc(CONFERENCE.year)}</div>
            <div class="footer-meta">${esc(CONFERENCE.dates)} &nbsp;&middot;&nbsp; ${esc(CONFERENCE.venue)}</div>
            <div class="footer-credit">${CONFERENCE.footerCredit}</div>
        </div>
    </footer>`;
}

/* Scale every [data-fit] line so it exactly spans its container's content box.
 * This is what gives the display type its poster-like flush-left/right edges. */
function fitDisplayLines() {
    document.querySelectorAll('[data-fit]').forEach(el => {
        const box = el.closest('.hero, .page-hero');
        if (!box) return;
        const cs = getComputedStyle(box);
        const fill = parseFloat(el.dataset.fitFill) || 1;
        const avail = (box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) * fill;
        if (avail <= 0) return;

        // Measure the text itself. scrollWidth is no good here: it clamps to the
        // block's own width whenever the text is narrower than the container.
        // Text width scales linearly with font-size, so measure at whatever size
        // the line is currently at and scale the ratio -- no set-then-measure,
        // which can read stale layout.
        const range = document.createRange();
        range.selectNodeContents(el);
        const natural = range.getBoundingClientRect().width;
        const current = parseFloat(getComputedStyle(el).fontSize);
        if (!natural || !current) return;

        let size = current * avail / natural;
        const max = parseFloat(el.dataset.fitMax);
        if (!isNaN(max)) size = Math.min(size, max);
        el.style.fontSize = size + 'px';
    });
}

function init() {
    renderSiteHeader();
    renderSiteFooter();
    fitDisplayLines();
    // Anton changes the metrics once it lands, so measure again after it loads.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitDisplayLines);

    let pending;
    window.addEventListener('resize', () => {
        clearTimeout(pending);
        pending = setTimeout(fitDisplayLines, 120);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
