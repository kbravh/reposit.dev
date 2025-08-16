import React from 'react';
import { MatchRoute } from '@tanstack/react-router';
import { Spinner } from '../ui/Spinner';

interface MatchRouteSpinnerProps {
  to: string;
  params?: Record<string, unknown>;
  search?: Record<string, unknown>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

/**
 * Component that shows a spinner when a specific route is pending.
 * Useful for showing loading states next to specific navigation links.
 *
 * Example usage:
 * ```tsx
 * <Link to="/dashboard">
 *   Dashboard
 *   <MatchRouteSpinner to="/dashboard" size="sm" />
 * </Link>
 * ```
 */
export function MatchRouteSpinner({
  to,
  params,
  search,
  className,
  size = 'sm',
  children,
}: MatchRouteSpinnerProps) {
  return (
    <MatchRoute to={to} params={params} search={search} pending>
      {match => (
        <Spinner show={!!match} size={size} className={className}>
          {children}
        </Spinner>
      )}
    </MatchRoute>
  );
}
