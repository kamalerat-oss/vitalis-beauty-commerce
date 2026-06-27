// lib/generateInvoicePdf.ts
// Generate PDF invoice versi simpel (tanpa background gambar).
// Install dulu: npm install jspdf

import { jsPDF } from 'jspdf';

type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
};

type InvoiceData = {
  orderId: number | string;
  customerName: string;
  customerEmail: string;
  address?: string;
  items: InvoiceItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
};

function formatRupiah(value: number) {
  return 'Rp ' + Math.round(value).toLocaleString('id-ID');
}

export function generateInvoicePdf(data: InvoiceData) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;
  let y = 60;

  const pink = '#d6336c';
  const gray = '#666666';
  const lightPink = '#fce4ec';

  // Header background
  doc.setFillColor(lightPink);
  doc.rect(0, 0, pageWidth, 110, 'F');

  doc.setTextColor(pink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('VITALIS E-COMMERCE', pageWidth / 2, 50, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(gray);
  doc.text('Invoice Resmi Transaksi', pageWidth / 2, 70, { align: 'center' });

  y = 140;

  doc.setFontSize(10);
  doc.setTextColor('#000000');

  const infoRows: [string, string][] = [
    ['Nomor Invoice', `#${data.orderId}`],
    ['Tanggal', new Date(data.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    })],
    ['Nama Pelanggan', data.customerName],
    ['Email', data.customerEmail],
  ];

  if (data.address) {
    infoRows.push(['Alamat Pengiriman', data.address]);
  }

  infoRows.push(['Status Pembayaran', 'LUNAS']);

  const valueX = margin + 150;
  const valueMaxWidth = pageWidth - margin - valueX;

  infoRows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    const splitValue = doc.splitTextToSize(value, valueMaxWidth);
    doc.text(splitValue, valueX, y);
    y += 18 * splitValue.length;
  });

  y += 15;

  // Tabel produk
  const colX = {
    produk: margin,
    harga: margin + 220,
    qty: margin + 320,
    subtotal: margin + 380,
  };
  const tableRight = pageWidth - margin;

  doc.setFillColor(pink);
  doc.rect(margin, y, tableRight - margin, 24, 'F');
  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Produk', colX.produk + 8, y + 16);
  doc.text('Harga', colX.harga, y + 16);
  doc.text('Qty', colX.qty, y + 16);
  doc.text('Subtotal', colX.subtotal, y + 16);

  y += 24;

  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);

  data.items.forEach((item, idx) => {
    const rowHeight = 22;
    if (idx % 2 === 1) {
      doc.setFillColor('#fff5f8');
      doc.rect(margin, y, tableRight - margin, rowHeight, 'F');
    }

    const nameLines = doc.splitTextToSize(item.name, 200);
    doc.text(nameLines, colX.produk + 8, y + 14);
    doc.text(formatRupiah(item.price), colX.harga, y + 14);
    doc.text(String(item.quantity), colX.qty, y + 14);
    doc.text(formatRupiah(item.price * item.quantity), colX.subtotal, y + 14);

    y += rowHeight;
  });

  doc.setDrawColor(pink);
  doc.line(margin, y, tableRight, y);
  y += 20;

  // Ringkasan total — label dan nilai dipisah kolom yang berjarak cukup
  // supaya tidak bertabrakan (label rata kiri di kolom qty, nilai rata kanan
  // mengikuti lebar maksimum teks di kolom subtotal).
  const summaryLabelX = colX.qty;
  const summaryValueRightX = tableRight;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor('#000000');
  doc.text('Subtotal', summaryLabelX, y);
  doc.text(formatRupiah(data.subtotal), summaryValueRightX, y, { align: 'right' });
  y += 18;

  doc.text('Ongkos Kirim', summaryLabelX, y);
  doc.text(formatRupiah(data.shippingCost), summaryValueRightX, y, { align: 'right' });
  y += 14;

  doc.setDrawColor('#cccccc');
  doc.line(summaryLabelX, y, tableRight, y);
  y += 22;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(pink);
  doc.text('Total Akhir', summaryLabelX, y);
  doc.text(formatRupiah(data.total), summaryValueRightX, y, { align: 'right' });

  y += 35;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor('#000000');
  doc.text(`Metode Pembayaran: ${data.paymentMethod}`, margin, y);

  // Footer
  y += 60;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(pink);
  doc.text('Terima Kasih Atas Pesanan Anda!', pageWidth / 2, y, { align: 'center' });

  doc.save(`Invoice-Vitalis-${data.orderId}.pdf`);
}
