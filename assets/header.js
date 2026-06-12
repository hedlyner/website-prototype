/* =========================================================================
   Hedlyner — Global Site Header Loader
   Injects the unified header into <div id="site-header"></div> on any page.
   Auto-marks the active link from the current pathname.
   Logo: static flag mark that swaps to the animated equalizer bars on hover
   (ported from hedlyner-ui-v5 AnimatedLogo / useAnimatedLogo / logoAnimation).
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
          '<a href="https://hedlyner.com/demo" class="sh-btn sh-btn-primary">Book a Demo</a>' +
        '</div>' +
      '</div>' +
    '</header>';

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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
