import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800">
              School Directory
            </Link>
          </div>
          <div className="flex items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/addSchool" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Add School
              </Link>
              <Link href="/showSchools" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                View Schools
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}