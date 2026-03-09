/**
 * Export PDF using html2pdf.js — pixel-perfect match with preview.
 * isGuest=true  → adds diagonal watermarks to PDF
 * isGuest=false → clean PDF, no watermarks
 */
export async function exportBiodataPDF(elementId, filename = 'biodata', isGuest = false) {
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Template element not found: ' + elementId);

    // Deep clone so we don't mutate the live DOM
    const clone = element.cloneNode(true);
    clone.style.maxWidth = '680px';
    clone.style.width = '680px';
    clone.style.position = 'relative';
    clone.style.overflow = 'visible';

    // Add watermarks for guests
    if (isGuest) {
      [25, 50, 75].forEach((top) => {
        const wm = document.createElement('div');
        Object.assign(wm.style, {
          position: 'absolute',
          top: `${top}%`,
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-35deg)',
          fontSize: '46px',
          fontWeight: '900',
          color: 'rgba(160, 20, 20, 0.10)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: '9999',
          fontFamily: 'Georgia, serif',
          letterSpacing: '0.06em',
          userSelect: 'none',
          lineHeight: '1',
        });
        wm.textContent = 'ShaadiBio — SAMPLE';
        clone.appendChild(wm);
      });
    }

    const opt = {
      margin: [6, 6, 6, 6],
      filename: `${filename}-biodata.pdf`,
      image: { type: 'jpeg', quality: 0.97 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 700,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      },
      pagebreak: { mode: ['avoid-all', 'css'] },
    };

    await html2pdf().set(opt).from(clone).save();
    return true;
  } catch (err) {
    console.error('PDF export error:', err);
    // Fallback to print dialog
    printBiodata(elementId, isGuest);
    return false;
  }
}

/**
 * Open a dedicated print window with fonts loaded — fixes the
 * "window.print() prints the whole page" bug from PreviewPage.
 * isGuest=true  → adds watermarks in print
 * isGuest=false → clean print
 */
export function printBiodata(elementId, isGuest = false) {
  const el = document.getElementById(elementId);
  if (!el) {
    console.error('printBiodata: element not found:', elementId);
    return;
  }

  // Deep clone
  const clone = el.cloneNode(true);
  clone.style.maxWidth = '680px';
  clone.style.width = '100%';
  clone.style.margin = '0 auto';
  clone.style.position = 'relative';

  // Add watermarks for guests
  if (isGuest) {
    [25, 50, 75].forEach((top) => {
      const wm = document.createElement('div');
      Object.assign(wm.style, {
        position: 'absolute',
        top: `${top}%`,
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-35deg)',
        fontSize: '52px',
        fontWeight: '900',
        color: 'rgba(160, 20, 20, 0.10)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: '9999',
        fontFamily: 'Georgia, serif',
        letterSpacing: '0.06em',
        userSelect: 'none',
      });
      wm.textContent = 'ShaadiBio — SAMPLE';
      clone.appendChild(wm);
    });
  }

  const win = window.open('', '_blank', 'width=800,height=900');
  if (!win) {
    alert('Please allow popups for this site to use the Print feature.');
    return;
  }

  win.document.open();
  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ShaadiBio — Print</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&family=Noto+Serif+Devanagari:wght@400;600&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0; padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body { background: white; width: 100%; font-family: Lato, sans-serif; }
    body { padding: 12px; }
    img { max-width: 100%; }
    @media print {
      @page { margin: 8mm; size: A4 portrait; }
      body { padding: 0; margin: 0; }
    }
  </style>
</head>
<body>
  <div style="max-width:680px;margin:0 auto;position:relative;">
    ${clone.outerHTML}
  </div>
  <script>
    var fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    fontsReady.then(function() {
      setTimeout(function() { window.print(); }, 800);
    });
    window.onafterprint = function() { window.close(); };
  </script>
</body>
</html>`);
  win.document.close();
}
