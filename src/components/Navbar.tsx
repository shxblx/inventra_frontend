import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-[#735DA5] p-3">
      <div className="container mx-auto">
        {/* Desktop view */}
        <div className="hidden md:flex justify-between items-center">
          <div className="text-white text-3xl font-bold w-1/4">INVENTRA</div>
          <div className="flex justify-center space-x-4 w-2/4">
            <a
              href="#"
              className="text-white hover:bg-gray-700 px-3 py-2 rounded"
            >
              Home
            </a>
            <a
              href="#"
              className="text-white hover:bg-gray-700 px-3 py-2 rounded"
            >
              About
            </a>
            <a
              href="#"
              className="text-white hover:bg-gray-700 px-3 py-2 rounded"
            >
              Services
            </a>
            <a
              href="#"
              className="text-white hover:bg-gray-700 px-3 py-2 rounded"
            >
              Contact
            </a>
          </div>
          <div className="w-1/4"></div> {/* Placeholder for balance */}
        </div>

        {/* Mobile view */}
        <div className="md:hidden">
          <div className="flex justify-between items-center">
            <div className="text-white text-3xl font-bold">INVENTRA</div>
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              {isOpen ? "Close" : "Menu"}
            </button>
          </div>
          {isOpen && (
            <div className="flex flex-col items-center mt-4">
              <a
                href="#"
                className="block text-white hover:bg-gray-700 px-3 py-2 rounded w-full text-center"
              >
                Home
              </a>
              <a
                href="#"
                className="block text-white hover:bg-gray-700 px-3 py-2 rounded w-full text-center"
              >
                About
              </a>
              <a
                href="#"
                className="block text-white hover:bg-gray-700 px-3 py-2 rounded w-full text-center"
              >
                Services
              </a>
              <a
                href="#"
                className="block text-white hover:bg-gray-700 px-3 py-2 rounded w-full text-center"
              >
                Contact
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
