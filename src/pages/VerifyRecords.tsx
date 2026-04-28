import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, CheckCircle, XCircle, Clock, FileText, User, ExternalLink, Filter, Search } from 'lucide-react';
import { Achievement } from '../types';
import { getPendingVerifications, verifyAchievement } from '../services/firestoreService';
import { auth } from '../lib/firebase';

export default function VerifyRecords() {
  const [requests, setRequests] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    const data = await getPendingVerifications();
    setRequests(data);
    setLoading(false);
  };

  const handleVerify = async (id: string, status: 'verified' | 'rejected') => {
    if (!auth.currentUser) return;
    try {
      await verifyAchievement(id, status, auth.currentUser.uid);
      setRequests(prev => prev.filter(r => r.id !== id));
      setSelectedId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const selectedRequest = requests.find(r => r.id === selectedId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 leading-tight">Verification Queue</h1>
        <p className="text-slate-500 mt-1">Review and validate achievement claims submitted by students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Queue List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">{requests.length} Pending Requests</span>
            <button className="p-2 text-slate-400 hover:text-slate-600">
               <Filter className="h-4 w-4" />
            </button>
          </div>
          
          {requests.map((request) => (
            <motion.div 
              key={request.id}
              layout
              onClick={() => setSelectedId(request.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedId === request.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 truncate">{request.title}</p>
                  <p className="text-xs text-slate-500 font-medium truncate">{request.institution}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-200 text-slate-600 rounded">
                  {request.category}
                </span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {request.date}
                </span>
              </div>
            </motion.div>
          ))}

          {requests.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <CheckCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No pending requests!</p>
            </div>
          )}
        </div>

        {/* Details View */}
        <div className="lg:col-span-2">
           <AnimatePresence mode="wait">
             {selectedRequest ? (
               <motion.div 
                 key={selectedRequest.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8"
               >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                       <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ring-1 ring-amber-600/10">
                         <Clock className="h-3 w-3" /> Pending Review
                       </span>
                       <h2 className="text-2xl font-bold text-slate-900">{selectedRequest.title}</h2>
                       <p className="text-slate-500 mt-1 font-medium">{selectedRequest.institution}</p>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => handleVerify(selectedRequest.id, 'rejected')}
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                       >
                         <XCircle className="h-6 w-6" />
                       </button>
                       <button 
                        onClick={() => handleVerify(selectedRequest.id, 'verified')}
                        className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                       >
                         <CheckCircle className="h-6 w-6" />
                       </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                     <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Description</h3>
                        <p className="text-slate-700 leading-relaxed">{selectedRequest.description}</p>
                     </div>
                     <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Submission Details</h3>
                        <div className="space-y-4">
                           <div className="flex justify-between pb-2 border-b border-slate-50">
                              <span className="text-sm text-slate-500">Student ID</span>
                              <span className="text-sm font-bold text-slate-900">{selectedRequest.userId}</span>
                           </div>
                           <div className="flex justify-between pb-2 border-b border-slate-50">
                              <span className="text-sm text-slate-500">Date Achieved</span>
                              <span className="text-sm font-bold text-slate-900">{selectedRequest.date}</span>
                           </div>
                           <div className="flex justify-between pb-2 border-b border-slate-50">
                              <span className="text-sm text-slate-500">Category</span>
                              <span className="text-sm font-bold text-slate-900">{selectedRequest.category}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Evidence & Documentation</h3>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <a 
                          href={selectedRequest.evidenceUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex-1"
                        >
                           <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                             <FileText className="h-5 w-5" />
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <p className="text-sm font-bold text-slate-900 truncate tracking-tight">achievement_evidence.pdf</p>
                              <p className="text-xs text-slate-500">Document • 1.2 MB</p>
                           </div>
                           <ExternalLink className="h-4 w-4 text-slate-400" />
                        </a>
                        <div className="flex flex-col justify-center text-center px-4 bg-white/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                           Verified by AI <br /> 48% Confidence Score
                        </div>
                     </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button 
                      onClick={() => handleVerify(selectedRequest.id, 'verified')}
                      className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                    >
                      Authenticate Achievement
                    </button>
                    <button 
                      onClick={() => handleVerify(selectedRequest.id, 'rejected')}
                      className="px-8 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
               </motion.div>
             ) : (
               <div className="h-full min-h-[500px] bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                  <Shield className="h-20 w-20 mb-6 opacity-20" />
                  <h3 className="text-xl font-bold text-slate-400 mb-2">Select a request to verify</h3>
                  <p className="max-w-xs text-sm font-medium">Choose a record from the queue to review the documentation and provide authentication.</p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
