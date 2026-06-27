# TODO - Role Separation (Admin vs Customer)

- [ ] Implement route protection by role:
  - [ ] Update `src/app/checkout/page.tsx` so only `customer` can access; admin redirect to `/admin` (or message)
  - [ ] Update `/admin` redirects if role is not admin (review existing `src/app/admin/page.tsx`)
  - [ ] Identify and protect `/cart` if it exists

- [ ] Update global navbar behavior:
  - [ ] Edit `src/components/Header.tsx` so admin does NOT see cart/checkout menu and shows admin menu only

- [ ] Update Admin dashboard:
  - [ ] Enhance `src/app/admin/page.tsx`:
    - [ ] Keep stats cards and order summary
    - [ ] Add “Aksi Cepat” buttons (Tambah Produk, Kelola Produk, Kelola Pesanan, Lihat Laporan)
    - [ ] Add admin action buttons (Edit, Hapus, Update Stok) in “Produk Terbaru” and remove any buy/cart UI

- [ ] Create admin pages (localStorage prototype):
  - [ ] `src/app/admin/products/page.tsx` (Kelola Produk list + edit/delete/update stock buttons)
  - [ ] `src/app/admin/products/new/page.tsx` (Tambah Produk form; save to localStorage; redirect back)
  - [ ] `src/app/admin/orders/page.tsx` (Pesanan Admin: list + status update)
  - [ ] `src/app/admin/reports/page.tsx` (Laporan Penjualan: revenue, completed orders, products sold, total customer + transactions table)

- [ ] Update product UI for admin vs customer:
  - [ ] Ensure admin never sees “Tambah ke Keranjang” anywhere in `src/app/product-catalog/components/ProductCatalogPage.tsx`

- [ ] Smoke testing:
  - [ ] Login as admin -> verify cart/checkout hidden, URLs redirect protected
  - [ ] Login as customer -> verify cart/checkout still works

