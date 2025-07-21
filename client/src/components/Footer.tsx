import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ResumeFast</h3>
            <p className="text-gray-300">
              Create professional resumes online for free. Fast, easy, and professional resume builder.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/resume-builder">
                  <a className="text-gray-300 hover:text-white transition-colors">
                    Resume Builder
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy">
                  <a className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:support@resumefast.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ResumeFast. All rights reserved.</p>
          <p className="text-sm mt-2">
            Made with ❤️ for job seekers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}