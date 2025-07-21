import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/SEOHead';
import ResumePreview from '@/components/ResumePreview';
import { Download, Plus, Trash2, ZoomIn, ZoomOut } from 'lucide-react';
import { BuilderBannerAd, SidebarAd } from '@/components/AdSense';
import { BannerAdPlaceholder, SidebarAdPlaceholder } from '@/components/AdPlaceholder';
import type { ResumeData, Resume } from '@shared/schema';
import { nanoid } from 'nanoid';

export default function ResumeBuilder() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  
  const resumeId = params.id ? parseInt(params.id) : null;
  const [activeTab, setActiveTab] = useState('personal');
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });

  const [resumeTitle, setResumeTitle] = useState('My Resume');

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  // Load existing resume if editing
  const { data: existingResume } = useQuery<Resume>({
    queryKey: ['/api/resumes', resumeId],
    enabled: !!resumeId && !!user,
  });

  useEffect(() => {
    if (existingResume) {
      setResumeData(existingResume.data as ResumeData);
      setResumeTitle(existingResume.title);
    }
  }, [existingResume]);

  const saveResumeMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: resumeTitle,
        data: resumeData,
      };
      
      if (resumeId) {
        return apiRequest('PUT', `/api/resumes/${resumeId}`, payload);
      } else {
        return apiRequest('POST', '/api/resumes', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resumes'] });
      toast({
        title: "Success",
        description: resumeId ? "Resume updated successfully" : "Resume saved successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save resume",
      });
    },
  });

  const downloadPdfMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: resumeTitle,
        data: resumeData,
      };
      const response = await apiRequest('POST', '/api/generate-pdf', payload);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${resumeTitle}.pdf`;
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

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: nanoid(),
          title: '',
          company: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: nanoid(),
          degree: '',
          school: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          id: nanoid(),
          name: '',
          level: undefined,
        },
      ],
    }));
  };

  const updateSkill = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: nanoid(),
          name: '',
          description: '',
          technologies: '',
          url: '',
        },
      ],
    }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id),
    }));
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  const tabs = [
    { key: 'personal', label: 'Personal Info' },
    { key: 'experience', label: 'Experience' },
    { key: 'education', label: 'Education' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
  ];

  return (
    <>
      <SEOHead 
        title="Resume Builder | ResumeFast"
        description="Build your professional resume with our easy-to-use resume builder"
      />
      
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-primary">ResumeFast</h1>
                <span className="text-gray-600">Resume Builder</span>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="resume-title" className="text-sm text-gray-600">Title:</Label>
                  <Input
                    id="resume-title"
                    value={resumeTitle}
                    onChange={(e) => setResumeTitle(e.target.value)}
                    className="w-48"
                    placeholder="Resume title"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => saveResumeMutation.mutate()}
                  disabled={saveResumeMutation.isPending}
                >
                  {saveResumeMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  onClick={() => downloadPdfMutation.mutate()}
                  disabled={downloadPdfMutation.isPending}
                  className="bg-accent hover:bg-green-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {downloadPdfMutation.isPending ? 'Generating...' : 'Download PDF'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Banner Ad */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-center">
              {/* {process.env.NODE_ENV === 'development' ? (
                <BannerAdPlaceholder />
              ) : ( */}
                <BuilderBannerAd className="w-full max-w-4xl" />
              {/* )} */}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8">
            {/* Form Panel */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                          activeTab === tab.key
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Personal Info Tab */}
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={resumeData.personalInfo.firstName}
                          onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={resumeData.personalInfo.lastName}
                          onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        placeholder="john.doe@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        rows={4}
                        value={resumeData.personalInfo.summary}
                        onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                        placeholder="Brief overview of your professional background and career objectives..."
                      />
                    </div>
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                      <Button onClick={addExperience} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                    
                    {resumeData.experience.map((exp) => (
                      <Card key={exp.id} className="border border-gray-200">
                        <CardContent className="p-4 space-y-4">
                          <div className="flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeExperience(exp.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Job Title</Label>
                              <Input
                                value={exp.title}
                                onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                placeholder="Software Developer"
                              />
                            </div>
                            <div>
                              <Label>Company</Label>
                              <Input
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                placeholder="Tech Corp"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Start Date</Label>
                              <Input
                                type="date"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input
                                type="date"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              rows={3}
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                              placeholder="• Led development of customer-facing web applications&#10;• Improved application performance by 40%&#10;• Mentored junior developers"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {resumeData.experience.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No work experience added yet. Click "Add Experience" to get started.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                      <Button onClick={addEducation} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                    
                    {resumeData.education.map((edu) => (
                      <Card key={edu.id} className="border border-gray-200">
                        <CardContent className="p-4 space-y-4">
                          <div className="flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeEducation(edu.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Degree</Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                placeholder="Bachelor of Science"
                              />
                            </div>
                            <div>
                              <Label>School</Label>
                              <Input
                                value={edu.school}
                                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                placeholder="University Name"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Start Date</Label>
                              <Input
                                type="date"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input
                                type="date"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Description (Optional)</Label>
                            <Textarea
                              rows={2}
                              value={edu.description || ''}
                              onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                              placeholder="Relevant coursework, GPA, honors..."
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {resumeData.education.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No education added yet. Click "Add Education" to get started.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                      <Button onClick={addSkill} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skill
                      </Button>
                    </div>
                    
                    {resumeData.skills.map((skill) => (
                      <Card key={skill.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <Input
                                value={skill.name}
                                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                                placeholder="JavaScript"
                              />
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeSkill(skill.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {resumeData.skills.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No skills added yet. Click "Add Skill" to get started.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                      <Button onClick={addProject} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </div>
                    
                    {resumeData.projects.map((project) => (
                      <Card key={project.id} className="border border-gray-200">
                        <CardContent className="p-4 space-y-4">
                          <div className="flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeProject(project.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Project Name</Label>
                              <Input
                                value={project.name}
                                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                                placeholder="E-commerce Website"
                              />
                            </div>
                            <div>
                              <Label>URL (Optional)</Label>
                              <Input
                                value={project.url || ''}
                                onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                                placeholder="https://github.com/username/project"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              rows={3}
                              value={project.description}
                              onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                              placeholder="Describe your project and its impact..."
                            />
                          </div>
                          <div>
                            <Label>Technologies</Label>
                            <Input
                              value={project.technologies}
                              onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                              placeholder="React, Node.js, MongoDB"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {resumeData.projects.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No projects added yet. Click "Add Project" to get started.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card className="lg:col-span-1 xl:col-span-1">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <ResumePreview data={resumeData} />
              </CardContent>
            </Card>

            {/* Ad Sidebar - Only visible on extra large screens */}
            <div className="hidden xl:block">
              <div className="sticky top-8 space-y-6">
                {/* Sidebar Ad */}
                <Card>
                  <CardContent className="p-4 text-center">
                    {/* {process.env.NODE_ENV === 'development' ? (
                      <SidebarAdPlaceholder />
                    ) : ( */}
                      <SidebarAd />
                    {/* // )} */}
                  </CardContent>
                </Card>
                
                {/* Additional smaller ad */}
                <Card>
                  <CardContent className="p-4 text-center">
                    {/* {process.env.NODE_ENV === 'development' ? (
                      <div className="border-2 border-dashed border-gray-300 bg-gray-50 h-24 flex items-center justify-center text-gray-500 text-xs">
                        Square Ad<br />300x250
                      </div>
                    ) : ( */}
                      <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500">
                        <div>
                          <ins
                            className="adsbygoogle"
                            style={{ display: 'block', width: '300px', height: '250px' }}
                            data-ad-client="ca-pub-1234567890123456"
                            data-ad-slot="1234567894"
                          />
                        </div>
                      </div>
                    {/* )} */}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
