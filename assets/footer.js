/* =========================================================================
   Hedlyner — Global Site Footer Loader
   Injects newsletter + footer into <div id="site-footer"></div>.
========================================================================= */
(function () {
  var FOOTER_HTML = '' +
    '<div class="site-footer">' +
      '<section class="sf-newsletter">' +
        '<div class="sf-newsletter-inner">' +
          '<h3>Stay in the loop</h3>' +
          '<p>Industry news, platform updates, and tips for talent buyers — straight to your inbox. No fluff.</p>' +
          '<form class="sf-form" id="newsletterForm">' +
            '<input type="email" id="newsletterEmail" placeholder="your@email.com" required autocomplete="email" />' +
            '<button type="submit" id="newsletterBtn">Subscribe</button>' +
          '</form>' +
          '<label class="sf-consent">' +
            '<input type="checkbox" id="newsletterConsent" required />' +
            'I agree to receive marketing emails from Hedlyner. Unsubscribe anytime.' +
          '</label>' +
          '<p class="sf-msg" id="newsletterMsg"></p>' +
        '</div>' +
      '</section>' +
      '<footer class="sf-foot">' +
        '<div class="sf-foot-inner">' +
          '<div class="sf-brand">' +
            '<a href="index.html">' +
              '<svg viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.86104 38.9833C4.95936 41.3198 0 38.5091 0 33.9613V7.81691C0 1.75321 6.61248 -1.99445 11.8147 1.12085L33.5649 14.1457C37.3599 16.4183 37.3599 21.9171 33.5649 24.1897L25.4196 29.0675C22.8184 30.6251 19.5122 28.7513 19.5122 25.7195V20.1433C19.5122 17.8534 17.6558 15.997 15.3659 15.997C13.0759 15.997 11.2195 17.8534 11.2195 20.1433V35.3593C11.2195 36.7312 10.4991 38.0024 9.322 38.7073L8.86104 38.9833Z" fill="#CDEB09"/></svg>' +
              '<span class="sf-wm">HEDLYNER</span>' +
            '</a>' +
            '<p>Booking talent made easy.<br>Built by and for the live music industry.</p>' +
          '</div>' +
          '<div class="sf-col">' +
            '<h5>Product</h5>' +
            '<ul>' +
              '<li><a href="for-artists.html">For Talent</a></li>' +
              '<li><a href="for-bookers.html">For Bookers</a></li>' +
              '<li><a href="pricing.html">Pricing</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="sf-col">' +
            '<h5>Company</h5>' +
            '<ul>' +
              '<li><a href="about.html">About</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="sf-col">' +
            '<h5>Legal</h5>' +
            '<ul>' +
              '<li><a href="https://hedlyner.com/terms">Terms</a></li>' +
              '<li><a href="https://hedlyner.com/privacy">Privacy</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="sf-bottom">' +
          '<p>© 2026 Hedlyner, Inc. — Make Music. Make Moments. Make Money.</p>' +
        '</div>' +
      '</footer>' +
    '</div>';

  function handleSubmit(e) {
    e.preventDefault();
    var email = document.getElementById('newsletterEmail');
    var consent = document.getElementById('newsletterConsent');
    var msg = document.getElementById('newsletterMsg');
    if (!email || !msg) return;
    if (consent && !consent.checked) {
      msg.className = 'sf-msg error';
      msg.textContent = 'Please agree to receive marketing emails.';
      return;
    }
    msg.className = 'sf-msg success';
    msg.textContent = 'Thanks! Check your inbox to confirm.';
    email.value = '';
    if (consent) consent.checked = false;
  }

  function render() {
    var mount = document.getElementById('site-footer');
    if (!mount) return;
    mount.innerHTML = FOOTER_HTML;
    var form = document.getElementById('newsletterForm');
    if (form) form.addEventListener('submit', handleSubmit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
