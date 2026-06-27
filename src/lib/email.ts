type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
};

type SendInvoiceParams = {
  to: string;
  customerName: string;
  orderId: number | string;
  items: InvoiceItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
};

function formatRupiah(value: number) {
  return "Rp" + Math.round(value).toLocaleString("id-ID");
}

export async function sendInvoiceEmail(params: SendInvoiceParams) {
  const { to, customerName, orderId, items, subtotal, shippingCost, total, paymentMethod } = params;

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${item.name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${formatRupiah(item.price * item.quantity)}</td>
      </tr>`
    )
    .join("");

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
    <div style="background:#d6336c;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:22px;">Vitalis Beauty Commerce</h1>
      <p style="color:#fce4ec;margin:4px 0 0;font-size:13px;">Invoice Pembayaran</p>
    </div>
    <div style="border:1px solid #eee;border-top:none;padding:24px;border-radius:0 0 12px 12px;">
      <p>Halo <strong>${customerName}</strong>,</p>
      <p>Terima kasih telah berbelanja di Vitalis! Pembayaran kamu untuk pesanan <strong>#${orderId}</strong> sudah kami terima.</p>

      <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 0;border-bottom:2px solid #d6336c;">Produk</th>
            <th style="text-align:center;padding:8px 0;border-bottom:2px solid #d6336c;">Qty</th>
            <th style="text-align:right;padding:8px 0;border-bottom:2px solid #d6336c;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="margin-top:16px;font-size:14px;">
        <div style="display:flex;justify-content:space-between;padding:4px 0;">
          <span>Subtotal</span><span>${formatRupiah(subtotal)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:4px 0;">
          <span>Ongkos Kirim</span><span>${formatRupiah(shippingCost)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;font-weight:bold;font-size:16px;border-top:2px solid #d6336c;margin-top:8px;">
          <span>Total</span><span>${formatRupiah(total)}</span>
        </div>
      </div>

      <p style="margin-top:20px;font-size:13px;color:#777;">
        Metode pembayaran: <strong>${paymentMethod}</strong><br/>
        Status: <strong style="color:#16a34a;">Lunas</strong>
      </p>

      <p style="margin-top:24px;font-size:13px;color:#777;">
        Pesananmu akan segera kami proses dan kirim. Terima kasih telah berbelanja di Vitalis! 💖
      </p>
    </div>
  </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Vitalis Beauty <onboarding@resend.dev>",
      to: [to],
      subject: `Invoice Pesanan #${orderId} - Vitalis Beauty`,
      html,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Resend error: ${res.status} ${errorText}`);
  }

  return res.json();
}
