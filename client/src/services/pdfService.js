/**
 * Export PDF using html2pdf.js — pixel-perfect match with preview.
 * isGuest=true  → adds diagonal watermarks to PDF
 * isGuest=false → clean PDF, no watermarks
 *
 * ROOT CAUSE OF TEXT SHIFTING:
 * html2canvas renders a detached (off-DOM) clone → fonts fall back to system
 * defaults, flex/grid layouts collapse, inherited CSS is lost → text shifts.
 *
 * FIX: Mount the clone in the live document (hidden off-screen at left:-9999px)
 * BEFORE passing it to html2pdf. The browser then fully resolves fonts, layout,
 * and inherited styles. Two rAF frames give the engine time to paint before
 * capture. The container is removed in a finally block no matter what.
 */
export async function exportBiodataPDF(elementId, filename = 'biodata', isGuest = false) {
  let container = null;

  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Template element not found: ' + elementId);

    // Wait for all web fonts to finish loading
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Deep-clone so we never touch the live element
    const clone = element.cloneNode(true);

    // Lock width to exactly 680 px — same as what the user sees in the preview
    clone.style.width        = '680px';
    clone.style.maxWidth     = '680px';
    clone.style.minWidth     = '680px';
    clone.style.boxSizing    = 'border-box';
    clone.style.position     = 'relative';
    clone.style.overflow     = 'visible';

    // Watermarks for guest users
    if (isGuest) {
      [25, 50, 75].forEach(function(top) {
        const wm = document.createElement('div');
        Object.assign(wm.style, {
          position:       'absolute',
          top:            top + '%',
          left:           '50%',
          transform:      'translate(-50%, -50%) rotate(-35deg)',
          fontSize:       '46px',
          fontWeight:     '900',
          color:          'rgba(160, 20, 20, 0.10)',
          whiteSpace:     'nowrap',
          pointerEvents:  'none',
          zIndex:         '9999',
          fontFamily:     'Georgia, serif',
          letterSpacing:  '0.06em',
          userSelect:     'none',
          lineHeight:     '1',
        });
        wm.textContent = 'ShaadiBio \u2014 SAMPLE';
        clone.appendChild(wm);
      });
    }

    // ── KEY FIX ───────────────────────────────────────────────────────────────
    // Attach the clone to the live document inside a hidden off-screen wrapper.
    // This forces the browser to:
    //   1. Resolve @font-face (Playfair Display, Lato, Noto Serif Devanagari)
    //   2. Compute flex/grid layout at exactly 680 px
    //   3. Inherit all CSS custom properties and cascade rules
    // html2canvas then screenshots a fully-rendered node instead of a detached
    // skeleton where everything collapses to browser defaults.
    // ─────────────────────────────────────────────────────────────────────────
    container = document.createElement('div');
    Object.assign(container.style, {
      position:      'fixed',
      top:           '0',
      left:          '-9999px',
      width:         '680px',
      zIndex:        '-1',
      opacity:       '0',
      pointerEvents: 'none',
    });
    container.appendChild(clone);
    document.body.appendChild(container);

    // Two rAF frames: first schedules a paint, second confirms it completed
    await new Promise(function(resolve) {
      requestAnimationFrame(function() {
        requestAnimationFrame(resolve);
      });
    });

    const opt = {
      margin: [6, 6, 6, 6],
      filename: filename + '-biodata.pdf',
      image: { type: 'jpeg', quality: 0.97 },
      html2canvas: {
        scale:           2,
        useCORS:         true,
        logging:         false,
        allowTaint:      true,
        backgroundColor: '#ffffff',
        windowWidth:     680,  // match container width exactly
        width:           680,
      },
      jsPDF: {
        unit:        'mm',
        format:      'a4',
        orientation: 'portrait',
        compress:    true,
      },
      pagebreak: { mode: ['avoid-all', 'css'] },
    };

    // Pass the live-mounted clone — not a detached node
    await html2pdf().set(opt).from(clone).save();
    return true;

  } catch (err) {
    console.error('PDF export error:', err);
    printBiodata(elementId, isGuest);
    return false;

  } finally {
    // Always remove the hidden container, even if an error was thrown
    if (container && document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Open a dedicated print window with fonts loaded.
 * isGuest=true  → watermarks in print
 * isGuest=false → clean print
 */
export function printBiodata(elementId, isGuest) {
  if (isGuest === undefined) isGuest = false;

  const el = document.getElementById(elementId);
  if (!el) {
    console.error('printBiodata: element not found:', elementId);
    return;
  }

  const clone = el.cloneNode(true);
  clone.style.maxWidth = '680px';
  clone.style.width    = '100%';
  clone.style.margin   = '0 auto';
  clone.style.position = 'relative';

  if (isGuest) {
    [25, 50, 75].forEach(function(top) {
      const wm = document.createElement('div');
      Object.assign(wm.style, {
        position:       'absolute',
        top:            top + '%',
        left:           '50%',
        transform:      'translate(-50%, -50%) rotate(-35deg)',
        fontSize:       '52px',
        fontWeight:     '900',
        color:          'rgba(160, 20, 20, 0.10)',
        whiteSpace:     'nowrap',
        pointerEvents:  'none',
        zIndex:         '9999',
        fontFamily:     'Georgia, serif',
        letterSpacing:  '0.06em',
        userSelect:     'none',
      });
      wm.textContent = 'ShaadiBio \u2014 SAMPLE';
      clone.appendChild(wm);
    });
  }

  const win = window.open('', '_blank', 'width=800,height=900');
  if (!win) {
    alert('Please allow popups for this site to use the Print feature.');
    return;
  }

  win.document.open();
  win.document.write('<!DOCTYPE html>\n'
    + '<html lang="en"><head>\n'
    + '<meta charset="UTF-8"/>\n'
    + '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>\n'
    + '<title>ShaadiBio \u2014 Print</title>\n'
    + '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&family=Noto+Serif+Devanagari:wght@400;600&display=swap" rel="stylesheet"/>\n'
    + '<style>\n'
    + '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0;\n'
    + '  -webkit-print-color-adjust: exact !important;\n'
    + '  print-color-adjust: exact !important; }\n'
    + 'html, body { background: white; width: 100%; font-family: Lato, sans-serif; }\n'
    + 'body { padding: 12px; }\n'
    + 'img { max-width: 100%; }\n'
    + '@media print {\n'
    + '  @page { margin: 8mm; size: A4 portrait; }\n'
    + '  body { padding: 0; margin: 0; }\n'
    + '}\n'
    + '</style></head><body>\n'
    + '<div style="max-width:680px;margin:0 auto;position:relative;">\n'
    + clone.outerHTML
    + '\n</div>\n'
    + '<script>\n'
    + 'var fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();\n'
    + 'fontsReady.then(function() {\n'
    + '  setTimeout(function() { window.print(); }, 800);\n'
    + '});\n'
    + 'window.onafterprint = function() { window.close(); };\n'
    + '</scr' + 'ipt>\n'
    + '</body></html>'
  );
  win.document.close();
}