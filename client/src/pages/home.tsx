import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import SEOHead from '@/components/SEOHead';
import { Zap, Download, Palette } from 'lucide-react';
import { BannerAd, SquareAd, InArticleAd } from '@/components/AdSense';
import { BannerAdPlaceholder, SquareAdPlaceholder } from '@/components/AdPlaceholder';

export default function Home() {
  const { user, signInWithGoogle } = useAuth();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (user) {
      setLocation('/dashboard');
    } else {
      signInWithGoogle();
    }
  };

  const handleBuildResume = () => {
    if (user) {
      setLocation('/resume-builder');
    } else {
      signInWithGoogle();
    }
  };

  return (
    <>
      <SEOHead />
      
      {/* Top Banner Ad */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center">
          
            {/* {process.env.NODE_ENV === 'development' ? (
              <BannerAdPlaceholder />
            ) : ( */}
              <BannerAd className="w-full max-w-4xl" />
            {/* )} */}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Free Online Resume Builder</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Create professional resumes in minutes. Download as PDF for free.
            </p>
            <Button 
              onClick={handleBuildResume}
              size="lg"
              className="bg-accent hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold shadow-lg"
            >
              Build My Resume Now
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ResumeFast?</h2>
            <p className="text-xl text-gray-600">The fastest way to create a professional resume</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Create your resume in under 5 minutes with our intuitive builder</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Free PDF Download</h3>
              <p className="text-gray-600">Download your resume as a high-quality PDF absolutely free</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Professional Templates</h3>
              <p className="text-gray-600">Choose from beautifully designed templates that get you hired</p>
            </div>
          </div>

          {/* In-Article Ad */}
          <div className="mt-16 flex justify-center">
            {/* {process.env.NODE_ENV === 'development' ? (
              <SquareAdPlaceholder />
            ) : ( */}
              <InArticleAd className="max-w-sm" />
            {/* )} */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Build Your Professional Resume?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of job seekers who've created winning resumes with ResumeFast
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-primary hover:bg-secondary text-white px-8 py-4 text-lg font-semibold shadow-lg"
          >
            Get Started Free
          </Button>
        </div>
      </section>
    </>
  );
}
