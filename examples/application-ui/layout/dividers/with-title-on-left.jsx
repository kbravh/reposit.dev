export default function Example() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <div className="w-full border-gray-300 border-t" />
      </div>
      <div className="relative flex justify-start">
        <span className="bg-white pr-3 font-semibold text-base text-gray-900">
          Projects
        </span>
      </div>
    </div>
  );
}
