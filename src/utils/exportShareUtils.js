// Star Academy Lahore - Export PDF & WhatsApp Share Utilities
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Trigger native Print / Save as PDF using an offscreen printable window
 */
export function printHtmlAsPDF(title, bodyContent) {
  const printWindow = window.open('', '_blank', 'width=850,height=900');
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
    doc.write(getCompleteHtmlDocument(title, bodyContent));
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 400);
    return;
  }

  printWindow.document.open();
  printWindow.document.write(getCompleteHtmlDocument(title, bodyContent));
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

function getCompleteHtmlDocument(title, content) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title} - Star Academy Lahore</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 14mm 12mm;
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
          .footer {
            margin-top: 30px;
            padding-top: 14px;
            border-top: 1px solid #cbd5e1;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 8.5pt;
            color: #64748b;
          }
          .signature-box {
            text-align: center;
            width: 180px;
            border-top: 1.5px solid #0f172a;
            padding-top: 4px;
            font-weight: 800;
            color: #0f172a;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="academy-title">Star Academy Lahore</h1>
            <p class="academy-sub">Excellence in Matric & Intermediate Education</p>
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

async function generatePdfDocument(title, bodyContent) {
  const container = document.createElement('div');
  container.id = 'star-academy-pdf-render';

  // Positioned at top-left document coordinates so html2canvas computes valid positive bounds,
  // placed behind root with pointer-events: none so it does not interfere with the user UI
  container.style.position = 'absolute';
  container.style.left = '0px';
  container.style.top = '0px';
  container.style.width = '794px'; // 210mm A4 width at 96 DPI
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#1e293b';
  container.style.padding = '24px 30px';
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
      <div>
        <h1 class="academy-title">Star Academy Lahore</h1>
        <p class="academy-sub">Excellence in Matric & Intermediate Education</p>
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
    const contentHeight = Math.max(container.scrollHeight, container.offsetHeight, 1123);

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width: 794,
      height: contentHeight,
      windowWidth: 1024,
      windowHeight: contentHeight + 200
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
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
export async function downloadHtmlAsPDF(title, bodyContent, filename) {
  const cleanFilename = (filename || title || 'Star_Academy_Document')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_');

  const toast = showLoadingToast('Downloading PDF...');

  try {
    const pdf = await generatePdfDocument(title, bodyContent);
    pdf.save(`${cleanFilename}.pdf`);
  } catch (err) {
    console.error('Error downloading PDF directly:', err);
    printHtmlAsPDF(title, bodyContent);
  } finally {
    hideLoadingToast(toast);
  }
}

/**
 * WhatsApp share trigger - shares the downloaded PDF file directly
 */
export async function shareHtmlAsPDFToWhatsApp(title, bodyContent, filename, targetPhone = null) {
  const cleanFilename = (filename || title || 'Star_Academy_Document')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_');

  const toast = showLoadingToast('Preparing PDF for WhatsApp...');

  try {
    const pdf = await generatePdfDocument(title, bodyContent);
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
// 1. STUDENT PROFILE EXPORT & SHARE
// -------------------------------------------------------------
function getStudentProfileHtml(student) {
  const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
  return `
    <h2 class="section-title">Official Student Profile Dossier</h2>

    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Student ID:</span>
        <span class="info-value">${student.id}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Full Name:</span>
        <span class="info-value">${fullName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Class:</span>
        <span class="info-value">${student.studentClass || student.class || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Section / Group:</span>
        <span class="info-value">${student.section || student.subject || 'A'}</span>
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
        <span class="info-label">Father / Guardian:</span>
        <span class="info-value">${student.fatherName || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Contact / Phone:</span>
        <span class="info-value">${student.contactNumber || student.phone || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Guardian CNIC:</span>
        <span class="info-value">${student.fatherCnic || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Student CNIC / B-Form:</span>
        <span class="info-value">${student.cnic || student.bForm || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Monthly Tuition Fee:</span>
        <span class="info-value">Rs. ${Number(student.fees || student.monthlyFee || 0).toLocaleString()}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Date of Joining:</span>
        <span class="info-value">${student.dateOfJoining || student.dateOfAdmission || 'N/A'}</span>
      </div>
      <div class="info-item" style="grid-column: span 2;">
        <span class="info-label">Residential Address:</span>
        <span class="info-value">${student.address || 'Lahore, Pakistan'}</span>
      </div>
    </div>
  `;
}

export function exportStudentProfilePDF(student) {
  const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
  const html = getStudentProfileHtml(student);
  downloadHtmlAsPDF(`Student Profile - ${fullName}`, html, `Student_Profile_${student.id || ''}_${fullName}`);
}

export function shareStudentProfileWhatsApp(student) {
  const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
  const html = getStudentProfileHtml(student);
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
      <td>${p.teacherName || p.teacher || 'Assigned Faculty'}</td>
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
          <th>Teacher</th>
          <th>Period Type</th>
          <th>Room</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml || '<tr><td colspan="6" style="text-align: center;">No period slots recorded</td></tr>'}
      </tbody>
    </table>
  `;
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
function getDatesheetHtml(datesheet) {
  const rows = datesheet.rows || [];
  const rowsHtml = rows.map((r, idx) => `
    <tr>
      <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
      <td><strong>${r.date}</strong></td>
      <td>${r.day || 'N/A'}</td>
      <td><strong>${r.subject}</strong></td>
      <td>${r.time || '09:00 AM - 12:00 PM'}</td>
      <td>${r.syllabus || r.chapters || 'Complete syllabus'}</td>
    </tr>
  `).join('');

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
function getSOSHtml(scheme) {
  const rows = scheme.rows || [];
  const rowsHtml = rows.map((r, idx) => `
    <tr>
      <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
      <td><strong>${r.month || 'Monthly'}</strong></td>
      <td><strong>${r.subject}</strong></td>
      <td><span class="badge ${r.activity?.toLowerCase() === 'test' ? 'badge-amber' : 'badge-blue'}">${r.activity || 'Study'}</span></td>
      <td><strong>${r.topic || 'N/A'}</strong></td>
      <td>${r.chapter || 'N/A'}</td>
      <td style="font-size: 8.5pt;">${r.fromDate && r.toDate ? `${r.fromDate} to ${r.toDate}` : '-'}</td>
    </tr>
  `).join('');

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
          <th>Month</th>
          <th>Subject</th>
          <th>Activity</th>
          <th>Topic Name</th>
          <th>Chapter</th>
          <th>Schedule Dates</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml || '<tr><td colspan="7" style="text-align: center;">No syllabus milestones recorded</td></tr>'}
      </tbody>
    </table>
  `;
}

export function exportSOSPDF(scheme) {
  const title = `Scheme of Study - ${scheme.title || ''} (${scheme.studentClass} ${scheme.section})`;
  const filename = `Scheme_of_Study_${scheme.studentClass}_${scheme.section}`;
  downloadHtmlAsPDF(title, getSOSHtml(scheme), filename);
}

export function shareSOSWhatsApp(scheme) {
  const title = `Scheme of Study - ${scheme.title || ''} (${scheme.studentClass} ${scheme.section})`;
  const filename = `Scheme_of_Study_${scheme.studentClass}_${scheme.section}`;
  shareHtmlAsPDFToWhatsApp(title, getSOSHtml(scheme), filename);
}
