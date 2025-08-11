import { Link } from '@tanstack/react-router';
import { Code, Tag, GitBranch } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import type { TagWithCount } from '../tags/types';
import type { Repository } from '../repository/types';
import { useEffect, useMemo, useRef, useState } from 'react';

type StatCardProps = {
  icon: LucideIcon;
  title: string;
  value: string | number;
  link?: {
    to: string;
    text: string;
  };
  footerText?: string;
};

function StatCard({
  icon: Icon,
  title,
  value,
  link,
  footerText,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900 dark:text-white">
                {typeof value === 'number' ? (
                  <CountUpNumber value={value} />
                ) : (
                  value
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
        <div className="text-sm">
          {link ? (
            <Link
              to={link.to}
              className="font-medium text-cyan-700 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              {link.text}
            </Link>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">
              {footerText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  repositories: Repository[];
  tags: TagWithCount[];
  isLoading?: boolean;
}

export function DashboardStats({ repositories, tags }: DashboardStatsProps) {
  const uniqueLanguages = new Set(
    repositories.map(r => r.repository.primaryLanguage).filter(Boolean)
  ).size;

  const stats = [
    {
      icon: Code,
      title: 'Repositories',
      value: repositories.length,
      link: { to: '/repositories', text: 'View all' },
    },
    {
      icon: Tag,
      title: 'Tags',
      value: tags.length,
      link: { to: '/tags', text: 'Manage tags' },
    },
    {
      icon: GitBranch,
      title: 'Languages',
      value: uniqueLanguages,
      footerText: 'Unique languages',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          link={stat.link}
          footerText={stat.footerText}
        />
      ))}
    </div>
  );
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mediaQuery.matches);
    update();
    mediaQuery.addEventListener?.('change', update);
    return () => mediaQuery.removeEventListener?.('change', update);
  }, []);

  return reduced;
}

type CountUpNumberProps = {
  value: number;
  durationMs?: number;
};

function CountUpNumber({ value, durationMs = 700 }: CountUpNumberProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(0);
  const previousValueRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const clampedDuration = useMemo(() => {
    // Shorten duration for small deltas; cap for very large deltas
    const delta = Math.abs(value - previousValueRef.current);
    if (delta <= 10) return Math.min(durationMs, 500);
    if (delta >= 5000) return Math.max(durationMs, 900);
    return durationMs;
  }, [value, durationMs]);

  useEffect(() => {
    if (prefersReducedMotion) {
      previousValueRef.current = value;
      setDisplayValue(value);
      return;
    }

    const startValue = previousValueRef.current;
    const targetValue = value;
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / clampedDuration);
      const eased = easeOutCubic(progress);
      const current = Math.round(
        startValue + (targetValue - startValue) * eased
      );
      setDisplayValue(current);
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        previousValueRef.current = targetValue;
      }
    };

    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [value, clampedDuration, prefersReducedMotion]);

  useEffect(() => {
    // Initialize on mount to the first value without animating if reduced motion
    if (prefersReducedMotion) {
      setDisplayValue(value);
      previousValueRef.current = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <span>{displayValue.toLocaleString()}</span>;
}
