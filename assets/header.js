/* =========================================================================
   Hedlyner — Global Site Header Loader
   Injects the unified header into <div id="site-header"></div> on any page.
   Auto-marks the active link from the current pathname.
   Logo: static flag mark that swaps to the animated equalizer bars on hover
   (ported from hedlyner-ui-v5 AnimatedLogo / useAnimatedLogo / logoAnimation).
   Behavior: header is fixed to the top and auto-hides when the cursor moves
   away from the top of the page; it reappears when the cursor returns to the
   top zone or hovers the header.
   ========================================================================= */
(function () {
  // Equalizer keyframes — same data as src/utils/logoAnimation.ts in hedlyner-ui-v5
  var LOGO_FRAMES = [
    [
      { x: 0, y: 13, height: 53 },
      { x: 16, y: 0, height: 79 },
      { x: 32, y: 9, height: 61 },
      { x: 48, y: 18, height: 43 },
      { x: 64, y: 28, height: 23 }
    ],
    [
      { x: 0, y: 37, height: 5 },
      { x: 16, y: 37, height: 5 },
      { x: 32, y: 37, height: 5 },
      { x: 48, y: 37, height: 5 },
      { x: 64, y: 37, height: 5 }
    ],
    [
      { x: 0, y: 33, height: 13 },
      { x: 16, y: 23, height: 33 },
      { x: 32, y: 28, height: 23 },
      { x: 48, y: 9, height: 61 },
      { x: 64, y: 14, height: 51 }
    ],
    [
      { x: 0, y: 0, height: 79 },
      { x: 16, y: 23, height: 33 },
      { x: 32, y: 15, height: 49 },
      { x: 48, y: 29, height: 21 },
      { x: 64, y: 34, height: 11 }
    ],
    [
      { x: 0, y: 24, height: 31 },
      { x: 16, y: 33, height: 13 },
      { x: 32, y: 13, height: 53 },
      { x: 48, y: 24, height: 31 },
      { x: 64, y: 3, height: 73 }
    ],
    [
      { x: 0, y: 25, height: 29 },
      { x: 16, y: 14, height: 51 },
      { x: 32, y: 32, height: 15 },
      { x: 48, y: 21, height: 37 },
      { x: 64, y: 25, height: 29 }
    ]
  ];
  var LOGO_INTERVAL = 130; // ms between keyframes, as in useAnimatedLogo(130)

  function barsMarkup() {
    var rects = '';
    for (var i = 0; i < LOGO_FRAMES[0].length; i++) {
      var b = LOGO_FRAMES[0][i];
      rects +=
        '<rect x="' + b.x + '" y="' + b.y + '" width="12" height="' + b.height + '" rx="6" fill="#CDEB09"/>';
    }
    return rects;
  }

  var HEADER_HTML = '' +
    '<header class="site-header">' +
    '<div class="sh-wrap">' +
    '<a href="index.html" class="sh-brand" data-nav="home">' +
    '<span class="sh-logo" style="display:inline-flex;width:37px;height:40px;">' +
    '<svg class="sh-logo-static" width="26" height="28" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">' +
    '<path d="M8.86104 38.9833C4.95936 41.3198 0 38.5091 0 33.9613V7.81691C0 1.75321 6.61248 -1.99445 11.8147 1.12085L33.5649 14.1457C37.3599 16.4183 37.3599 21.9171 33.5649 24.1897L25.4196 29.0675C22.8184 30.6251 19.5122 28.7513 19.5122 25.7195V20.1433C19.5122 17.8534 17.6558 15.997 15.3659 15.997C13.0759 15.997 11.2195 17.8534 11.2195 20.1433V35.3593C11.2195 36.7312 10.4991 38.0024 9.322 38.7073L8.86104 38.9833Z" fill="#CDEB09"/>' +
    '</svg>' +
    '<svg class="sh-logo-bars" width="37" height="40" viewBox="0 0 76 82" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:none;width:100%;height:100%;">' +
    barsMarkup() +
    '</svg>' +
    '</span>' +
    '<span class="sh-wm">HEDLYNER</span>' +
    '</a>' +
    '<ul class="sh-links">' +
    '<li><a href="for-bookers.html" data-nav="for-bookers">For Bookers</a></li>' +
    '<li><a href="for-artists.html" data-nav="for-artists">For Talent</a></li>' +
    '<li><a href="pricing.html" data-nav="pricing">Pricing</a></li>' +
    '<li><a href="index.html#how-it-works" data-nav="how">How It Works</a></li>' +
    '</ul>' +
    '<div class="sh-auth">' +
    '<a href="https://app.hedlyner.com/login" class="sh-btn sh-btn-ghost">Log In</a>' +
    '<a href="demo.html" class="sh-btn sh-btn-primary">Book a Demo</a>' +
    '</div>' +
    '</div>' +
    '</header>';

  // Login modal markup — mirrors the live hedlyner.com sign-in modal.
  var ICON_CLOSE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var ICON_MAIL = '<svg class="hl-lead" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
  var ICON_LOCK = '<svg class="hl-lead" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  var ICON_EYE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
  var ICON_GOOGLE = '<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';

  var MODAL_HTML = '' +
    '<div id="hl-login-overlay" class="hl-modal-overlay" role="dialog" aria-modal="true" aria-label="Log in to Hedlyner">' +
    '<div class="hl-modal">' +
    '<button type="button" class="hl-modal-close" aria-label="Close">' + ICON_CLOSE + '</button>' +
    '<h2>Welcome to Hedlyner</h2>' +
    '<p class="hl-sub">Sign in to your account to continue</p>' +
    '<button type="button" class="hl-google">' + ICON_GOOGLE + 'Continue with Google</button>' +
    '<div class="hl-divider">or</div>' +
    '<form novalidate>' +
    '<div class="hl-field"><label for="hl-email">Email</label>' +
    '<div class="hl-input">' + ICON_MAIL + '<input id="hl-email" type="email" placeholder="Enter your email" autocomplete="email"></div></div>' +
    '<div class="hl-field"><label for="hl-pw">Password</label>' +
    '<div class="hl-input">' + ICON_LOCK + '<input id="hl-pw" type="password" placeholder="Enter your password" autocomplete="current-password">' +
    '<button type="button" class="hl-eye" aria-label="Show password">' + ICON_EYE + '</button></div></div>' +
    '<button type="submit" class="hl-submit">Sign in</button>' +
    '</form>' +
    '<a class="hl-forgot" href="#">Forgot your password?</a>' +
    '<p class="hl-alt">Don\'t have an account? <a href="#" class="hl-signup">Sign up</a></p>' +
    '</div>' +
    '</div>';

  function initLogoAnimation(mount) {
    var brand = mount.querySelector('.sh-brand');
    if (!brand) return;
    var staticSvg = brand.querySelector('.sh-logo-static');
    var barsSvg = brand.querySelector('.sh-logo-bars');
    var rects = barsSvg.querySelectorAll('rect');

    var bars = LOGO_FRAMES[0].map(function (b) { return { x: b.x, y: b.y, height: b.height }; });
    var running = false;
    var timer = null;

    function render() {
      for (var i = 0; i < rects.length; i++) {
        rects[i].setAttribute('y', bars[i].y);
        rects[i].setAttribute('height', bars[i].height);
      }
    }

    function step1(a, b) { return a < b ? a + 1 : a > b ? a - 1 : a; }

    function reached(target) {
      for (var i = 0; i < bars.length; i++) {
        if (bars[i].y !== target[i].y || bars[i].height !== target[i].height) return false;
      }
      return true;
    }

    function morphToward(target, done) {
      if (!running) return;
      if (reached(target)) { done(); return; }
      bars = bars.map(function (b, i) {
        return { x: b.x, y: step1(b.y, target[i].y), height: step1(b.height, target[i].height) };
      });
      render();
      timer = setTimeout(function () { morphToward(target, done); }, 0);
    }

    function loop(idx) {
      if (!running) return;
      timer = setTimeout(function () {
        if (!running) return;
        var nextIdx = (idx + 1) % LOGO_FRAMES.length;
        morphToward(LOGO_FRAMES[nextIdx], function () { loop(nextIdx); });
      }, LOGO_INTERVAL);
    }

    function reset() {
      bars = LOGO_FRAMES[0].map(function (b) { return { x: b.x, y: b.y, height: b.height }; });
      render();
    }

    brand.addEventListener('mouseenter', function () {
      if (running) return;
      running = true;
      staticSvg.style.display = 'none';
      barsSvg.style.display = 'block';
      reset();
      loop(0);
    });

    brand.addEventListener('mouseleave', function () {
      running = false;
      if (timer) clearTimeout(timer);
      reset();
      barsSvg.style.display = 'none';
      staticSvg.style.display = 'block';
    });
  }

  /* -------------------------------------------------------------------------
     Auto-hide: header stays fixed at the top but slides out of view when the
     cursor moves away from the top of the page, and slides back in when the
     cursor returns to the top zone (or hovers the header). Pointer devices
     only — on touch screens the header stays fixed and always visible.
     ------------------------------------------------------------------------- */
  function initAutoHide(mount) {
    var header = mount.querySelector('.site-header');
    if (!header) return;

    // Only auto-hide where there's a real hovering pointer (mouse/trackpad).
    var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    var REVEAL_ZONE = 100; // px from the top of the viewport that reveals the header

    function show() { header.classList.remove('sh-hidden'); }
    function hide() {
      // Never hide while a header control holds keyboard focus.
      if (header.contains(document.activeElement)) return;
      header.classList.add('sh-hidden');
    }

    document.addEventListener('mousemove', function (e) {
      if (e.clientY <= REVEAL_ZONE || header.matches(':hover')) {
        show();
      } else {
        hide();
      }
    });

    // Hide once the cursor leaves the browser window entirely.
    document.addEventListener('mouseleave', hide);

    // Keep the header visible during keyboard navigation of its links/buttons.
    header.addEventListener('focusin', show);
    header.addEventListener('focusout', function () {
      if (!header.contains(document.activeElement)) hide();
    });
  }

  /* -------------------------------------------------------------------------
     Login modal: any link that points at a /login URL (the header "Log In"
     plus in-page CTAs) opens this modal instead of navigating to a page that
     doesn't exist — matching the live hedlyner.com behavior.
     ------------------------------------------------------------------------- */
  function initLoginModal() {
    if (document.getElementById('hl-login-overlay')) return;

    var holder = document.createElement('div');
    holder.innerHTML = MODAL_HTML;
    var overlay = holder.firstChild;
    document.body.appendChild(overlay);

    function open(e) {
      if (e) e.preventDefault();
      overlay.classList.add('hl-open');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKey);
      var email = overlay.querySelector('#hl-email');
      if (email) setTimeout(function () { email.focus(); }, 40);
    }
    function close() {
      overlay.classList.remove('hl-open');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    overlay.querySelector('.hl-modal-close').addEventListener('click', close);

    var eye = overlay.querySelector('.hl-eye');
    if (eye) {
      eye.addEventListener('click', function () {
        var pw = overlay.querySelector('#hl-pw');
        var show = pw.type === 'password';
        pw.type = show ? 'text' : 'password';
        eye.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
    }

    // Prototype: form, forgot-password and sign-up links are visual only.
    var form = overlay.querySelector('form');
    if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });
    overlay.querySelectorAll('a[href="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); });
    });

    // Wire every login link on the page (header + in-page CTAs) to the modal.
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href') || '';
      if (/\/login(?:[/?#]|$)/i.test(href)) {
        links[i].addEventListener('click', open);
      }
    }

    window.hlOpenLogin = open;
  }

  function render() {
    var mount = document.getElementById('site-header');
    if (!mount) return;
    mount.innerHTML = HEADER_HTML;

    // Active-link detection from current pathname
    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var map = {
      'for-bookers.html': 'for-bookers',
      'for-artists.html': 'for-artists',
      'pricing.html': 'pricing',
      'index.html': 'home',
      '': 'home'
    };
    var key = map[path];
    if (key && key !== 'home') {
      var active = mount.querySelector('[data-nav="' + key + '"]');
      if (active) active.classList.add('active');
    }

    initLogoAnimation(mount);
    initAutoHide(mount);
    initLoginModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
