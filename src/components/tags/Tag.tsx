import { Check, Plus } from 'lucide-react';

interface TagProps {
  title: string;
  color: string;
}

interface DisplayTagProps extends TagProps {
  variant?: 'display';
}

interface SelectableTagProps extends TagProps {
  variant: 'selectable';
  selected: boolean;
  isNew?: boolean;
  onClick: () => void;
}

type TagComponentProps = DisplayTagProps | SelectableTagProps;

export function Tag(props: TagComponentProps) {
  const { title, color, variant = 'display' } = props;

  const baseClassName =
    'inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 dark:text-white ring-1 ring-gray-300 dark:ring-gray-600 ring-inset';

  if (variant === 'selectable') {
    const { selected, isNew, onClick } = props as SelectableTagProps;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClassName} transition-all hover:opacity-80 cursor-pointer ${
          !selected ? 'opacity-60' : ''
        }`}
        style={
          selected
            ? {
                boxShadow: `0 0 0 2px ${color}`,
              }
            : undefined
        }
      >
        {selected ? (
          <Check className="size-3.5" style={{ color }} />
        ) : (
          <Plus className="size-3.5" style={{ color }} />
        )}
        {title}
        {isNew && <span className="ml-1 opacity-70">(new)</span>}
      </button>
    );
  }

  // Display variant (default)
  return (
    <span className={baseClassName}>
      <svg
        viewBox="0 0 6 6"
        aria-hidden="true"
        className="size-1.5"
        style={{ fill: color }}
        width="6"
        height="6"
      >
        <circle r={3} cx={3} cy={3} />
      </svg>
      {title}
    </span>
  );
}
