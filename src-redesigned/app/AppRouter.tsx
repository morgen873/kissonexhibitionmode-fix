import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { NotFound } from '@/shared/components/not-found/NotFound';

// Lazy load features for better performance
const LandingFeature = React.lazy(() => import('@/features/landing/LandingFeature'));
const CreationFeature = React.lazy(() => import('@/features/creation/CreationFeature'));
const RecipeFeature = React.lazy(() => import('@/features/recipe/RecipeFeature'));
const QRCodeFeature = React.lazy(() => import('@/features/qr-code/QRCodeFeature'));

// Route configuration for better maintainability
const routes = [
  {
    path: '/',
    element: LandingFeature,
  },
  {
    path: '/standby',
    element: LandingFeature,
  },
  {
    path: '/creation',
    element: CreationFeature,
  },
  {
    path: '/recipe/:id',
    element: RecipeFeature,
  },
  {
    path: '/qr-code',
    element: QRCodeFeature,
  },
] as const;

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner variant="fullscreen" />}>
      <Routes>
        {routes.map(({ path, element: Component }) => (
          <Route 
            key={path} 
            path={path} 
            element={<Component />} 
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};