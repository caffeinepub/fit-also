import type { ExtendedOrder } from "../backend";

/**
 * Generates a branded PDF invoice for a Fit Also order.
 * Uses the browser's native print API to create a downloadable PDF.
 * No external library required.
 */
export function generateInvoice(order: ExtendedOrder): void {
  const date = new Date(Number(order.orderDate)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const address = order.deliveryAddress
    ? [
        order.deliveryAddress.houseNo,
        order.deliveryAddress.area,
        order.deliveryAddress.city,
        order.deliveryAddress.state,
        order.deliveryAddress.pinCode,
      ]
        .filter(Boolean)
        .join(", ")
    : "Address not provided";

  let customizationRows = "";
  try {
    const cust = JSON.parse(order.customizationJson || "{}") as Record<
      string,
      string
    >;
    customizationRows = Object.entries(cust)
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 8px;border:1px solid #e5e7eb;color:#6b7280;text-transform:capitalize;">${k.replace(/([A-Z])/g, " $1")}</td><td style="padding:4px 8px;border:1px solid #e5e7eb;">${v}</td></tr>`,
      )
      .join("");
  } catch {}

  const html = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Fit Also Invoice — ${order.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: #1a1a2e;
      font-size: 13px;
      line-height: 1.5;
    }
    .invoice-wrap {
      max-width: 680px;
      margin: 0 auto;
      padding: 32px 40px;
    }
    /* Header */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20px;
      border-bottom: 3px solid #1565C0;
      margin-bottom: 24px;
    }
    .brand {
      display: flex;
      flex-direction: column;
    }
    .brand-name {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 0.08em;
      color: #1565C0;
      text-transform: uppercase;
    }
    .brand-tagline {
      font-size: 10px;
      color: #6b7280;
      letter-spacing: 0.12em;
      margin-top: 2px;
      text-transform: uppercase;
    }
    .invoice-label {
      text-align: right;
    }
    .invoice-label h2 {
      font-size: 22px;
      font-weight: 700;
      color: #1565C0;
      letter-spacing: 0.04em;
    }
    .invoice-label p {
      font-size: 11px;
      color: #6b7280;
      margin-top: 3px;
    }
    /* Meta row */
    .meta-row {
      display: flex;
      gap: 32px;
      margin-bottom: 24px;
      background: #f8faff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
    }
    .meta-item label {
      font-size: 10px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: block;
      margin-bottom: 3px;
    }
    .meta-item span {
      font-weight: 600;
      color: #1a1a2e;
      font-size: 13px;
    }
    /* Section title */
    .section-title {
      font-size: 11px;
      font-weight: 700;
      color: #1565C0;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
    }
    /* Address block */
    .address-block {
      margin-bottom: 20px;
    }
    .address-block p {
      color: #374151;
      line-height: 1.6;
    }
    /* Product table */
    .product-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .product-table th {
      background: #1565C0;
      color: white;
      padding: 8px 12px;
      text-align: left;
      font-size: 11px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .product-table td {
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      color: #374151;
    }
    .product-table tr:nth-child(even) td { background: #f9fafb; }
    /* Total section */
    .total-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 24px;
    }
    .total-box {
      background: #f8faff;
      border: 1px solid #1565C0;
      border-radius: 8px;
      padding: 16px 24px;
      min-width: 200px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 32px;
      padding: 4px 0;
    }
    .total-row.grand {
      border-top: 2px solid #1565C0;
      margin-top: 8px;
      padding-top: 8px;
    }
    .total-row.grand span:last-child {
      font-size: 18px;
      font-weight: 900;
      color: #1565C0;
    }
    /* Status badge */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 600;
    }
    /* Payment badge */
    .payment-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #fef9c3;
      color: #713f12;
      border: 1px solid #fde68a;
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 600;
    }
    /* Footer */
    .footer {
      border-top: 2px solid #e2e8f0;
      padding-top: 16px;
      text-align: center;
      color: #9ca3af;
      font-size: 11px;
    }
    .footer strong {
      color: #1565C0;
    }
    @media print {
      body { background: white; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-wrap">
    <!-- Header -->
    <div class="header">
      <div class="brand">
        <div class="brand-name">FIT ALSO</div>
        <div class="brand-tagline">India's Custom Tailoring Marketplace</div>
      </div>
      <div class="invoice-label">
        <h2>INVOICE</h2>
        <p>Invoice No: ${order.id.slice(0, 12).toUpperCase()}</p>
        <p>Date: ${date}</p>
      </div>
    </div>

    <!-- Meta -->
    <div class="meta-row">
      <div class="meta-item">
        <label>Order ID</label>
        <span>${order.id}</span>
      </div>
      <div class="meta-item">
        <label>Status</label>
        <span>${order.status || "Order Placed"}</span>
      </div>
      <div class="meta-item">
        <label>Payment</label>
        <span>${order.paymentMode || "Cash on Delivery"}</span>
      </div>
    </div>

    <!-- Customer Info -->
    <div class="address-block">
      <div class="section-title">Billing & Delivery Details</div>
      <p><strong>${order.customerName || "Customer"}</strong></p>
      <p>${address}</p>
      ${order.customerPhone ? `<p>📱 ${order.customerPhone}${order.customerAltPhone ? ` | Alt: ${order.customerAltPhone}` : ""}</p>` : ""}
    </div>

    <!-- Product Details -->
    <div class="section-title">Order Items</div>
    <table class="product-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Category</th>
          <th>Details</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${order.listingTitle || "Custom Garment"}</strong></td>
          <td>${order.category || "—"}</td>
          <td>Custom Tailoring (COD)</td>
          <td><strong>₹${order.totalPrice.toLocaleString("en-IN")}</strong></td>
        </tr>
        ${customizationRows ? `<tr><td colspan="4"><details><summary style="cursor:pointer;color:#6b7280;font-size:11px;">Customization Details</summary><table style="width:100%;margin-top:6px;">${customizationRows}</table></details></td></tr>` : ""}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="total-section">
      <div class="total-box">
        <div class="total-row">
          <span>Subtotal</span>
          <span>₹${order.totalPrice.toLocaleString("en-IN")}</span>
        </div>
        <div class="total-row">
          <span>Delivery</span>
          <span style="color:#16a34a">FREE</span>
        </div>
        <div class="total-row">
          <span>Tax (GST)</span>
          <span>—</span>
        </div>
        <div class="total-row grand">
          <span style="font-weight:700;">Total</span>
          <span>₹${order.totalPrice.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>

    <!-- Status & Payment Mode -->
    <div style="display:flex;gap:12px;margin-bottom:24px;">
      <div>
        <div class="section-title" style="margin-bottom:6px;">Order Status</div>
        <span class="status-badge">✓ ${order.status || "Order Placed"}</span>
      </div>
      <div>
        <div class="section-title" style="margin-bottom:6px;">Payment Mode</div>
        <span class="payment-badge">💵 ${order.paymentMode || "Cash on Delivery"}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Thank you for shopping with <strong>Fit Also</strong>! 🧵</p>
      <p style="margin-top:4px;">For queries, contact us at support@fitalso.in</p>
      <p style="margin-top:8px;font-size:10px;">© ${new Date().getFullYear()} Fit Also. All rights reserved. | India's Premier Custom Tailoring Marketplace</p>
    </div>
  </div>

  <script>
    window.onload = function() {
      window.print();
      setTimeout(function() { window.close(); }, 1000);
    };
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank", "width=800,height=900");
  if (win) {
    win.focus();
  } else {
    // Fallback: direct download
    const a = document.createElement("a");
    a.href = url;
    a.download = `FitAlso-Invoice-${order.id.slice(0, 8)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
