export default function Footer() {
    return (
      <footer className="bg-gradient-to-r from-indigo-100 to-purple-100 py-10 mt-16">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
            <h3 className="font-bold mb-3 text-indigo-600">Shop</h3>
            <ul className="text-gray-600 space-y-1">
              <li>Electronics</li>
              <li>Furniture</li>
              <li>Clothing</li>
              <li>Home & Garden</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
            <h3 className="font-bold mb-3 text-indigo-600">Customer Service</h3>
            <ul className="text-gray-600 space-y-1">
              <li>Contact Us</li>
              <li>Shipping Info</li>
              <li>Returns</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
            <h3 className="font-bold mb-3 text-indigo-600">Company</h3>
            <ul className="text-gray-600 space-y-1">
              <li>About Us</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
            <h3 className="font-bold mb-3 text-indigo-600">Connect</h3>
            <ul className="text-gray-600 space-y-1">
              <li>Newsletter</li>
              <li>Social Media</li>
              <li>Blog</li>
              <li>Support</li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }
  