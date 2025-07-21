import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/SEOHead';
import { Plus, FileText, Edit, Download, Trash2 } from 'lucide-react';
import type { Resume } from '@shared/schema';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  const { data: resumes, isLoading } = useQuery<Resume[]>({
    queryKey: ['/api/resumes'],
    enabled: !!user,
  });

  const deleteResumeMutation = useMutation({
    mutationFn: async (resumeId: number) => {
      return apiRequest('DELETE', `/api/resumes/${resumeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resumes'] });
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete resume",
      });
    },
  });

  const downloadPdfMutation = useMutation({
    mutationFn: async (resume: Resume) => {
      const response = await apiRequest('POST', '/api/generate-pdf', resume);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${resume.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resume downloaded successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download resume",
      });
    },
  });

  const handleNewResume = () => {
    setLocation('/resume-builder');
  };

  const handleEditResume = (resumeId: number) => {
    setLocation(`/resume-builder/${resumeId}`);
  };

  const handleDeleteResume = (resumeId: number) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      deleteResumeMutation.mutate(resumeId);
    }
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SEOHead 
        title="Dashboard | ResumeFast"
        description="Manage your professional resumes and download them as PDF"
      />
      
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">My Resumes</h1>
                <p className="text-gray-600">Manage and download your professional resumes</p>
              </div>
              <Button onClick={handleNewResume} className="bg-primary hover:bg-secondary">
                <Plus className="w-4 h-4 mr-2" />
                New Resume
              </Button>
            </div>
          </div>

          {/* Resume Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add New Resume Card */}
            <Card 
              className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer"
              onClick={handleNewResume}
            >
              <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Create New Resume</h3>
                <p className="text-sm text-gray-600">Start building your next professional resume</p>
              </CardContent>
            </Card>

            {/* Existing Resumes */}
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex space-x-2">
                      <div className="h-8 bg-gray-200 rounded flex-1"></div>
                      <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : resumes?.length === 0 ? (
              <Card className="md:col-span-2 lg:col-span-2">
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No resumes yet</h3>
                  <p className="text-gray-600 mb-4">Create your first resume to get started</p>
                  <Button onClick={handleNewResume} className="bg-primary hover:bg-secondary">
                    Create Resume
                  </Button>
                </CardContent>
              </Card>
            ) : (
              resumes?.map((resume) => (
                <Card key={resume.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 h-32 flex items-center justify-center mb-4">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{resume.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Updated {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditResume(resume.id)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => downloadPdfMutation.mutate(resume)}
                        disabled={downloadPdfMutation.isPending}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        {downloadPdfMutation.isPending ? 'Downloading...' : 'Download'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteResume(resume.id)}
                        disabled={deleteResumeMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
