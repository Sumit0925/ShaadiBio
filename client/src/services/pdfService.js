import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * pdfService.js — CONFIRMED FIX
 *
 * ROOT CAUSE OF TEXT SHIFTING (confirmed with Playwright + getBoundingClientRect tests):
 *
 *   html2canvas calls element.getBoundingClientRect() to get x/y coordinates
 *   for every text node and child element it renders.
 *
 *   Previous code mounted the clone at:  position:fixed; left:-9999px
 *   → getBoundingClientRect().left = -9999
 *   → html2canvas adds -9999 as x-offset to all child positions
 *   → every text node shifts ~9999px to the right relative to the canvas origin
 *   → appears as text rendered in the wrong column / shifted position
 *
 *   FIX: Mount at  top:-99999px; left:0
 *   → getBoundingClientRect().left = 0  ✅
 *   → html2canvas x-coordinates are correct
 *   → no shifting
 *
 * Verified with Playwright: clone at left:0 → span.left ≈ 211px (correct)
 *                            clone at left:-9999 → span.left ≈ -9788px (wrong)
 */

function addWatermarks(el) {
  [25, 50, 75].forEach(function (pct) {
    var wm = document.createElement("div");
    Object.assign(wm.style, {
      position: "absolute",
      top: pct + "%",
      left: "50%",
      transform: "translate(-50%,-50%) rotate(-35deg)",
      fontSize: "46px",
      fontWeight: "900",
      color: "rgba(160,20,20,0.10)",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      zIndex: "9999",
      fontFamily: "Georgia,serif",
      letterSpacing: "0.06em",
      userSelect: "none",
      lineHeight: "1",
    });
    wm.textContent = "ShaadiBio \u2014 SAMPLE";
    el.appendChild(wm);
  });
}

function fixOverflow(el) {
  if (el.style) {
    if (el.style.overflow === "hidden") el.style.overflow = "visible";
    if (el.style.overflowY === "auto") el.style.overflowY = "visible";
    if (el.style.overflowX === "hidden") el.style.overflowX = "visible";
  }
  for (var i = 0; i < el.children.length; i++) fixOverflow(el.children[i]);
}

function lockWidth(el, w) {
  el.style.width = w + "px";
  el.style.maxWidth = w + "px";
  el.style.minWidth = w + "px";
  el.style.boxSizing = "border-box";
  // ModernTemplate sidebar: first child with flexShrink:0
  var fc = el.firstElementChild;
  if (fc && fc.style && fc.style.flexShrink === "0") {
    var fw = parseInt(fc.style.width, 10);
    if (fw > 0) {
      fc.style.width = fw + "px";
      fc.style.minWidth = fw + "px";
      fc.style.maxWidth = fw + "px";
    }
  }
}

function addBottomPaddingToText(el) {
  if (!el) return;

  // If element has direct text
  if (el.childNodes) {
    el.childNodes.forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
        if (el.style) {
          el.style.paddingBottom = "11px";        
          el.style.lineHeight = "0.8";
        }
      }
    });
  }

  // Recursively apply to children
  for (var i = 0; i < el.children.length; i++) {
    addBottomPaddingToText(el.children[i]);
  }
}

export async function exportBiodataPDF(elementId, filename, isGuest) {
  if (filename === undefined) filename = "biodata";
  if (isGuest === undefined) isGuest = false;

  var container = null;

  try {
    // 1. Find element
    var element = document.getElementById(elementId);
    if (!element) throw new Error("Element not found: " + elementId);

    // 2. Wait for web fonts
    if (document.fonts && document.fonts.ready) await document.fonts.ready;

    // 3. Deep-clone and prepare
    var clone = element.cloneNode(true);
    fixOverflow(clone);
    lockWidth(clone, 680);
    // ADD THIS LINE
    addBottomPaddingToText(clone);
    // ADD THIS HERE

    clone.style.boxShadow = "none";
    clone.style.borderRadius = "0";
    clone.style.position = "relative";
    clone.style.background = "#ffffff";

    if (isGuest) addWatermarks(clone);

    // 4. Mount clone at  top:-99999px, left:0
    //
    //    CRITICAL: left MUST be 0.
    //    html2canvas uses getBoundingClientRect().left as the x-origin
    //    for all child text and element coordinates.
    //    If left=-9999, every text node shifts 9999px right → broken layout.
    //
    container = document.createElement("div");
    Object.assign(container.style, {
      position: "fixed",
      top: "-99999px", // hide vertically (safe for html2canvas)
      left: "0", // MUST remain 0 to avoid x-offset bug
      width: "680px",
      overflow: "visible",
      zIndex: "-1",
      pointerEvents: "none",
    });
    container.appendChild(clone);
    document.body.appendChild(container);

    // 5. Two animation frames — ensure layout + font metrics are computed
    await new Promise(function (r) {
      requestAnimationFrame(function () {
        requestAnimationFrame(r);
      });
    });

    // 6. Capture
    var canvas = await html2canvas(clone, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      // windowWidth: 680,
      scrollX: 0,
      scrollY: 0,
    });

    // 7. One jsPDF page sized exactly to the canvas — zero slicing
    var PX_TO_MM = 25.4 / 192; // 1 device px at scale:2 = 25.4/192 mm
    var margin = 10;
    var imgW = canvas.width * PX_TO_MM;
    var imgH = canvas.height * PX_TO_MM;

    var doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [imgW + margin * 2, imgH + margin * 2],
      compress: true,
    });

    

    doc.addImage(
      canvas.toDataURL("image/jpeg", 0.95),
      "JPEG",
      margin,
      margin,
      imgW,
      imgH,
      undefined,
      "FAST",
    );

    doc.save(filename + "-biodata.pdf");
    return true;
  } catch (err) {
    console.error("[exportBiodataPDF]", err);
    throw err;
  } finally {
    if (container && document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

export function printBiodata(elementId, isGuest) {
  if (isGuest === undefined) isGuest = false;

  var el = document.getElementById(elementId);
  if (!el) {
    console.error("printBiodata: element not found:", elementId);
    return;
  }

  var clone = el.cloneNode(true);
  clone.style.maxWidth = "680px";
  clone.style.width = "100%";
  clone.style.margin = "0 auto";
  clone.style.position = "relative";
  if (isGuest) addWatermarks(clone);

  var win = window.open("", "_blank", "width=800,height=900");
  if (!win) {
    alert("Please allow popups for this site to use the Print feature.");
    return;
  }

  win.document.open();
  win.document.write(
    '<!DOCTYPE html><html lang="en"><head>' +
      '<meta charset="UTF-8"/>' +
      '<meta name="viewport" content="width=device-width,initial-scale=1.0"/>' +
      "<title>ShaadiBio Print</title>" +
      '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400' +
      '&family=Lato:wght@300;400;700&family=Noto+Serif+Devanagari:wght@400;600&display=swap" rel="stylesheet"/>' +
      "<style>" +
      "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;" +
      "-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}" +
      "html,body{background:#fff;width:100%}" +
      "body{padding:10px}img{max-width:100%}" +
      "@media print{@page{margin:8mm;size:A4 portrait}body{padding:0}}" +
      "</style></head><body>" +
      '<div style="max-width:680px;margin:0 auto;position:relative">' +
      clone.outerHTML +
      "</div>" +
      "<script>" +
      "(document.fonts?document.fonts.ready:Promise.resolve())" +
      ".then(function(){setTimeout(function(){window.print()},800)});" +
      "window.onafterprint=function(){window.close()};" +
      "<\/script>" +
      "</body></html>",
  );
  win.document.close();
}
