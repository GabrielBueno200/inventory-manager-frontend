import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('@/layouts/RootLayout').then((m) => ({ Component: m.RootLayout })),
    children: [
      {
        index: true,
        element: null,
        loader: () => { throw new Response('', { status: 302, headers: { Location: '/products' } }) },
      },
      {
        path: 'products',
        lazy: () =>
          import('@/pages/StockManagementPage').then((m) => ({
            Component: m.StockManagementPage,
          })),
      },
      {
        path: 'products/:id',
        lazy: () =>
          import('@/pages/ProductDetailPage').then((m) => ({ Component: m.ProductDetailPage })),
      },
      {
        path: 'accounts',
        lazy: () =>
          import('@/pages/AccountsPage').then((m) => ({ Component: m.AccountsPage })),
      },
      {
        path: 'settings/parameters',
        lazy: () =>
          import('@/pages/ParametersPage').then((m) => ({ Component: m.ParametersPage })),
      },
    ],
  },
])
