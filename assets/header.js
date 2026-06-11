/* =========================================================================
   Hedlyner — Global Site Header Loader
   Injects the unified header into <div id="site-header"></div> on any page.
   Auto-marks the active link from the current pathname.
========================================================================= */
(function () {
  var HEADER_HTML = '' +
    '<header class="site-header">' +
      '<div class="sh-wrap">' +
        '<a href="index.html" class="sh-brand" data-nav="home">' +
          '<svg width="26" height="28" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M8.86104 38.9833C4.95936 41.3198 0 38.5091 0 33.9613V7.81691C0 1.75321 6.61248 -1.99445 11.8147 1.12085L33.5649 14.1457C37.3599 16.4183 37.3599 21.9171 33.5649 24.1897L25.4196 29.0675C22.8184 30.6251 19.5122 28.7513 19.5122 25.7195V20.1433C19.5122 17.8534 17.6558 15.997 15.3659 15.997C13.0759 15.997 11.2195 17.8534 11.2195 20.1433V35.3593C11.2195 36.7312 10.4991 38.0024 9.322 38.7073L8.86104 38.9833Z" fill="#CDEB09"/>' +
          '</svg>' +
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
