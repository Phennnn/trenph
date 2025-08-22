export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-primary">🚄 Tren-PH</h1>
          <div className="space-x-6">
            <a href="#" className="text-gray-700 hover:text-primary">Home</a>
            <a href="#" className="text-gray-700 hover:text-primary">Predict</a>
            <a href="#" className="text-gray-700 hover:text-primary">About</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
