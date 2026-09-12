// Star Academy Lahore - Export PDF & WhatsApp Share Utilities
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { STAR_ACADEMY_LOGO_BASE64 } from '../constants/logoData';
import { FAYSAL_BANK_QR_BASE64, OFFICIAL_BANK_DETAILS } from '../constants/bankQrCode';
import { getAttendanceSessions, getFeeVouchers, getMarksheets, getBanks } from './storage';

/**
 * Trigger native Print / Save as PDF using an offscreen printable window
 */
export function printHtmlAsPDF(title, bodyContent, orientation = 'portrait') {
  const isLandscape = orientation === 'landscape';
  const printWindow = window.open('', '_blank', isLandscape ? 'width=1150,height=800' : 'width=850,height=900');
  if (!printWindow) {
    // If popup blocked, create an invisible iframe fallback
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(getCompleteHtmlDocument(title, bodyContent, orientation));
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 400);
    return;
  }

  printWindow.document.open();
  printWindow.document.write(getCompleteHtmlDocument(title, bodyContent, orientation));
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };

  setTimeout(() => {
    try {
      printWindow.focus();
      printWindow.print();
    } catch (e) {
      // Ignored if already printed
    }
  }, 500);
}

function getCompleteHtmlDocument(title, content, orientation = 'portrait') {
  const isLandscape = orientation === 'landscape';
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title} - Star Academy Lahore</title>
        <style>
          @page {
            size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'};
            margin: ${isLandscape ? '10mm 14mm' : '14mm 12mm'};
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #1e293b;
            background: #ffffff;
            margin: 0;
            padding: 0;
            font-size: 11pt;
            line-height: 1.4;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2.5px solid #4338ca;
            padding-bottom: 12px;
            margin-bottom: 16px;
          }
          .academy-title {
            color: #312e81;
            font-size: 20pt;
            font-weight: 900;
            margin: 0;
            letter-spacing: -0.5px;
            text-transform: uppercase;
          }
          .academy-sub {
            color: #6366f1;
            font-size: 9.5pt;
            font-weight: 700;
            margin: 2px 0 0 0;
          }
          .doc-badge {
            background: #eef2ff;
            color: #3730a3;
            border: 1px solid #c7d2fe;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 8.5pt;
            font-weight: 800;
            text-transform: uppercase;
            text-align: right;
          }
          .section-title {
            color: #0f172a;
            font-size: 13pt;
            font-weight: 800;
            margin: 14px 0 8px 0;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 9.5pt;
          }
          th {
            background-color: #f1f5f9;
            color: #334155;
            font-weight: 800;
            text-align: left;
            padding: 7px 10px;
            border: 1px solid #cbd5e1;
          }
          td {
            padding: 6px 10px;
            border: 1px solid #e2e8f0;
            color: #1e293b;
          }
          tr:nth-child(even) td {
            background-color: #f8fafc;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px 16px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 14px;
            font-size: 9.5pt;
          }
          .info-item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dashed #e2e8f0;
            padding-bottom: 3px;
          }
          .info-label {
            font-weight: 700;
            color: #64748b;
          }
          .info-value {
            font-weight: 800;
            color: #0f172a;
          }
          .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 8.5pt;
            font-weight: 800;
          }
          .badge-green { background: #dcfce7; color: #166534; }
          .badge-blue { background: #dbeafe; color: #1e40af; }
          .badge-amber { background: #fef3c7; color: #92400e; }
          .badge-red { background: #fee2e2; color: #991b1b; }
          .badge-purple { background: #f3e8ff; color: #6b21a8; }
          .badge-late { background: #ffedd5; color: #c2410c; }
          .kpi-table {
            width: 100% !important;
            table-layout: fixed !important;
            border-collapse: separate !important;
            border-spacing: 6px !important;
            margin: 6px 0 10px 0 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            border: none !important;
            background: transparent !important;
          }
          .kpi-cell {
            background: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 6px !important;
            padding: 6px 4px !important;
            text-align: center !important;
            width: 25% !important;
            vertical-align: middle !important;
            box-sizing: border-box !important;
          }
          .kpi-card-grid {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            gap: 6px !important;
            margin: 6px 0 10px 0 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            width: 100% !important;
          }
          .kpi-card {
            flex: 1 1 0 !important;
            width: 25% !important;
            min-width: 0 !important;
            background: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 6px !important;
            padding: 6px 4px !important;
            text-align: center !important;
            box-sizing: border-box !important;
          }
          .kpi-val {
            font-size: 11pt !important;
            font-weight: 800 !important;
            color: #0f172a;
            white-space: nowrap !important;
          }
          .kpi-lbl {
            font-size: 7.5pt !important;
            color: #64748b;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            margin-top: 2px !important;
            white-space: nowrap !important;
          }
          .subject-chip {
            display: inline-block;
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
            padding: 2px 7px;
            border-radius: 4px;
            font-size: 8pt;
            font-weight: 700;
            margin: 2px 3px 2px 0;
          }
          .profile-hero {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            background: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 8px !important;
            padding: 8px 12px !important;
            margin-bottom: 12px !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .profile-avatar {
            width: 48px !important;
            height: 48px !important;
            min-width: 48px !important;
            max-width: 48px !important;
            min-height: 48px !important;
            max-height: 48px !important;
            border-radius: 6px !important;
            object-fit: cover !important;
            border: 1.5px solid #cbd5e1 !important;
            background: #e2e8f0 !important;
            display: block !important;
            flex-shrink: 0 !important;
          }
          .section-title {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .profile-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .footer {
            margin-top: 24px;
            padding-top: 12px;
            border-top: 1px solid #cbd5e1;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 8.5pt;
            color: #64748b;
          }
          .signature-box {
            text-align: center;
            width: 170px;
            border-top: 1.5px solid #0f172a;
            padding-top: 4px;
            font-weight: 800;
            color: #0f172a;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="${STAR_ACADEMY_LOGO_BASE64}" alt="Star Academy Logo" style="width: 56px; height: 56px; object-fit: contain;" />
            <div>
              <h1 class="academy-title">Star Academy Lahore</h1>
              <p class="academy-sub">Excellence in Matric & Intermediate Education</p>
            </div>
          </div>
          <div class="doc-badge">
            ${title}<br />
            <small style="font-weight: 500; color: #64748b;">${new Date().toLocaleDateString('en-GB')}</small>
          </div>
        </div>

        ${content}

        <div class="footer">
          <div>
            Official Star Academy Records System • Printed on ${new Date().toLocaleString('en-US')}<br />
            System generated document. For verifications, contact Star Academy admin desk.
          </div>
          <div class="signature-box">
            Authorized Signature
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Shared PDF Document Generator using html2canvas & jsPDF directly
 */
function showLoadingToast(msg = 'Generating PDF...') {
  const toast = document.createElement('div');
  toast.id = 'pdf-loading-toast';
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = '#1e293b';
  toast.style.color = '#ffffff';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '9999px';
  toast.style.fontSize = '13px';
  toast.style.fontWeight = '600';
  toast.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
  toast.style.zIndex = '9999999';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '10px';
  toast.innerHTML = `
    <style>
      @keyframes star-spin { to { transform: rotate(360deg); } }
    </style>
    <div style="width:13px;height:13px;border:2px solid #ffffff;border-top-color:transparent;border-radius:50%;animation:star-spin 0.8s linear infinite;"></div>
    <span>${msg}</span>
  `;
  document.body.appendChild(toast);
  return toast;
}

function hideLoadingToast(toast) {
  if (toast && toast.parentNode) {
    toast.parentNode.removeChild(toast);
  }
}

async function generatePdfDocument(title, bodyContent, orientation = 'portrait') {
  const isLandscape = orientation === 'landscape';
  const container = document.createElement('div');
  container.id = 'star-academy-pdf-render';

  // Positioned at top-left document coordinates so html2canvas computes valid positive bounds,
  // placed behind root with pointer-events: none so it does not interfere with the user UI
  container.style.position = 'absolute';
  container.style.left = '0px';
  container.style.top = '0px';
  container.style.width = isLandscape ? '1123px' : '794px'; // 297mm A4 landscape or 210mm portrait at 96 DPI
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#1e293b';
  container.style.padding = isLandscape ? '20px 28px' : '24px 30px';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-9999';
  container.style.opacity = '1';
  container.style.pointerEvents = 'none';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  container.style.fontSize = '11pt';
  container.style.lineHeight = '1.4';

  container.innerHTML = `
    <style>
      #star-academy-pdf-render * {
        box-sizing: border-box !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      #star-academy-pdf-render .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2.5px solid #4338ca;
        padding-bottom: 12px;
        margin-bottom: 16px;
      }
      #star-academy-pdf-render .academy-title {
        color: #312e81;
        font-size: 20pt;
        font-weight: 900;
        margin: 0;
        letter-spacing: -0.5px;
        text-transform: uppercase;
      }
      #star-academy-pdf-render .academy-sub {
        color: #6366f1;
        font-size: 9.5pt;
        font-weight: 700;
        margin: 2px 0 0 0;
      }
      #star-academy-pdf-render .doc-badge {
        background: #eef2ff;
        color: #3730a3;
        border: 1px solid #c7d2fe;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 8.5pt;
        font-weight: 800;
        text-transform: uppercase;
        text-align: right;
      }
      #star-academy-pdf-render .section-title {
        color: #0f172a;
        font-size: 13pt;
        font-weight: 800;
        margin: 14px 0 8px 0;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 4px;
      }
      #star-academy-pdf-render table {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0;
        font-size: 9.5pt;
      }
      #star-academy-pdf-render th {
        background-color: #f1f5f9;
        color: #334155;
        font-weight: 800;
        text-align: left;
        padding: 7px 10px;
        border: 1px solid #cbd5e1;
      }
      #star-academy-pdf-render td {
        padding: 6px 10px;
        border: 1px solid #e2e8f0;
        color: #1e293b;
      }
      #star-academy-pdf-render tr:nth-child(even) td {
        background-color: #f8fafc;
      }
      #star-academy-pdf-render .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px 16px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 14px;
        font-size: 9.5pt;
      }
      #star-academy-pdf-render .info-item {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px dashed #e2e8f0;
        padding-bottom: 3px;
      }
      #star-academy-pdf-render .info-label {
        font-weight: 700;
        color: #64748b;
      }
      #star-academy-pdf-render .info-value {
        font-weight: 800;
        color: #0f172a;
      }
      #star-academy-pdf-render .badge {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 8.5pt;
        font-weight: 800;
      }
      #star-academy-pdf-render .badge-green { background: #dcfce7; color: #166534; }
      #star-academy-pdf-render .badge-blue { background: #dbeafe; color: #1e40af; }
      #star-academy-pdf-render .badge-amber { background: #fef3c7; color: #92400e; }
      #star-academy-pdf-render .badge-red { background: #fee2e2; color: #991b1b; }
      #star-academy-pdf-render .badge-purple { background: #f3e8ff; color: #6b21a8; }
      #star-academy-pdf-render .badge-late { background: #ffedd5; color: #c2410c; }
      #star-academy-pdf-render .kpi-table {
        width: 100% !important;
        table-layout: fixed !important;
        border-collapse: separate !important;
        border-spacing: 6px !important;
        margin: 6px 0 10px 0 !important;
        border: none !important;
        background: transparent !important;
      }
      #star-academy-pdf-render .kpi-cell {
        background: #f8fafc !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 6px !important;
        padding: 6px 4px !important;
        text-align: center !important;
        width: 25% !important;
        vertical-align: middle !important;
        box-sizing: border-box !important;
      }
      #star-academy-pdf-render .kpi-card-grid {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        gap: 6px !important;
        margin: 6px 0 10px 0 !important;
        width: 100% !important;
      }
      #star-academy-pdf-render .kpi-card {
        flex: 1 1 0 !important;
        width: 25% !important;
        min-width: 0 !important;
        background: #f8fafc !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 6px !important;
        padding: 6px 4px !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      #star-academy-pdf-render .kpi-val {
        font-size: 11pt !important;
        font-weight: 800 !important;
        color: #0f172a;
        white-space: nowrap !important;
      }
      #star-academy-pdf-render .kpi-lbl {
        font-size: 7.5pt !important;
        color: #64748b;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        margin-top: 2px !important;
        white-space: nowrap !important;
      }
      #star-academy-pdf-render .subject-chip {
        display: inline-block;
        background: #eff6ff;
        color: #1d4ed8;
        border: 1px solid #bfdbfe;
        padding: 2px 7px;
        border-radius: 4px;
        font-size: 8pt;
        font-weight: 700;
        margin: 2px 3px 2px 0;
      }
      #star-academy-pdf-render .profile-hero {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        background: #f8fafc !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 8px !important;
        padding: 8px 12px !important;
        margin-bottom: 12px !important;
      }
      #star-academy-pdf-render .profile-avatar {
        width: 48px !important;
        height: 48px !important;
        min-width: 48px !important;
        max-width: 48px !important;
        min-height: 48px !important;
        max-height: 48px !important;
        border-radius: 6px !important;
        object-fit: cover !important;
        border: 1.5px solid #cbd5e1 !important;
        background: #e2e8f0 !important;
        display: block !important;
        flex-shrink: 0 !important;
      }
      #star-academy-pdf-render .footer {
        margin-top: 30px;
        padding-top: 14px;
        border-top: 1px solid #cbd5e1;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 8.5pt;
        color: #64748b;
      }
      #star-academy-pdf-render .signature-box {
        text-align: center;
        width: 180px;
        border-top: 1.5px solid #0f172a;
        padding-top: 4px;
        font-weight: 800;
        color: #0f172a;
      }
    </style>
    <div class="header">
      <div style="display: flex; align-items: center; gap: 14px;">
        <img src="${STAR_ACADEMY_LOGO_BASE64}" alt="Star Academy Logo" style="width: 56px; height: 56px; object-fit: contain;" />
        <div>
          <h1 class="academy-title">Star Academy Lahore</h1>
          <p class="academy-sub">Excellence in Matric & Intermediate Education</p>
        </div>
      </div>
      <div class="doc-badge">
        ${title}<br />
        <small style="font-weight: 500; color: #64748b;">${new Date().toLocaleDateString('en-GB')}</small>
      </div>
    </div>

    ${bodyContent}

    <div class="footer">
      <div>
        Official Star Academy Records System • Generated on ${new Date().toLocaleString('en-US')}<br />
        System generated document. For verifications, contact Star Academy admin desk.
      </div>
      <div class="signature-box">
        Authorized Signature
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // Short delay to ensure all DOM elements, fonts, and inline styles are calculated
  await new Promise((resolve) => setTimeout(resolve, 80));

  try {
    const minContentHeight = isLandscape ? 794 : 1123;
    const contentHeight = Math.max(container.scrollHeight, container.offsetHeight, minContentHeight);
    const renderWidth = isLandscape ? 1123 : 794;

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width: renderWidth,
      height: contentHeight,
      windowWidth: isLandscape ? 1200 : 1024,
      windowHeight: contentHeight + 200
    });

    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = isLandscape ? 297 : 210;
    const pageHeight = isLandscape ? 210 : 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage(undefined, isLandscape ? 'landscape' : 'portrait');
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    return pdf;
  } finally {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Direct PDF File Downloader using html2canvas & jsPDF (bypasses browser print dialog)
 */
export async function downloadHtmlAsPDF(title, bodyContent, filename, orientation = 'portrait') {
  const cleanFilename = (filename || title || 'Star_Academy_Document')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_');

  const toast = showLoadingToast('Downloading PDF...');

  try {
    const pdf = await generatePdfDocument(title, bodyContent, orientation);
    pdf.save(`${cleanFilename}.pdf`);
  } catch (err) {
    console.error('Error downloading PDF directly:', err);
    printHtmlAsPDF(title, bodyContent, orientation);
  } finally {
    hideLoadingToast(toast);
  }
}

/**
 * WhatsApp share trigger - shares the downloaded PDF file directly
 */
export async function shareHtmlAsPDFToWhatsApp(title, bodyContent, filename, targetPhone = null, orientation = 'portrait') {
  const cleanFilename = (filename || title || 'Star_Academy_Document')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_');

  const toast = showLoadingToast('Preparing PDF for WhatsApp...');

  try {
    const pdf = await generatePdfDocument(title, bodyContent, orientation);
    const pdfBlob = pdf.output('blob');
    const file = new File([pdfBlob], `${cleanFilename}.pdf`, { type: 'application/pdf' });

    // Web Share API with File (Supported on Mobile/Android/iOS to share directly into WhatsApp)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: `${title} - Star Academy`,
        text: `Official Document: ${title} from Star Academy Lahore`
      });
      return;
    }

    // Desktop browser fallback:
    // 1. Download the PDF directly so the user has the file
    pdf.save(`${cleanFilename}.pdf`);

    // 2. Open WhatsApp Web with contextual notice
    let cleanNum = '';
    if (targetPhone) {
      cleanNum = String(targetPhone).replace(/[^0-9]/g, '');
      if (cleanNum.startsWith('0')) cleanNum = '92' + cleanNum.slice(1);
    }
    const msg = `📄 *Star Academy Lahore - Document Export*\n\nDocument: *${title}*\n\n(The PDF file "${cleanFilename}.pdf" has been downloaded to your device - attach it here to send)`;
    const encoded = encodeURIComponent(msg);
    const url = cleanNum && cleanNum.length >= 10
      ? `https://wa.me/${cleanNum}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  } catch (err) {
    console.error('Error sharing PDF to WhatsApp:', err);
    await downloadHtmlAsPDF(title, bodyContent, filename);
  } finally {
    hideLoadingToast(toast);
  }
}

/**
 * Text-only WhatsApp share fallback
 */
export function shareTextToWhatsApp(text, targetPhone = null) {
  let cleanNum = '';
  if (targetPhone) {
    cleanNum = String(targetPhone).replace(/[^0-9]/g, '');
    if (cleanNum.startsWith('0')) {
      cleanNum = '92' + cleanNum.slice(1);
    }
  }

  const encoded = encodeURIComponent(text);
  const url = cleanNum && cleanNum.length >= 10
    ? `https://wa.me/${cleanNum}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;

  window.open(url, '_blank');
}

// -------------------------------------------------------------
// 1. STUDENT PROFILE EXPORT & SHARE (COMPLETE DOSSIER)
// -------------------------------------------------------------
function getStudentProfileHtml(student, extraData = {}) {
  const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim();

  // 1. Gather all linked modules
  const attendanceSessions = extraData.attendanceSessions || (typeof getAttendanceSessions === 'function' ? getAttendanceSessions() : []) || [];
  const feeVouchers = extraData.feeVouchers || (typeof getFeeVouchers === 'function' ? getFeeVouchers() : []) || [];
  const marksheets = extraData.marksheets || (typeof getMarksheets === 'function' ? getMarksheets() : []) || [];
  const banks = extraData.banks || (typeof getBanks === 'function' ? getBanks() : []) || [];

  const bankNameMap = {};
  banks.forEach((b) => {
    bankNameMap[b.id] = b.bankName;
  });

  // 2. Attendance aggregation & calculations
  const studentAttendanceRecords = [];
  let presentCount = 0;
  let absentCount = 0;
  let leaveCount = 0;
  let lateCount = 0;

  attendanceSessions.forEach((session) => {
    const match = session.records?.find((r) => r.studentId === student.id);
    if (match) {
      studentAttendanceRecords.push({
        date: session.date,
        studentClass: session.studentClass || student.studentClass,
        subject: session.subject || 'Regular Session',
        status: match.status,
        arrivalTime: match.arrivalTime || '',
        minutesLate: match.minutesLate || 0
      });
      if (match.status === 'Present') presentCount++;
      else if (match.status === 'Absent') absentCount++;
      else if (match.status === 'Leave') leaveCount++;
      else if (match.status === 'Late') {
        lateCount++;
        presentCount++; // late arrivals are counted as present
      }
    }
  });

  studentAttendanceRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalAttendance = studentAttendanceRecords.length;
  const attendancePercentage = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 100;

  // 3. Fee Vouchers & Ledger aggregation
  const studentVouchers = feeVouchers.filter((v) => v.studentId === student.id);
  studentVouchers.sort((a, b) => new Date(b.dueDate || b.createdAt || '') - new Date(a.dueDate || a.createdAt || ''));

  const paidVouchers = studentVouchers.filter((v) => v.status === 'PAID');
  const pendingVouchers = studentVouchers.filter((v) => v.status === 'PENDING');
  const totalBilled = studentVouchers.reduce((s, v) => s + (Number(v.feeAmount) || 0), 0);
  const totalPaid = paidVouchers.reduce((s, v) => s + (Number(v.amountPaid || v.feeAmount) || 0), 0);
  const totalPending = pendingVouchers.reduce((s, v) => s + (Number(v.feeAmount) || 0), 0);

  // 4. Marksheets & Examination Results aggregation
  const studentExamResults = [];
  marksheets.forEach((ms) => {
    const list = ms.studentScores || ms.studentResults || [];
    const lowerName = fullName.toLowerCase();
    const found = list.find(
      (r) => r.studentId === student.id || (r.studentName && r.studentName.toLowerCase() === lowerName)
    );
    if (found) {
      studentExamResults.push({
        title: ms.title || ms.testName || 'Academic Exam',
        date: ms.createdAt || ms.date || 'N/A',
        studentClass: ms.studentClass || student.studentClass,
        section: ms.section || student.section,
        totalObtained: found.totalObtained !== undefined ? found.totalObtained : found.marksObtained,
        totalMax: found.totalMax !== undefined ? found.totalMax : found.maxMarks,
        percentage: found.percentage || 0,
        grade: found.grade || 'N/A',
        isPassed: found.isPassed !== undefined ? found.isPassed : (Number(found.percentage) >= 40),
        scores: found.scores || {}
      });
    }
  });
  studentExamResults.sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalExams = studentExamResults.length;
  const passedExams = studentExamResults.filter((e) => e.isPassed).length;
  const avgExamPercentage =
    totalExams > 0
      ? (studentExamResults.reduce((acc, e) => acc + (Number(e.percentage) || 0), 0) / totalExams).toFixed(1)
      : '0';

  // 5. Enrolled Subjects
  const subjects =
    student.subjects && student.subjects.length > 0
      ? student.subjects
      : ['English', 'Urdu', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Islamiat', 'Pak Studies'];

  // 6. Build Attendance Rows (up to 15 latest records)
  const attendanceRowsHtml = studentAttendanceRecords.slice(0, 15).map((r, idx) => {
    let badgeClass = 'badge-green';
    if (r.status === 'Absent') badgeClass = 'badge-red';
    else if (r.status === 'Leave') badgeClass = 'badge-blue';
    else if (r.status === 'Late') badgeClass = 'badge-late';

    const timingDetails = r.arrivalTime
      ? `${r.arrivalTime} ${r.minutesLate > 0 ? `(${r.minutesLate}m late)` : '(On Time)'}`
      : '—';

    return `
      <tr>
        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
        <td><strong>${r.date}</strong></td>
        <td>${r.subject} (${r.studentClass || 'Regular'})</td>
        <td><span class="badge ${badgeClass}">${r.status}</span></td>
        <td>${timingDetails}</td>
      </tr>
    `;
  }).join('');

  // 7. Build Fee Voucher Rows
  const feeRowsHtml = studentVouchers.map((v, idx) => {
    const isPaid = v.status === 'PAID';
    const statusBadge = isPaid
      ? '<span class="badge badge-green">PAID</span>'
      : '<span class="badge badge-amber">PENDING</span>';
    const bankName = v.bankId ? (bankNameMap[v.bankId] || v.bankId) : (isPaid ? 'Cash / Bank' : '—');
    const paymentDate = v.paymentDate || (isPaid ? v.dueDate : '—');

    return `
      <tr>
        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
        <td><strong>${v.id || `VCH-${idx + 1}`}</strong></td>
        <td>${v.month || 'Current Month'}</td>
        <td>${v.dueDate || 'N/A'}</td>
        <td style="font-weight: 800;">Rs. ${Number(v.feeAmount || 0).toLocaleString()}</td>
        <td>${statusBadge}</td>
        <td>${paymentDate}</td>
        <td>${bankName}</td>
      </tr>
    `;
  }).join('');

  // 8. Build Exam Results Rows
  const examRowsHtml = studentExamResults.map((e, idx) => {
    const isPassed = e.isPassed;
    const resultBadge = isPassed
      ? '<span class="badge badge-green">PASSED</span>'
      : '<span class="badge badge-red">FAILED</span>';

    // Subject breakdown chips if present
    const scoreEntries = Object.entries(e.scores || {});
    const breakdown = scoreEntries.length > 0
      ? `<div style="margin-top: 4px; font-size: 8pt; color: #475569;">${scoreEntries.map(([subj, val]) => `${subj}: <b>${val}</b>`).join(' • ')}</div>`
      : '';

    return `
      <tr>
        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
        <td>
          <strong>${e.title}</strong>
          ${breakdown}
        </td>
        <td>${e.date}</td>
        <td style="text-align: center;">${e.totalObtained} / ${e.totalMax}</td>
        <td style="text-align: center; font-weight: 800;">${e.percentage}%</td>
        <td style="text-align: center;"><span class="badge badge-purple">${e.grade}</span></td>
        <td style="text-align: center;">${resultBadge}</td>
      </tr>
    `;
  }).join('');

  const avatarUrl = student.pic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
  const isActive = !student.isLeft && student.isActive !== false;

  return `
    <!-- Top Hero Header with Student Photo & Identification -->
    <div class="profile-hero" style="display: flex; align-items: center; gap: 14px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid;">
      <img src="${avatarUrl}" alt="${fullName}" class="profile-avatar" width="48" height="48" style="width: 48px !important; height: 48px !important; min-width: 48px !important; max-width: 48px !important; min-height: 48px !important; max-height: 48px !important; border-radius: 6px; object-fit: cover; border: 1.5px solid #cbd5e1; background: #e2e8f0; display: block; flex-shrink: 0;" />
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <h2 style="margin: 0; font-size: 15pt; font-weight: 900; color: #0f172a; text-transform: uppercase;">
            ${fullName}
          </h2>
          <span class="badge ${isActive ? 'badge-green' : 'badge-red'}" style="font-size: 8.5pt;">
            ${isActive ? 'ACTIVE STUDENT' : 'WITHDRAWN / LEFT'}
          </span>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 4px; font-size: 9pt; color: #475569; font-weight: 700; flex-wrap: wrap;">
          <span>Student ID: <b style="color: #0f172a;">${student.id}</b></span>
          <span>•</span>
          <span>Class: <b style="color: #0f172a;">${student.studentClass || student.class || 'N/A'}</b></span>
          <span>•</span>
          <span>Section: <b style="color: #2563eb;">${student.section || student.subject || 'Pre- Medical'}</b></span>
          <span>•</span>
          <span>Session: <b style="color: #0f172a;">${student.academicYear || student.session || '2026 - 27'}</b></span>
        </div>
      </div>
    </div>

    <!-- Section 1: Personal & Admission Information -->
    <h2 class="section-title">1. Personal & Admission Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Full Name:</span>
        <span class="info-value">${fullName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Student Roll No:</span>
        <span class="info-value">${student.id}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Class & Group:</span>
        <span class="info-value">${student.studentClass || 'N/A'} (${student.section || 'Pre- Medical'})</span>
      </div>
      <div class="info-item">
        <span class="info-label">Gender:</span>
        <span class="info-value">${student.gender || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Academic Session:</span>
        <span class="info-value">${student.academicYear || student.session || '2026 - 27'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Date of Admission:</span>
        <span class="info-value">${student.dateOfJoining || student.dateOfAdmission || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">B-Form / CNIC:</span>
        <span class="info-value">${student.cnic || student.bForm || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Admission Status:</span>
        <span class="info-value">${isActive ? 'Enrolled & Verified' : 'Inactive'}</span>
      </div>
    </div>

    <!-- Section 2: Guardian & Contact Details -->
    <h2 class="section-title">2. Guardian & Contact Details</h2>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Father / Guardian:</span>
        <span class="info-value">${student.fatherName || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Guardian CNIC:</span>
        <span class="info-value">${student.fatherCnic || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Primary Contact No:</span>
        <span class="info-value">${student.contactNumber || student.phone || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">WhatsApp Number:</span>
        <span class="info-value">${student.whatsappNumber || student.contactNumber || 'N/A'}</span>
      </div>
      <div class="info-item" style="grid-column: span 2;">
        <span class="info-label">Residential Address:</span>
        <span class="info-value">${student.address || 'Lahore, Punjab, Pakistan'}</span>
      </div>
    </div>

    <!-- Section 3: Enrolled Subjects -->
    <h2 class="section-title">3. Enrolled Curriculum Subjects</h2>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px;">
      <div style="display: flex; flex-wrap: wrap; gap: 4px;">
        ${subjects.map((s) => `<span class="subject-chip">✓ ${s}</span>`).join('')}
      </div>
    </div>

    <!-- Section 4: Tuition Fee Statement & Voucher History -->
    <div class="profile-section" style="page-break-inside: avoid; break-inside: avoid; margin-bottom: 14px;">
      <h2 class="section-title">4. Financial & Tuition Fee Statement</h2>
      <table class="kpi-table" style="width: 100% !important; table-layout: fixed !important; border-collapse: separate !important; border-spacing: 6px !important; margin: 6px 0 10px 0 !important; border: none !important; background: transparent !important;">
        <tr>
          <td class="kpi-cell" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 4px; text-align: center; width: 25%; vertical-align: middle;">
            <div class="kpi-val" style="font-size: 11pt; font-weight: 800; color: #0f172a; white-space: nowrap;">Rs. ${Number(student.fees || student.monthlyFee || 0).toLocaleString()}</div>
            <div class="kpi-lbl" style="font-size: 7.5pt; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; white-space: nowrap;">Monthly Tuition Fee</div>
          </td>
          <td class="kpi-cell" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 4px; text-align: center; width: 25%; vertical-align: middle;">
            <div class="kpi-val" style="font-size: 11pt; font-weight: 800; color: #0f172a; white-space: nowrap;">Rs. ${totalBilled.toLocaleString()}</div>
            <div class="kpi-lbl" style="font-size: 7.5pt; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; white-space: nowrap;">Total Billed</div>
          </td>
          <td class="kpi-cell" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 4px; text-align: center; width: 25%; vertical-align: middle;">
            <div class="kpi-val" style="font-size: 11pt; font-weight: 800; color: #166534; white-space: nowrap;">Rs. ${totalPaid.toLocaleString()}</div>
            <div class="kpi-lbl" style="font-size: 7.5pt; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; white-space: nowrap;">Total Paid</div>
          </td>
          <td class="kpi-cell" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 4px; text-align: center; width: 25%; vertical-align: middle;">
            <div class="kpi-val" style="font-size: 11pt; font-weight: 800; color: ${totalPending > 0 ? '#991b1b' : '#166534'}; white-space: nowrap;">Rs. ${totalPending.toLocaleString()}</div>
            <div class="kpi-lbl" style="font-size: 7.5pt; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; white-space: nowrap;">${totalPending > 0 ? 'Pending Dues' : 'Balance Cleared'}</div>
          </td>
        </tr>
      </table>

      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th>Voucher No</th>
            <th>Billing Month</th>
            <th>Due Date</th>
            <th>Fee Amount</th>
            <th>Status</th>
            <th>Paid Date</th>
            <th>Bank / Method</th>
          </tr>
        </thead>
        <tbody>
          ${feeRowsHtml || '<tr><td colspan="8" style="text-align: center; color: #64748b;">No fee vouchers recorded for this student.</td></tr>'}
        </tbody>
      </table>
    </div>

    <!-- Section 5: Attendance & Punctuality Record -->
    <div class="profile-section" style="page-break-inside: avoid; break-inside: avoid; margin-bottom: 14px;">
      <h2 class="section-title" style="margin-top: 14px;">5. Attendance & Punctuality Record</h2>
      <table class="kpi-table" style="width: 100% !important; table-layout: fixed !important; border-collapse: separate !important; border-spacing: 6px !important; margin: 6px 0 10px 0 !important; border: none !important; background: transparent !important;">
        <tr>
          <td class="kpi-cell" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 4px; text-align: center; width: 25%; vertical-align: middle;">
            <div class="kpi-val" style="font-size: 11pt; font-weight: 800; color: #0f172a; white-space: nowrap;">${totalAttendance}</div>
            <div class="kpi-lbl" style="font-size: 7.5pt; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; white-space: nowrap;">Total Sessions</div>
          </td>
          <td class="kpi-cell" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 4px; text-align: center; width: 25%; vertical-align: middle;">
            <div class="kpi-val" style="font-size: 11pt; font-weight: 800; color: #166534; white-space: nowrap;">${presentCount}</div>
            <div class="kpi-lbl" style="font-size: 7.5pt; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; white-space: nowrap;">Present Days</div>
          </td>
          <td class="kpi-cell" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 4px; text-align: center; width: 25%; vertical-align: middle;">
            <div class="kpi-val" style="font-size: 11pt; font-weight: 800; color: #c2410c; white-space: nowrap;">${lateCount}</div>
            <div class="kpi-lbl" style="font-size: 7.5pt; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; white-space: nowrap;">Latecomers</div>
          </td>
          <td class="kpi-cell" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 4px; text-align: center; width: 25%; vertical-align: middle;">
            <div class="kpi-val" style="font-size: 11pt; font-weight: 800; color: #1e40af; white-space: nowrap;">${attendancePercentage}%</div>
            <div class="kpi-lbl" style="font-size: 7.5pt; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; white-space: nowrap;">Attendance Rate</div>
          </td>
        </tr>
      </table>

      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th>Date</th>
            <th>Subject / Session</th>
            <th>Status</th>
            <th>Arrival Time & Punctuality</th>
          </tr>
        </thead>
        <tbody>
          ${attendanceRowsHtml || '<tr><td colspan="5" style="text-align: center; color: #64748b;">No daily attendance sessions logged.</td></tr>'}
        </tbody>
      </table>
    </div>

    <!-- Section 6: Examination Results & Academic Marksheets -->
    <div class="profile-section" style="page-break-inside: avoid; break-inside: avoid; margin-bottom: 14px;">
      <h2 class="section-title" style="margin-top: 14px;">6. Examination & Academic Marksheets</h2>
      <table class="kpi-table" style="width: 100% !important; table-layout: fixed !important; border-collapse: separate !important; border-spacing: 6px !important; margin: 6px 0 10px 0 !important; border: none !important; background: transparent !important;">
        <tr>
          <td class="kpi-cell" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 4px; text-align: center; width: 25%; vertical-align: middle;">
            <div class="kpi-val" style="font-size: 11pt; font-weight: 800; color: #0f172a; white-space: nowrap;">${totalExams}</div>
            <div class="kpi-lbl" style="font-size: 7.5pt; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; white-space: nowrap;">Total Tests</div>
          </td>
          <td class="kpi-cell" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 4px; text-align: center; width: 25%; vertical-align: middle;">
            <div class="kpi-val" style="font-size: 11pt; font-weight: 800; color: #166534; white-space: nowrap;">${passedExams}</div>
            <div class="kpi-lbl" style="font-size: 7.5pt; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; white-space: nowrap;">Tests Passed</div>
          </td>
          <td class="kpi-cell" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 4px; text-align: center; width: 25%; vertical-align: middle;">
            <div class="kpi-val" style="font-size: 11pt; font-weight: 800; color: #1e40af; white-space: nowrap;">${avgExamPercentage}%</div>
            <div class="kpi-lbl" style="font-size: 7.5pt; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; white-space: nowrap;">Average Score</div>
          </td>
          <td class="kpi-cell" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 4px; text-align: center; width: 25%; vertical-align: middle;">
            <div class="kpi-val" style="font-size: 11pt; font-weight: 800; color: #6b21a8; white-space: nowrap;">
              ${avgExamPercentage >= 80 ? 'A+' : avgExamPercentage >= 70 ? 'A' : avgExamPercentage >= 60 ? 'B' : avgExamPercentage >= 50 ? 'C' : 'Pass'}
            </div>
            <div class="kpi-lbl" style="font-size: 7.5pt; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; white-space: nowrap;">Academic Grade</div>
          </td>
        </tr>
      </table>

      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th>Examination Title & Subject Breakdown</th>
            <th>Date</th>
            <th style="text-align: center;">Marks</th>
            <th style="text-align: center;">Percentage</th>
            <th style="text-align: center;">Grade</th>
            <th style="text-align: center;">Result</th>
          </tr>
        </thead>
        <tbody>
          ${examRowsHtml || '<tr><td colspan="7" style="text-align: center; color: #64748b;">No marksheet examinations found for this student.</td></tr>'}
        </tbody>
      </table>
    </div>

    <!-- Section 7: Official Academy Signatures & Verification -->
    <div style="margin-top: 24px; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: #f8fafc; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="${FAYSAL_BANK_QR_BASE64}" alt="Verification QR" style="width: 55px; height: 55px; object-fit: contain; border: 1px solid #cbd5e1; border-radius: 6px; padding: 2px; background: #fff;" />
        <div style="font-size: 8.5pt; color: #475569; line-height: 1.35;">
          <b style="color: #0f172a;">Official Star Academy Record</b><br />
          Scan QR code to verify student credentials and online fee payment.<br />
          Record ID: <b>${student.id}</b> • Generated on ${new Date().toLocaleDateString('en-GB')}
        </div>
      </div>
      <div style="display: flex; gap: 24px;">
        <div style="text-align: center; width: 140px; border-top: 1.5px solid #0f172a; padding-top: 4px; font-size: 8.5pt; font-weight: 800; color: #0f172a;">
          Parent / Guardian
        </div>
        <div style="text-align: center; width: 140px; border-top: 1.5px solid #0f172a; padding-top: 4px; font-size: 8.5pt; font-weight: 800; color: #0f172a;">
          Principal / Admin
        </div>
      </div>
    </div>
  `;
}

export function exportStudentProfilePDF(student, extraData = {}) {
  const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
  const html = getStudentProfileHtml(student, extraData);
  downloadHtmlAsPDF(`Student Profile - ${fullName}`, html, `Student_Profile_${student.id || ''}_${fullName}`);
}

export function printStudentProfile(student, extraData = {}) {
  const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
  const html = getStudentProfileHtml(student, extraData);
  printHtmlAsPDF(`Student Profile - ${fullName}`, html);
}

export function shareStudentProfileWhatsApp(student, extraData = {}) {
  const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
  const html = getStudentProfileHtml(student, extraData);
  shareHtmlAsPDFToWhatsApp(
    `Student Profile - ${fullName}`,
    html,
    `Student_Profile_${student.id || ''}_${fullName}`,
    student.whatsappNumber || student.contactNumber || student.phone
  );
}

// -------------------------------------------------------------
// 2. TIMETABLE EXPORT & SHARE
// -------------------------------------------------------------
function getTimetableHtml(timetable) {
  const periods = timetable.periods || [];
  const rowsHtml = periods.map((p, idx) => `
    <tr>
      <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
      <td><strong>${p.time || `${p.fromTime} - ${p.toTime}`}</strong></td>
      <td><strong>${p.subject}</strong></td>
      <td><span class="badge ${p.type === 'break' || p.isBreak ? 'badge-amber' : 'badge-blue'}">${p.type || (p.isBreak ? 'Break' : 'Lecture')}</span></td>
      <td>${p.room || 'Room 101'}</td>
    </tr>
  `).join('');

  return `
    <h2 class="section-title">Class Timetable & Schedule</h2>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Class:</span>
        <span class="info-value">${timetable.studentClass}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Section:</span>
        <span class="info-value">${timetable.section}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Schedule Days:</span>
        <span class="info-value">${timetable.days || 'Monday - Saturday'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Total Periods:</span>
        <span class="info-value">${periods.length} Periods</span>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 35px; text-align: center;">#</th>
          <th>Timing Slot</th>
          <th>Subject</th>
          <th>Period Type</th>
          <th>Room</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml || '<tr><td colspan="5" style="text-align: center;">No period slots recorded</td></tr>'}
      </tbody>
    </table>
  `;
}

export function printTimetable(timetable) {
  const title = `Timetable - Class ${timetable.studentClass} (${timetable.section})`;
  printHtmlAsPDF(title, getTimetableHtml(timetable));
}

export function exportTimetablePDF(timetable) {
  const title = `Timetable - Class ${timetable.studentClass} (${timetable.section})`;
  const filename = `Timetable_Class_${timetable.studentClass}_${timetable.section}`;
  downloadHtmlAsPDF(title, getTimetableHtml(timetable), filename);
}

export function shareTimetableWhatsApp(timetable) {
  const title = `Timetable - Class ${timetable.studentClass} (${timetable.section})`;
  const filename = `Timetable_Class_${timetable.studentClass}_${timetable.section}`;
  shareHtmlAsPDFToWhatsApp(title, getTimetableHtml(timetable), filename);
}

// -------------------------------------------------------------
// 3. DATESHEET EXPORT & SHARE
// -------------------------------------------------------------
export function getDayNameFromDate(dateStr, fallbackDay = '') {
  if (fallbackDay && fallbackDay !== 'N/A' && fallbackDay.trim() !== '') {
    return fallbackDay.trim();
  }
  if (!dateStr || typeof dateStr !== 'string') {
    return fallbackDay && fallbackDay !== 'N/A' ? fallbackDay : 'N/A';
  }

  const trimmed = dateStr.trim();
  let d = null;

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, day] = trimmed.split('-').map(Number);
    d = new Date(y, m - 1, day);
  }
  // DD-MM-YYYY or DD/MM/YYYY
  else if (/^\d{2}[/-]\d{2}[/-]\d{4}$/.test(trimmed)) {
    const parts = trimmed.split(/[/-]/).map(Number);
    d = new Date(parts[2], parts[1] - 1, parts[0]);
  } else {
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      d = parsed;
    }
  }

  if (d && !isNaN(d.getTime())) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[d.getDay()];
  }

  return fallbackDay && fallbackDay !== 'N/A' ? fallbackDay : 'N/A';
}

function getDatesheetHtml(datesheet) {
  const rows = datesheet.rows || [];
  const rowsHtml = rows.map((r, idx) => {
    const dayName = getDayNameFromDate(r.date, r.day);
    return `
    <tr>
      <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
      <td><strong>${r.date}</strong></td>
      <td><strong>${dayName}</strong></td>
      <td><strong>${r.subject}</strong></td>
      <td>${r.time || '09:00 AM - 12:00 PM'}</td>
      <td>${r.syllabus || r.chapters || 'Complete syllabus'}</td>
    </tr>
  `;
  }).join('');

  return `
    <h2 class="section-title">Official Examination Datesheet</h2>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Exam Title:</span>
        <span class="info-value">${datesheet.title || datesheet.testName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Class & Section:</span>
        <span class="info-value">${datesheet.studentClass} (${datesheet.section})</span>
      </div>
      <div class="info-item">
        <span class="info-label">Total Papers:</span>
        <span class="info-value">${rows.length} Subjects</span>
      </div>
      <div class="info-item">
        <span class="info-label">Session:</span>
        <span class="info-value">${datesheet.academicYear || '2026 - 27'}</span>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 35px; text-align: center;">#</th>
          <th>Exam Date</th>
          <th>Day</th>
          <th>Subject Paper</th>
          <th>Timing Slot</th>
          <th>Syllabus / Topics</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml || '<tr><td colspan="6" style="text-align: center;">No exam dates published</td></tr>'}
      </tbody>
    </table>

    ${datesheet.instructions ? `
      <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 10px; border-radius: 6px; margin-top: 14px; font-size: 9pt;">
        <strong>Instructions for Candidates:</strong> ${datesheet.instructions}
      </div>
    ` : ''}
  `;
}

export function printDatesheet(datesheet) {
  const title = `Datesheet - ${datesheet.title || datesheet.testName} (${datesheet.studentClass} ${datesheet.section})`;
  printHtmlAsPDF(title, getDatesheetHtml(datesheet));
}

export function exportDatesheetPDF(datesheet) {
  const title = `Datesheet - ${datesheet.title || datesheet.testName} (${datesheet.studentClass} ${datesheet.section})`;
  const filename = `Datesheet_${datesheet.studentClass}_${datesheet.section}_${datesheet.testName || 'Exam'}`;
  downloadHtmlAsPDF(title, getDatesheetHtml(datesheet), filename);
}

export function shareDatesheetWhatsApp(datesheet) {
  const title = `Datesheet - ${datesheet.title || datesheet.testName} (${datesheet.studentClass} ${datesheet.section})`;
  const filename = `Datesheet_${datesheet.studentClass}_${datesheet.section}_${datesheet.testName || 'Exam'}`;
  shareHtmlAsPDFToWhatsApp(title, getDatesheetHtml(datesheet), filename);
}

// -------------------------------------------------------------
// 4. MARKSHEET EXPORT & SHARE
// -------------------------------------------------------------
function getMarksheetHtml(marksheet, students = []) {
  const studentScores = marksheet.studentScores || [];
  const studentMap = new Map();
  (students || []).forEach(s => studentMap.set(s.id, s));

  const sorted = [...studentScores].sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

  const rowsHtml = sorted.map((st, idx) => {
    const canonical = studentMap.get(st.studentId);
    const name = canonical ? `${canonical.firstName} ${canonical.lastName}` : st.studentName;
    const father = canonical?.fatherName || st.fatherName || '';
    const pos = idx === 0 ? '1st' : idx === 1 ? '2nd' : idx === 2 ? '3rd' : `#${idx + 1}`;

    return `
      <tr>
        <td style="text-align: center; font-weight: bold;">${pos}</td>
        <td><strong>${name}</strong><br /><small style="color: #64748b;">${st.studentId} ${father ? `• S/O ${father}` : ''}</small></td>
        <td style="text-align: center; font-weight: bold;">${st.totalObtained} / ${st.totalMax}</td>
        <td style="text-align: center; font-weight: bold;">${st.percentage}%</td>
        <td style="text-align: center;"><span class="badge ${st.grade === 'A+' || st.grade === 'A' ? 'badge-green' : 'badge-blue'}">${st.grade}</span></td>
        <td style="text-align: center;"><strong>${st.isPassed ? 'PASSED' : 'FAILED'}</strong></td>
      </tr>
    `;
  }).join('');

  return `
    <h2 class="section-title">Examination Results & Merit List</h2>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Exam Name:</span>
        <span class="info-value">${marksheet.title || marksheet.testName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Class & Section:</span>
        <span class="info-value">${marksheet.studentClass} (${marksheet.section})</span>
      </div>
      <div class="info-item">
        <span class="info-label">Exam Date:</span>
        <span class="info-value">${marksheet.date}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Class Average:</span>
        <span class="info-value">${marksheet.classAverage || 0}%</span>
      </div>
      <div class="info-item">
        <span class="info-label">Students Evaluated:</span>
        <span class="info-value">${sorted.length} Candidates</span>
      </div>
      <div class="info-item">
        <span class="info-label">1st Position Topper:</span>
        <span class="info-value">${sorted[0]?.studentName || 'N/A'} (${sorted[0]?.percentage || 0}%)</span>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 45px; text-align: center;">Rank</th>
          <th>Student Name & ID</th>
          <th style="text-align: center;">Total Marks</th>
          <th style="text-align: center;">Percentage</th>
          <th style="text-align: center;">Grade</th>
          <th style="text-align: center;">Result</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml || '<tr><td colspan="6" style="text-align: center;">No student marks recorded</td></tr>'}
      </tbody>
    </table>
  `;
}

export function exportMarksheetPDF(marksheet, students = []) {
  const title = `Marksheet - ${marksheet.title || marksheet.testName} (${marksheet.studentClass} ${marksheet.section})`;
  const filename = `Marksheet_${marksheet.studentClass}_${marksheet.section}_${marksheet.testName || 'Exam'}`;
  downloadHtmlAsPDF(title, getMarksheetHtml(marksheet, students), filename);
}

export function shareMarksheetWhatsApp(marksheet, students = []) {
  const title = `Marksheet - ${marksheet.title || marksheet.testName} (${marksheet.studentClass} ${marksheet.section})`;
  const filename = `Marksheet_${marksheet.studentClass}_${marksheet.section}_${marksheet.testName || 'Exam'}`;
  shareHtmlAsPDFToWhatsApp(title, getMarksheetHtml(marksheet, students), filename);
}

// -------------------------------------------------------------
// 5. SCHEME OF STUDY (SOS) EXPORT & SHARE
// -------------------------------------------------------------
export function formatDisplayDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '-';
  const trimmed = dateStr.trim();
  if (!trimmed || trimmed === 'N/A' || trimmed === '-') return '-';

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-').map(Number);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayStr = String(d).padStart(2, '0');
    return `${dayStr} ${months[m - 1]} ${y}`;
  }

  // DD-MM-YYYY or DD/MM/YYYY
  if (/^\d{2}[/-]\d{2}[/-]\d{4}$/.test(trimmed)) {
    const parts = trimmed.split(/[/-]/).map(Number);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayStr = String(parts[0]).padStart(2, '0');
    return `${dayStr} ${months[parts[1] - 1]} ${parts[2]}`;
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    const d = String(parsed.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d} ${months[parsed.getMonth()]} ${parsed.getFullYear()}`;
  }

  return trimmed;
}

function getSOSHtml(scheme) {
  const rows = scheme.rows || [];
  const rowsHtml = rows.map((r, idx) => {
    const fromFormatted = formatDisplayDate(r.fromDate);
    const toFormatted = formatDisplayDate(r.toDate);
    return `
    <tr>
      <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
      <td style="text-align: center;"><strong>${r.month || 'Monthly'}</strong></td>
      <td><strong>${r.subject}</strong></td>
      <td style="text-align: center;"><span class="badge ${r.activity?.toLowerCase() === 'test' ? 'badge-amber' : 'badge-blue'}">${r.activity || 'Study'}</span></td>
      <td><strong>${r.topic || 'N/A'}</strong></td>
      <td>${r.chapter || 'N/A'}</td>
      <td style="text-align: center; font-size: 8.5pt; white-space: nowrap; font-weight: 700; color: #334155;">${fromFormatted}</td>
      <td style="text-align: center; font-size: 8.5pt; white-space: nowrap; font-weight: 700; color: #334155;">${toFormatted}</td>
    </tr>
  `;
  }).join('');

  return `
    <h2 class="section-title">Curriculum Scheme of Study (SOS)</h2>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Scheme Title:</span>
        <span class="info-value">${scheme.title}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Class & Section:</span>
        <span class="info-value">${scheme.studentClass} (${scheme.section})</span>
      </div>
      ${scheme.batch ? `
      <div class="info-item">
        <span class="info-label">Batch:</span>
        <span class="info-value">${scheme.batch}</span>
      </div>` : ''}
      <div class="info-item">
        <span class="info-label">Academic Session:</span>
        <span class="info-value">${scheme.academicYear || '2026 - 27'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Total Milestones:</span>
        <span class="info-value">${rows.length} Curriculum Units</span>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 35px; text-align: center;">#</th>
          <th style="width: 80px; text-align: center;">Month</th>
          <th style="width: 100px;">Subject</th>
          <th style="width: 75px; text-align: center;">Activity</th>
          <th>Topic Name</th>
          <th style="width: 120px;">Chapter</th>
          <th style="width: 110px; text-align: center; white-space: nowrap;">From Date</th>
          <th style="width: 110px; text-align: center; white-space: nowrap;">To Date</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml || '<tr><td colspan="8" style="text-align: center;">No syllabus milestones recorded</td></tr>'}
      </tbody>
    </table>
  `;
}

export function printSOS(scheme) {
  const batchSuffix = scheme.batch ? ` [${scheme.batch}]` : '';
  const title = `Scheme of Study - ${scheme.title || ''} (${scheme.studentClass} ${scheme.section})${batchSuffix}`;
  printHtmlAsPDF(title, getSOSHtml(scheme), 'landscape');
}

export function exportSOSPDF(scheme) {
  const batchSuffix = scheme.batch ? ` [${scheme.batch}]` : '';
  const title = `Scheme of Study - ${scheme.title || ''} (${scheme.studentClass} ${scheme.section})${batchSuffix}`;
  const filename = `Scheme_of_Study_${scheme.studentClass}_${scheme.section}${scheme.batch ? `_${scheme.batch.replace(/\s+/g, '_')}` : ''}`;
  downloadHtmlAsPDF(title, getSOSHtml(scheme), filename, 'landscape');
}

export function shareSOSWhatsApp(scheme) {
  const batchSuffix = scheme.batch ? ` [${scheme.batch}]` : '';
  const title = `Scheme of Study - ${scheme.title || ''} (${scheme.studentClass} ${scheme.section})${batchSuffix}`;
  const filename = `Scheme_of_Study_${scheme.studentClass}_${scheme.section}${scheme.batch ? `_${scheme.batch.replace(/\s+/g, '_')}` : ''}`;
  shareHtmlAsPDFToWhatsApp(title, getSOSHtml(scheme), filename, null, 'landscape');
}

// -------------------------------------------------------------
// 6. FEE VOUCHERS WITH BANK DETAILS & QR CODE (Single & All)
// -------------------------------------------------------------
export function getSingleFeeVoucherHtml(voucher, isStandalonePage = false) {
  const isPaid = voucher.status === 'PAID';
  return `
    <div class="voucher-wrapper" style="border: 2px solid #312e81; border-radius: 12px; padding: 18px; background: #ffffff; margin-bottom: 20px; ${isStandalonePage ? 'page-break-after: always;' : ''}">
      <!-- Voucher Top Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${STAR_ACADEMY_LOGO_BASE64}" alt="Star Academy Logo" style="width: 52px; height: 52px; object-fit: contain;" />
          <div>
            <h2 style="font-size: 15pt; font-weight: 900; color: #312e81; margin: 0; text-transform: uppercase; letter-spacing: -0.3px;">Star Academy Lahore</h2>
            <p style="font-size: 8.5pt; color: #6366f1; margin: 2px 0 0; font-weight: 700;">Official Tuition Fee Voucher • ${isPaid ? 'PAID RECEIPT' : 'STUDENT / BANK COPY'}</p>
          </div>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; background: #eef2ff; color: #3730a3; border: 1px solid #c7d2fe; padding: 3px 8px; border-radius: 6px; font-size: 8.5pt; font-weight: 800; font-family: monospace;">
            ${voucher.id}
          </span>
          <div style="font-size: 8pt; color: #64748b; margin-top: 3px;">Month: <strong>${voucher.month || 'September 2026'}</strong></div>
        </div>
      </div>

      <!-- Student Info Grid -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; font-size: 9pt;">
        <div><span style="color: #64748b; font-weight: 600;">Student Name:</span> <strong style="color: #0f172a;">${voucher.studentName}</strong></div>
        <div><span style="color: #64748b; font-weight: 600;">Student Roll No:</span> <strong style="color: #4338ca; font-family: monospace;">${voucher.studentId}</strong></div>
        <div><span style="color: #64748b; font-weight: 600;">Father's Name:</span> <strong style="color: #0f172a;">${voucher.fatherName || 'N/A'}</strong></div>
        <div><span style="color: #64748b; font-weight: 600;">Class & Section:</span> <strong style="color: #0f172a;">${voucher.studentClass} (${voucher.section || 'General'})</strong></div>
        <div><span style="color: #64748b; font-weight: 600;">Due Date:</span> <strong style="color: #dc2626;">${voucher.dueDate || '10th of Month'}</strong></div>
        <div><span style="color: #64748b; font-weight: 600;">Payment Status:</span> <strong style="color: ${isPaid ? '#166534' : '#b45309'};">${voucher.status}</strong></div>
      </div>

      <!-- Fee Breakdown & Banking Details + QR Code 2-Column Section -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; margin-bottom: 14px;">
        <!-- Left Column: Fee Table -->
        <div>
          <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: left;">Particulars</th>
                <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: right; width: 90px;">Amount (PKR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Monthly Tuition Fee</td>
                <td style="padding: 6px 8px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold;">${Number(voucher.feeAmount || 0).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Previous Arrears</td>
                <td style="padding: 6px 8px; border: 1px solid #e2e8f0; text-align: right;">0</td>
              </tr>
              <tr style="background: #eef2ff; font-weight: bold;">
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; color: #1e1b4b;">Total Payable by Due Date</td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: right; color: #1e1b4b; font-size: 10pt;">Rs. ${Number(voucher.feeAmount || 0).toLocaleString()}</td>
              </tr>
              <tr style="color: #b91c1c;">
                <td style="padding: 4px 8px; border: 1px solid #e2e8f0; font-size: 8pt;">Late Fee Fine (After Due Date)</td>
                <td style="padding: 4px 8px; border: 1px solid #e2e8f0; text-align: right; font-size: 8pt;">Rs. 200</td>
              </tr>
              <tr style="background: #fef2f2; font-weight: bold; color: #991b1b;">
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">Payable After Due Date</td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: right;">Rs. ${(Number(voucher.feeAmount || 0) + 200).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 10px; font-size: 8pt; color: #64748b; line-height: 1.3;">
            • Fee once paid is non-refundable and non-transferable.<br />
            • Please present this voucher when depositing at bank or academy accounts.
          </div>
        </div>

        <!-- Right Column: Official Banking Details & Attached QR Code -->
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 12px; text-align: center;">
          <div style="font-size: 8.5pt; font-weight: 800; color: #1e293b; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.3px;">
            Banking & Deposit Details
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; text-align: left; font-size: 8.5pt; margin-bottom: 8px;">
            <div style="margin-bottom: 3px;"><span style="color: #64748b; font-weight: 600;">Bank:</span> <strong style="color: #0f172a;">${OFFICIAL_BANK_DETAILS.bankName}</strong></div>
            <div style="margin-bottom: 3px;"><span style="color: #64748b; font-weight: 600;">Title:</span> <strong style="color: #0f172a;">${OFFICIAL_BANK_DETAILS.accountTitle}</strong></div>
            <div><span style="color: #64748b; font-weight: 600;">Account:</span> <strong style="color: #4338ca; font-family: monospace; font-size: 9.5pt;">${OFFICIAL_BANK_DETAILS.accountNumber}</strong></div>
          </div>

          <!-- Attached QR Code Below Banking Details -->
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 4px;">
            <div style="background: #ffffff; padding: 4px; border: 1px solid #cbd5e1; border-radius: 8px; display: inline-block;">
              <img src="${FAYSAL_BANK_QR_BASE64}" alt="Faysal Bank QR Code" style="width: 105px; height: 105px; object-fit: contain; display: block;" />
            </div>
            <span style="font-size: 7.5pt; font-weight: 700; color: #475569; margin-top: 4px;">
              Scan QR code to pay via Raast / Any Banking App
            </span>
          </div>
        </div>
      </div>

      <!-- Signatures -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 8pt; color: #64748b;">
        <div style="text-align: center; width: 140px;">
          <div style="border-top: 1px solid #0f172a; padding-top: 3px; font-weight: bold; color: #0f172a;">Depositor Signature</div>
        </div>
        <div style="text-align: center; font-size: 7.5pt;">
          Official Star Academy Accounts Copy
        </div>
        <div style="text-align: center; width: 140px;">
          <div style="border-top: 1px solid #0f172a; padding-top: 3px; font-weight: bold; color: #0f172a;">Authorized Cashier</div>
        </div>
      </div>
    </div>
  `;
}

export function getAllFeeVouchersHtml(vouchers) {
  return (vouchers || [])
    .map((voucher, idx) => getSingleFeeVoucherHtml(voucher, idx < vouchers.length - 1))
    .join('');
}

export function exportSingleFeeVoucherPDF(voucher) {
  const title = `Fee Voucher - ${voucher.studentName} (${voucher.id})`;
  const filename = `Fee_Voucher_${voucher.id}_${voucher.studentName.replace(/\s+/g, '_')}`;
  downloadHtmlAsPDF(title, getSingleFeeVoucherHtml(voucher), filename);
}

export function shareFeeVoucherPDFToWhatsApp(voucher) {
  const title = `Fee Voucher - ${voucher.studentName} (${voucher.id})`;
  const filename = `Fee_Voucher_${voucher.id}_${voucher.studentName.replace(/\s+/g, '_')}`;
  const phone = voucher.whatsappNumber || voucher.fatherContact || '';
  shareHtmlAsPDFToWhatsApp(title, getSingleFeeVoucherHtml(voucher), filename, phone);
}

export function printSingleFeeVoucher(voucher) {
  const title = `Fee Voucher - ${voucher.studentName} (${voucher.id})`;
  printHtmlAsPDF(title, getSingleFeeVoucherHtml(voucher));
}

export function exportAllFeeVouchersPDF(vouchers, monthTitle = 'September 2026') {
  const title = `All Student Fee Vouchers - ${monthTitle} (${vouchers.length} Students)`;
  const filename = `All_Fee_Vouchers_${monthTitle.replace(/\s+/g, '_')}`;
  downloadHtmlAsPDF(title, getAllFeeVouchersHtml(vouchers), filename);
}

export function printAllFeeVouchers(vouchers, monthTitle = 'September 2026') {
  const title = `All Student Fee Vouchers - ${monthTitle} (${vouchers.length} Students)`;
  printHtmlAsPDF(title, getAllFeeVouchersHtml(vouchers));
}

