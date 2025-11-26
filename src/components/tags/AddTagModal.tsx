import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Tag, Plus, Palette } from 'lucide-react';
import { useState, type FormEvent, useRef } from 'react';
import { useCreateTagMutation } from '../../hooks/tags';
import { TAG_COLORS, getPredefinedColor } from '../../utils/colors';
import { useThemeStore } from '../../stores/themeStore';

interface AddTagModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTagModal({ isOpen, onOpenChange }: AddTagModalProps) {
  const [suggestedColor, setSuggestedColor] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState<string | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { theme } = useThemeStore();

  const createTagMutation = useCreateTagMutation({
    onSuccess: () => {
      handleReset();
      onOpenChange(false);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const colorSelection = formData.get('color') as string;
    const customColor = formData.get('customColor') as string;

    const trimmedTitle = title?.trim();
    if (trimmedTitle) {
      const finalColor =
        colorSelection === 'custom' ? customColor : colorSelection;
      createTagMutation.mutate({
        title: trimmedTitle,
        color: finalColor || TAG_COLORS[0],
      });
    }
  };

  const handleReset = () => {
    setSuggestedColor(null);
    setCustomColor(null);
    createTagMutation.reset();
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    handleReset();
  };

  const handleSuggestedColorClick = () => {
    if (suggestedColor && formRef.current) {
      // Find and check the radio button that matches the suggested color
      const radio = formRef.current.querySelector(
        `input[name="color"][value="${suggestedColor}"]`
      ) as HTMLInputElement;
      if (radio) {
        radio.checked = true;
        // Clear custom color since we're using a preset
        setCustomColor(null);
      } else {
        // If it's a custom color, set the custom color input and select custom radio
        const customColorInput = formRef.current.querySelector(
          'input[name="customColor"]'
        ) as HTMLInputElement;
        const customRadio = formRef.current.querySelector(
          'input[name="color"][value="custom"]'
        ) as HTMLInputElement;
        if (customColorInput && customRadio) {
          customColorInput.value = suggestedColor;
          customRadio.checked = true;
          // Set custom color to the suggested color
          setCustomColor(suggestedColor);
        }
      }
    }
  };

  return (
    <>
      {/* Add Tag Button */}
      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="block rounded-md bg-teal-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 cursor-pointer"
        >
          <Plus className="inline-block w-4 h-4 mr-1" />
          Add tag
        </button>
      </div>

      {/* Add Tag Dialog */}
      <Dialog open={isOpen} onClose={handleCancel} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <form ref={formRef} onSubmit={handleSubmit}>
                <div>
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                    <Tag className="size-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <DialogTitle
                      as="h3"
                      className="font-semibold text-base text-gray-900 dark:text-gray-100"
                    >
                      Add New Tag
                    </DialogTitle>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor="add-title"
                          className="block font-medium text-gray-900 dark:text-gray-100 text-sm/6"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="add-title"
                          name="title"
                          onChange={e => {
                            // Always check for suggested colors when title changes
                            const newTitle = e.target.value.trim();
                            if (newTitle) {
                              const suggested = getPredefinedColor(newTitle);
                              setSuggestedColor(suggested || null);
                            } else {
                              // Clear suggestion when title is empty
                              setSuggestedColor(null);
                            }
                            // Clear error when user starts typing
                            if (createTagMutation.error) {
                              createTagMutation.reset();
                            }
                          }}
                          placeholder="Enter tag name..."
                          className="mt-2 -outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:outline-teal-600 sm:text-sm/6"
                          required
                        />
                        {suggestedColor && (
                          <button
                            type="button"
                            onClick={handleSuggestedColorClick}
                            className="mt-2 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
                          >
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                              style={{ backgroundColor: suggestedColor }}
                            />
                            <span>Suggested color (click to use)</span>
                          </button>
                        )}
                      </div>
                      <fieldset>
                        <legend className="block font-medium text-gray-900 dark:text-gray-100 text-sm/6 mb-2">
                          Color
                        </legend>
                        <div className="grid grid-cols-6 gap-2 justify-items-center">
                          {TAG_COLORS.map((tagColor, index) => (
                            <label
                              key={tagColor}
                              className="relative cursor-pointer w-8 h-8 block"
                            >
                              <input
                                type="radio"
                                name="color"
                                value={tagColor}
                                defaultChecked={index === 0}
                                className="sr-only peer"
                              />
                              <div
                                className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:border-gray-900 dark:peer-checked:border-gray-100 peer-focus:ring-2 peer-focus:ring-teal-600 peer-focus:ring-offset-2"
                                style={{ backgroundColor: tagColor }}
                              />
                              <span className="sr-only">
                                Select {tagColor} color
                              </span>
                            </label>
                          ))}
                          {/* Custom color option */}
                          <label className="cursor-pointer w-8 h-8 block relative">
                            <input
                              type="radio"
                              name="color"
                              value="custom"
                              className="sr-only peer"
                            />
                            <div
                              className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:border-gray-900 dark:peer-checked:border-gray-100 peer-focus:ring-2 peer-focus:ring-teal-600 peer-focus:ring-offset-2 overflow-hidden cursor-pointer"
                              style={{
                                background:
                                  customColor ??
                                  suggestedColor ??
                                  'conic-gradient(from 0deg, #ff0000 0deg, #ff8000 60deg, #ffff00 120deg, #80ff00 180deg, #00ff80 240deg, #0080ff 300deg, #8000ff 360deg)',
                              }}
                              onClick={() => colorInputRef.current?.click()}
                            />
                            <Palette
                              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-full p-0.5 border border-gray-300 dark:border-gray-600 pointer-events-none"
                              strokeWidth={1.5}
                            />
                            <span className="sr-only">Select custom color</span>
                          </label>
                          {/* Hidden color picker and custom color value */}
                          <input
                            ref={colorInputRef}
                            type="color"
                            name="customColor"
                            defaultValue="#14b8a6"
                            onChange={e => {
                              // When color is picked, select the custom radio
                              const customRadio =
                                formRef.current?.querySelector(
                                  'input[name="color"][value="custom"]'
                                ) as HTMLInputElement;
                              if (customRadio) {
                                customRadio.checked = true;
                              }
                              setCustomColor(e.target.value);
                            }}
                            className="sr-only"
                            style={{ colorScheme: theme }}
                            aria-label="Custom color picker"
                          />
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>

                {createTagMutation.error && (
                  <div className="mt-3">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {createTagMutation.error instanceof Error &&
                      createTagMutation.error.message.includes('already exists')
                        ? `A tag with this name already exists. Please choose a different name.`
                        : createTagMutation.error instanceof Error
                          ? createTagMutation.error.message
                          : 'Failed to add tag'}
                    </p>
                  </div>
                )}

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    disabled={createTagMutation.isPending}
                    className="inline-flex w-full justify-center rounded-md bg-teal-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-teal-600 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer sm:col-start-2"
                  >
                    {createTagMutation.isPending ? 'Adding...' : 'Add Tag'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 font-semibold text-gray-900 dark:text-gray-100 text-sm shadow-xs ring-1 ring-gray-300 dark:ring-gray-600 ring-inset hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer sm:col-start-1 sm:mt-0"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
