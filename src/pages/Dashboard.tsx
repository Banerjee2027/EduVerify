import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, BookOpen, Star, Plus, 
  Search, Filter, TrendingUp, 
  CheckCircle2, Clock, XCircle,
  BrainCircuit, Download, Share2,
  Zap, GraduationCap, Sparkles
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, 
  Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import { UserProfile, Achievement, Skill } from '../types';
import { analyzeAchievements } from '../services/aiService';
import { subscribeToAchievements, createAchievement } from '../services/firestoreService';
import AddAchievementModal from '../components/AddAchievementModal';

interface DashboardProps {
  user: UserProfile;
}

const MOCK_SKILLS: Skill[] = [
  { name: 'TypeScript', level: 90, category: 'Technical' },
  { name: 'Machine Learning', level: 65, category: 'Technical' },
  { name: 'Leadership', level: 80, category: 'Soft' },
  { name: 'Problem Solving', level: 85, category: 'Soft' },
  { name: 'React', level: 95, category: 'Technical' },
  { name: 'Communication', level: 75, category: 'Soft' },
];

export default function Dashboard({ user }: DashboardProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAchievements(user.uid, (data) => {
      setAchievements(data);
    });
    return () => unsubscribe();
  }, [user.uid]);

  const filteredAchievements = useMemo(() => {
    return achievements.filter(a => {
      const matchesTab = activeTab === 'all' || a.status === activeTab;
      const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           a.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [achievements, activeTab, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: achievements.length,
      verified: achievements.filter(a => a.status === 'verified').length,
      pending: achievements.filter(a => a.status === 'pending').length,
      skillsCount: MOCK_SKILLS.length
    };
  }, [achievements]);

  const handleAIAnalysis = async () => {
    if (achievements.length === 0) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeAchievements(achievements);
      setAiAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddAchievement = async (achievement: Omit<Achievement, 'id'>) => {
    try {
      await createAchievement(achievement);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {isModalOpen && (
        <AddAchievementModal 
          user={user} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddAchievement} 
        />
      )}
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">Welcome back, {user.name}</h1>
          <p className="text-slate-500 mt-1">
            {user.course} {user.course && 'at'} {user.institution} {user.country && `(${user.country})`}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="h-4 w-4" />
            Export Portfolio
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-sm font-medium text-white hover:bg-blue-700 transition-shadow shadow-md shadow-blue-500/20 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add Achievement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Award} label="Total Records" value={stats.total} color="blue" />
        <StatCard icon={CheckCircle2} label="Verified" value={stats.verified} color="green" />
        <StatCard icon={Clock} label="Pending" value={stats.pending} color="amber" />
        <StatCard icon={TrendingUp} label="Skills Map" value={stats.skillsCount} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BrainCircuit className="h-32 w-32 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="h-6 w-6" />
                <h3 className="font-bold text-xl">AI Career Optimizer</h3>
              </div>
              <p className="text-indigo-100 mb-6 max-w-lg">
                Unlock deeper insights from your verified achievements. Our AI will analyze your records to find your hidden strengths and recommend a personalized career roadmap.
              </p>
              {!aiAnalysis ? (
                <button 
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isAnalyzing ? <Clock className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 fill-current" />}
                  {isAnalyzing ? 'Analyzing Achievements...' : 'Generate AI Insights'}
                </button>
              ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-indigo-50">
                  <div className="markdown-body prose prose-invert max-w-none text-sm leading-relaxed text-indigo-50">
                    <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                  </div>
                  <button 
                    onClick={() => setAiAnalysis(null)}
                    className="mt-4 text-xs font-bold uppercase tracking-wider text-white border-b border-white/40 pb-0.5 hover:border-white transition-colors"
                  >
                    Refresh Analysis
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Achievement Feed */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                  <h3 className="text-lg font-bold text-slate-900">Your Achievements</h3>
                  <p className="text-sm text-slate-500">Manage and track your verified records.</p>
               </div>
               <div className="flex bg-slate-100 p-1 rounded-xl">
                  {(['all', 'verified', 'pending'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {tab}
                    </button>
                  ))}
               </div>
            </div>

            <div className="p-6">
               <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search achievements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
               </div>

               <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredAchievements.map((achievement) => (
                    <motion.div 
                      key={achievement.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="group p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-100 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                          achievement.category === 'Academic' ? 'bg-blue-50 text-blue-600' :
                          achievement.category === 'Skill' ? 'bg-purple-50 text-purple-600' :
                          achievement.category === 'Extracurricular' ? 'bg-green-50 text-green-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          <Award className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{achievement.title}</h4>
                                {achievement.isAiVerified && (
                                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    AI Verified
                                  </div>
                                )}
                               </div>
                              <StatusBadge status={achievement.status} />
                           </div>
                           <p className="text-sm text-slate-500 mt-1">{achievement.description}</p>
                           <div className="flex items-center gap-4 mt-4 text-xs font-medium text-slate-400">
                              <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {achievement.institution}</span>
                              <span className="flex items-center gap-1 last:ml-auto last:text-slate-500 last:font-bold"><Clock className="h-3 w-3" /> {achievement.date}</span>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredAchievements.length === 0 && (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <Search className="h-8 w-8" />
                    </div>
                    <p className="text-slate-500 font-medium">No achievements found matching your criteria.</p>
                  </div>
                )}
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar area */}
        <div className="space-y-8">
           {/* Skill Radar Chart */}
           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">Skill Map</h3>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_SKILLS}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 500 }} />
                      <Radar
                        name="Skill Level"
                        dataKey="level"
                        stroke="#2563EB"
                        strokeWidth={2}
                        fill="#3B82F6"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-3">
                 {MOCK_SKILLS.slice(0, 3).map((skill, i) => (
                   <div key={i} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-tight text-slate-600">
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${skill.level}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Institution Network */}
           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">Connected Institutions</h3>
              <div className="space-y-4">
                 {[
                   { name: 'State Univ. Tech', students: '24K+', active: true },
                   { name: 'Frontend Masters', students: '100K+', active: true },
                   { name: 'Google Cloud Acad.', students: '500K+', active: false }
                 ].map((inst, i) => (
                   <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white ${inst.active ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{inst.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{inst.students} Students</p>
                      </div>
                      {inst.active && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-3 border border-dashed border-slate-300 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all">
                Connect New Institution
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: 'blue' | 'green' | 'amber' | 'purple' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center sm:items-start gap-4">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Achievement['status'] }) {
  const styles = {
    verified: 'bg-green-50 text-green-700 ring-green-600/20',
    pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    rejected: 'bg-red-50 text-red-700 ring-red-600/20'
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold uppercase tracking-tight ring-1 ring-inset ${styles[status]}`}>
      {status}
    </span>
  );
}
