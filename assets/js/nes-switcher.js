// ==========================================================================
// NES Retro UI Layout Switcher Engine
// Guild of Monster Girls Wiki
// ==========================================================================
(function() {
  var STORAGE_KEY = 'gmg-theme-mode';

  // Play retro 8-bit sound on click using Web Audio API
  function playRetroBeep(isNes) {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(isNes ? 440 : 220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isNes ? 880 : 330, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch(e) {}
  }

  function isNesMode() {
    return localStorage.getItem(STORAGE_KEY) === 'nes';
  }

  function ensureStylesheet() {
    if (!document.getElementById('nesThemeCss')) {
      // Find relative path to assets/css/nes-theme.css
      var depth = (window.location.pathname.match(/\//g) || []).length;
      var pathPrefix = '';
      // If we are in a subfolder like units/ or keywords/
      if (window.location.pathname.indexOf('/units/') !== -1 || window.location.pathname.indexOf('/keywords/') !== -1) {
        pathPrefix = '../';
      }
      var link = document.createElement('link');
      link.id = 'nesThemeCss';
      link.rel = 'stylesheet';
      link.href = pathPrefix + 'assets/css/nes-theme.css';
      document.head.appendChild(link);
    }
  }

  function applyTheme(isNes) {
    ensureStylesheet();
    if (isNes) {
      document.documentElement.classList.add('nes-theme');
      document.body && document.body.classList.add('nes-theme');
    } else {
      document.documentElement.classList.remove('nes-theme');
      document.body && document.body.classList.remove('nes-theme');
    }
    updateButtonLabels(isNes);
  }

  function updateButtonLabels(isNes) {
    var btns = document.querySelectorAll('.nes-layout-switch');
    btns.forEach(function(btn) {
      if (isNes) {
        btn.innerHTML = '&#9733; 8-BIT NES ON';
        btn.title = 'Click to switch back to Classic Dark Theme';
      } else {
        btn.innerHTML = '&#9654; SWITCH TO NES UI';
        btn.title = 'Click to switch to 8-Bit Retro NES Theme';
      }
    });
  }

  window.toggleGmgTheme = function() {
    var nextIsNes = !isNesMode();
    localStorage.setItem(STORAGE_KEY, nextIsNes ? 'nes' : 'classic');
    applyTheme(nextIsNes);
    playRetroBeep(nextIsNes);
  };

  function injectSwitcherButton() {
    var navs = document.querySelectorAll('aside.sidenav, aside.mgg-sidenav');
    navs.forEach(function(nav) {
      if (nav.querySelector('.nes-layout-switch')) return;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nes-layout-switch';
      btn.onclick = window.toggleGmgTheme;

      // Insert right after the brand link
      var brand = nav.querySelector('.brand, .mgg-brand');
      if (brand && brand.nextSibling) {
        nav.insertBefore(btn, brand.nextSibling);
      } else {
        nav.prepend(btn);
      }
    });
    updateButtonLabels(isNesMode());
  }

  // Apply immediately before DOM render to prevent flash
  if (isNesMode()) {
    document.documentElement.classList.add('nes-theme');
    ensureStylesheet();
  }

  // Inject buttons once DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      applyTheme(isNesMode());
      injectSwitcherButton();
    });
  } else {
    applyTheme(isNesMode());
    injectSwitcherButton();
  }
})();
