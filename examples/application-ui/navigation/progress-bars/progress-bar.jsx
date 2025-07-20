export default function Example() {
  return (
    <div>
      <h4 className="sr-only">Status</h4>
      <p className="font-medium text-gray-900 text-sm">
        Migrating MySQL database...
      </p>
      <div aria-hidden="true" className="mt-6">
        <div className="overflow-hidden rounded-full bg-gray-200">
          <div
            style={{ width: '37.5%' }}
            className="h-2 rounded-full bg-indigo-600"
          />
        </div>
        <div className="mt-6 hidden grid-cols-4 font-medium text-gray-600 text-sm sm:grid">
          <div className="text-indigo-600">Copying files</div>
          <div className="text-center text-indigo-600">Migrating database</div>
          <div className="text-center">Compiling assets</div>
          <div className="text-right">Deployed</div>
        </div>
      </div>
    </div>
  );
}
