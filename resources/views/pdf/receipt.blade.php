<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #1e293b; background: #fff; }
        .page { padding: 36px 40px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
        .brand { font-size: 20px; font-weight: 700; color: #3b5bdb; }
        .brand-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
        .invoice-meta { text-align: right; }
        .invoice-meta .label { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; }
        .invoice-meta .value { font-size: 14px; font-weight: 700; color: #1e293b; }
        .invoice-meta .date { font-size: 11px; color: #64748b; margin-top: 2px; }
        .meta-grid { display: flex; gap: 40px; margin-bottom: 24px; }
        .meta-block .meta-label { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 3px; }
        .meta-block .meta-value { font-size: 12px; color: #1e293b; font-weight: 500; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        thead tr { background: #f1f5f9; }
        thead th { padding: 9px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: #64748b; font-weight: 600; }
        thead th.right { text-align: right; }
        tbody tr { border-bottom: 1px solid #e2e8f0; }
        tbody tr:last-child { border-bottom: none; }
        tbody td { padding: 10px 12px; font-size: 12px; color: #334155; }
        tbody td.right { text-align: right; }
        .totals { margin-left: auto; width: 240px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
        .totals-row { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 6px; }
        .totals-total { display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; color: #1e293b; border-top: 2px solid #e2e8f0; padding-top: 8px; margin-top: 6px; }
        .footer { margin-top: 36px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 600; }
        .badge-cash { background: #d1fae5; color: #065f46; }
        .badge-zaad, .badge-evc, .badge-jeeb { background: #dbeafe; color: #1e40af; }
        .badge-card { background: #fef3c7; color: #92400e; }
    </style>
</head>
<body>
<div class="page">
    <div class="header">
        <div>
            <div class="brand">Daweyn Pharmacy</div>
            <div class="brand-sub">{{ $team->name ?? 'Pharmacy Receipt' }}</div>
        </div>
        <div class="invoice-meta">
            <div class="label">Invoice</div>
            <div class="value">{{ $transaction->invoice_number }}</div>
            <div class="date">{{ \Carbon\Carbon::parse($transaction->created_at)->format('d M Y, H:i') }}</div>
        </div>
    </div>

    <div class="meta-grid">
        <div class="meta-block">
            <div class="meta-label">Customer</div>
            <div class="meta-value">{{ $transaction->customer?->name ?? 'Walk-in Customer' }}</div>
        </div>
        <div class="meta-block">
            <div class="meta-label">Cashier</div>
            <div class="meta-value">{{ $transaction->cashier?->name ?? '—' }}</div>
        </div>
        <div class="meta-block">
            <div class="meta-label">Payment</div>
            <div class="meta-value">
                <span class="badge badge-{{ $transaction->payment_method }}">
                    {{ ucfirst($transaction->payment_method) }}
                </span>
            </div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th class="right">Qty</th>
                <th class="right">Unit Price</th>
                <th class="right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($transaction->items as $item)
            <tr>
                <td>{{ $item->product?->name ?? '—' }}</td>
                <td class="right">{{ $item->quantity }}</td>
                <td class="right">${{ number_format($item->unit_price, 2) }}</td>
                <td class="right">${{ number_format($item->total, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <div class="totals-row"><span>Subtotal</span><span>${{ number_format($transaction->subtotal, 2) }}</span></div>
        @if ($transaction->discount > 0)
        <div class="totals-row"><span>Discount</span><span>-${{ number_format($transaction->discount, 2) }}</span></div>
        @endif
        @if ($transaction->tax > 0)
        <div class="totals-row"><span>Tax</span><span>${{ number_format($transaction->tax, 2) }}</span></div>
        @endif
        <div class="totals-total"><span>Total</span><span>${{ number_format($transaction->total, 2) }}</span></div>
    </div>

    <div class="footer">
        Thank you for your business! &mdash; Daweyn Pharmacy
    </div>
</div>
</body>
</html>
