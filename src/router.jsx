import { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

import { ErrorBoundary } from 'react-error-boundary'
import Error from '@/app/error'

const NotFound = lazy(() => import('@/app/not-found.jsx'))

// Auto-import pages & layouts
const pages = import.meta.glob('@/app/**/page.jsx')
const layouts = import.meta.glob('@/app/**/layout.jsx')

// Convert file paths to routes
const routes = Object.keys(pages).map((path) => {
  const Page = lazy(pages[path])
  const layoutPath = path.replace('/page.jsx', '/layout.jsx')
  const Layout = layouts[layoutPath]?.default || (({ children }) => <>{children}</>)

  let routePath = path
    .replace(/.*\/app/, '')
    .replace('/page.jsx', '')
    .replace(/\/index$/, '')
    .replace(/\[(.*?)\]/g, ':$1')
    .replace(/\/\((.*?)\)/g, '')

  console.log(path, routePath)

  return {
    path: routePath,
    element: (
      <ErrorBoundary FallbackComponent={Error}>
        <Layout>
          <Page />
        </Layout>
      </ErrorBoundary>
    ),
  }
})

// Add 404 route
routes.push({
  path: '*',
  element: (
    <ErrorBoundary FallbackComponent={Error}>
      <NotFound />
    </ErrorBoundary>
  ),
})

export default function AppRouter() {
  return useRoutes(routes)
}
