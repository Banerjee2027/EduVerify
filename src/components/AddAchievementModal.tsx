import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { verifyDocument } from '../services/aiService';
import { Achievement, UserProfile } from '../types';

interface AddAchievementModalProps {
  onClose: () => void;
  onAdd: (achievement: Omit<Achievement, 'id'>) => Promise<void>;
  user: UserProfile;
}

export default function AddAchievementModal({ onClose, onAdd, user }: AddAchievementModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic' as Achievement['category'],
    date: new Date().toISOString().split('T')[0],
    institution: user.institution || ''
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<{ matches: boolean; justification: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAiResult(null);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleVerify = async () => {
    if (!file || !formData.title) return;
    
    setIsVerifying(true);
    try {
      const base64 = await convertToBase64(file);
      const result = await verifyDocument(base64, file.type, formData.title);
      setAiResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onAdd({
        ...formData,
        userId: user.uid,
        status: 'pending',
        isAiVerified: aiResult?.matches || false,
        aiAnalysis: aiResult?.justification || ''
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">Claim Achievement</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Achievement Title</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Dean's List 2025"
                  value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                  value={formData.category}
                  onChange={e => setFormData(p => ({ ...p, category: e.target.value as any }))}
                >
                  <option value="Academic">Academic</option>
                  <option value="Skill">Skill</option>
                  <option value="Extracurricular">Extracurricular</option>
                  <option value="Work Experience">Work Experience</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Institution</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={formData.institution}
                  onChange={e => setFormData(p => ({ ...p, institution: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Short Description</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all h-24 resize-none"
                  placeholder="Describe your achievement..."
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Evidence (Certificate/Transcript)</label>
              <div className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors ${file ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 hover:border-blue-300'}`}>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <div className="text-center">
                    <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{file.name}</p>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setFile(null); setAiResult(null); }}
                      className="text-xs text-red-500 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-900">Click or drag to upload</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG or PDF up to 5MB</p>
                  </div>
                )}
              </div>

              {file && !aiResult && (
                <button
                  type="button"
                  disabled={isVerifying || !formData.title}
                  onClick={handleVerify}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isVerifying ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                  Verify with AI
                </button>
              )}

              <AnimatePresence>
                {aiResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl flex gap-3 ${aiResult.matches ? 'bg-green-50 border border-green-100 text-green-800' : 'bg-amber-50 border border-amber-100 text-amber-800'}`}
                  >
                    {aiResult.matches ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                    <div>
                      <p className="text-sm font-bold">{aiResult.matches ? 'AI Verification Success' : 'AI Verification Warning'}</p>
                      <p className="text-xs mt-1 leading-relaxed">{aiResult.justification}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Claim Achievement'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
