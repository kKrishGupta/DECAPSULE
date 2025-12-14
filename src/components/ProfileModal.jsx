// ProfileModel.jsx 

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { loginUser, signupUser, logoutUser } from "@/auth";
import { User, Code2, Award, Target, LogOut } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ProfileModal({ open, onOpenChange, isLoggedIn = false, currentUser = null, onLogin = () => true, onSignup = () => true, onLogout = () => {} }) {
  const [activeTab, setActiveTab] = React.useState("login");
  const [loginData, setLoginData] = React.useState({ email: "", password: "" });
  const [signupData, setSignupData] = React.useState({ fullName: "", email: "", password: "", confirmPassword: "" });

  const [profile, setProfile] = React.useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    bio: 'Passionate about algorithms and data structures',
    experienceLevel: 'intermediate',
    favoriteTopics: 'Dynamic Programming, Graph Algorithms',
    problemsSolved: '250',
    currentGoal: 'Master advanced graph algorithms',
    preferredLanguage: 'JavaScript',
    learningStyle: 'Visual learner with hands-on practice',
  });

  // Update profile when user logs in
  React.useEffect(() => {
    if (isLoggedIn && currentUser) {
      setProfile((prev) => ({
        ...prev,
        fullName: currentUser.name || 'User',
        email: currentUser.email || '',
        username: currentUser.name?.toLowerCase().replace(/\s/g, '') || 'user',
      }));
    }
  }, [isLoggedIn, currentUser]);

  const handleLoginClick = async () => {
    try {
      await loginUser(loginData.email, loginData.password);
      onOpenChange(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSignupClick = async () => {
    if (signupData.password !== signupData.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await signupUser(signupData.email, signupData.password);
      onOpenChange(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogoutClick = async () => {
    await logoutUser();
  };


  const handleSave = () => {
    alert('Profile saved successfully!');
    onOpenChange(false);
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[85vh] bg-card text-card-foreground border-border">
        {!isLoggedIn ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-1 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
                </div>
                {activeTab === "login" ? "Welcome Back" : "Join DECAPSULE"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {activeTab === "login" ? "Sign in to your account" : "Create a new account to get started"}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 flex flex-col overflow-hidden pt-4">
              {activeTab === "login" ? (
                <div className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-foreground">Email Address</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="bg-background text-foreground border-border"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-foreground">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="bg-background text-foreground border-border"
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleLoginClick} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                      Sign In
                    </Button>
                    <Button variant="ghost" onClick={() => setActiveTab("signup")} className="flex-1 bg-transparent text-foreground hover:bg-muted hover:text-foreground">
                      Create Account
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-foreground">Full Name</Label>
                    <Input
                      id="signup-name"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      className="bg-background text-foreground border-border"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-foreground">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="bg-background text-foreground border-border"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="bg-background text-foreground border-border"
                      placeholder="At least 6 characters"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-foreground">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className="bg-background text-foreground border-border"
                      placeholder="Confirm your password"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleSignupClick} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                      Create Account
                    </Button>
                    <Button variant="ghost" onClick={() => setActiveTab("login")} className="flex-1 bg-transparent text-foreground hover:bg-muted hover:text-foreground">
                      Already have account?
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="bg-transparent text-foreground hover:bg-muted hover:text-foreground">
                Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-1 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
                </div>
                User Profile
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Manage your personal information and DSA learning preferences
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="personal" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="bg-muted">
                <TabsTrigger value="personal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">
                  <User className="w-4 h-4 mr-2" strokeWidth={2} />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="dsa" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">
                  <Code2 className="w-4 h-4 mr-2" strokeWidth={2} />
                  DSA Background
                </TabsTrigger>
                <TabsTrigger value="goals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">
                  <Target className="w-4 h-4 mr-2" strokeWidth={2} />
                  Goals & Progress
                </TabsTrigger>
              </TabsList>

          <div className="flex-1 overflow-hidden mt-4">
            <TabsContent value="personal" className="h-full m-0">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      className="bg-background text-foreground border-border"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground">Username</Label>
                    <Input
                      id="username"
                      value={profile.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                      className="bg-background text-foreground border-border"
                      placeholder="Choose a username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="bg-background text-foreground border-border"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-foreground">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      className="bg-background text-foreground border-border min-h-24"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="dsa" className="h-full m-0">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel" className="text-foreground">Experience Level</Label>
                    <Select value={profile.experienceLevel} onValueChange={(value) => handleChange('experienceLevel', value)}>
                      <SelectTrigger className="bg-background text-foreground border-border">
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover text-popover-foreground border-border">
                        <SelectItem value="beginner">Beginner - Just starting out</SelectItem>
                        <SelectItem value="intermediate">Intermediate - Comfortable with basics</SelectItem>
                        <SelectItem value="advanced">Advanced - Solving complex problems</SelectItem>
                        <SelectItem value="expert">Expert - Competitive programmer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage" className="text-foreground">Preferred Programming Language</Label>
                    <Select value={profile.preferredLanguage} onValueChange={(value) => handleChange('preferredLanguage', value)}>
                      <SelectTrigger className="bg-background text-foreground border-border">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover text-popover-foreground border-border">
                        <SelectItem value="JavaScript">JavaScript</SelectItem>
                        <SelectItem value="Python">Python</SelectItem>
                        <SelectItem value="C++">C++</SelectItem>
                        <SelectItem value="Java">Java</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="problemsSolved" className="text-foreground">Problems Solved</Label>
                    <Input
                      id="problemsSolved"
                      type="number"
                      value={profile.problemsSolved}
                      onChange={(e) => handleChange('problemsSolved', e.target.value)}
                      className="bg-background text-foreground border-border"
                      placeholder="e.g., 250"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="favoriteTopics" className="text-foreground">Favorite DSA Topics</Label>
                    <Textarea
                      id="favoriteTopics"
                      value={profile.favoriteTopics}
                      onChange={(e) => handleChange('favoriteTopics', e.target.value)}
                      className="bg-background text-foreground border-border min-h-20"
                      placeholder="e.g., Dynamic Programming, Graph Algorithms, Trees..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="learningStyle" className="text-foreground">Learning Style</Label>
                    <Textarea
                      id="learningStyle"
                      value={profile.learningStyle}
                      onChange={(e) => handleChange('learningStyle', e.target.value)}
                      className="bg-background text-foreground border-border min-h-20"
                      placeholder="Describe how you learn best..."
                    />
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="goals" className="h-full m-0">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentGoal" className="text-foreground">Current Learning Goal</Label>
                    <Textarea
                      id="currentGoal"
                      value={profile.currentGoal}
                      onChange={(e) => handleChange('currentGoal', e.target.value)}
                      className="bg-background text-foreground border-border min-h-24"
                      placeholder="What are you working towards?"
                    />
                  </div>

                  <div className="p-6 rounded-lg bg-primary/10 border border-primary">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-6 h-6 text-primary" strokeWidth={2} />
                      <h3 className="text-lg font-semibold text-foreground">Your Progress</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Problems Solved</span>
                        <span className="text-lg font-bold text-primary">{profile.problemsSolved}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Experience Level</span>
                        <span className="text-sm font-semibold text-primary capitalize">{profile.experienceLevel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Preferred Language</span>
                        <span className="text-sm font-semibold text-primary">{profile.preferredLanguage}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-lg bg-secondary/10 border border-secondary">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Achievements</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                          <Award className="w-5 h-5 text-success" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Problem Solver</p>
                          <p className="text-xs text-muted-foreground">Solved 250+ problems</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Code2 className="w-5 h-5 text-primary" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Code Master</p>
                          <p className="text-xs text-muted-foreground">Mastered {profile.preferredLanguage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>

          <div className="flex justify-between gap-3 mt-6 pt-4 border-t border-border">
            <Button onClick={handleLogoutClick} variant="destructive" className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2">
              <LogOut className="w-4 h-4" strokeWidth={2} />
              Logout
            </Button>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="bg-transparent text-foreground hover:bg-muted hover:text-foreground">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Save Changes
              </Button>
            </div>
          </div>
        </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}