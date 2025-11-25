import { useFeatureFlag } from '../../lib/use-feature-flags';

export function FeatureFlagExample() {
  const showNewFeature = useFeatureFlag('example-feature', false);
  const featureVariant = useFeatureFlag<string>('example-variant', 'control');

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <h3 className="text-lg font-semibold">Feature Flag Example</h3>

        {showNewFeature ? (
          <div className="mt-2 text-green-600 dark:text-green-400">
            ✓ New feature is enabled!
          </div>
        ) : (
          <div className="mt-2 text-gray-600 dark:text-gray-400">
            ✗ New feature is disabled
          </div>
        )}

        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Current variant: <span className="font-mono">{featureVariant}</span>
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>To test this:</p>
        <ol className="ml-4 mt-1 list-decimal space-y-1">
          <li>Create a flag called "example-feature" in LaunchDarkly</li>
          <li>Create a multivariate flag called "example-variant"</li>
          <li>Toggle the flags on/off to see changes in real-time</li>
        </ol>
      </div>
    </div>
  );
}
