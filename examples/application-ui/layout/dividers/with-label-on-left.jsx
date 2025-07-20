export default function Example() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <div className="w-full border-gray-300 border-t" />
      </div>
      <div className="relative flex justify-start">
        <span className="bg-white pr-2 text-gray-500 text-sm">Continue</span>
      </div>
    </div>
  );
}
