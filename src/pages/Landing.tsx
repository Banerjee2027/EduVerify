import { motion } from 'motion/react';
import { Shield, CheckCircle, Brain, GraduationCap, ArrowRight, Zap, Target, Award, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white px-6 pb-24 pt-20 sm:pb-32 sm:pt-40 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.50),white)]" />
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-6">
                <Zap className="h-4 w-4" />
                <span>AI-Powered Achievement Verification</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl leading-[1.1]">
                Your Verified <span className="text-blue-600">Educational</span> Legacy.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 max-w-xl">
                A unified, intelligent platform for students to manage, verify, and showcase their academic and extracurricular milestones 
                to institutions and employers worldwide.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  to="/dashboard"
                  className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:shadow-xl hover:shadow-blue-200"
                >
                  Get Started Free
                </Link>
                <a href="#features" className="text-sm font-semibold leading-6 text-slate-900 group flex items-center gap-2">
                  Learn more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-50 aspect-[4/3] relative">
                 <img 
                   src="https://picsum.photos/seed/eduverify_hero/1200/900" 
                   alt="Platform Preview" 
                   className="w-full h-full object-cover rounded-3xl"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-white/30 rounded-2xl pointer-events-none" />
                 
                 {/* Floating Badges */}
                 <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute top-10 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3"
                 >
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">Verified Achievement</p>
                      <p className="text-sm text-slate-600 font-medium whitespace-nowrap">Distinction in Computer Science</p>
                    </div>
                 </motion.div>

                 <motion.div 
                   animate={{ y: [0, 10, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute bottom-10 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3"
                 >
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">AI Skill Mapping</p>
                      <p className="text-sm text-slate-600 font-medium">96% Mastery in Data Structures</p>
                    </div>
                 </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-12 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Verified Records', value: '500K+' },
                { label: 'Institutions', value: '1.2K' },
                { label: 'Active Students', value: '2M+' },
                { label: 'Verification Time', value: '< 24h' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-widest">Everything you need</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              One platform, endless possibilities.
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Stop fragmentation. Start managing your academic journey with a unified, 
              cryptographically verifiable system that works as hard as you do.
            </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
              {[
                {
                  id: 'unified',
                  icon: LayoutDashboard,
                  title: 'Unified Dashboard',
                  desc: 'All your academic, extracurricular, and skill milestones in one beautiful, scannable place.'
                },
                {
                  id: 'verified',
                  icon: Shield,
                  title: 'Instant Verification',
                  desc: 'Blockchain-backed verification makes your credentials tamper-proof and instantly validatable.'
                },
                {
                  id: 'intelligent',
                  icon: Brain,
                  title: 'Intelligent Mapping',
                  desc: 'Our AI analyzes your achievements to map latent skills and suggest career paths you will excel in.'
                }
              ].map((feature) => (
                <motion.div key={feature.id} variants={itemVariants} className="flex flex-col">
                  <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-24 px-6 sm:py-32 lg:px-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-blue-700 rounded-full blur-3xl opacity-50" />
        
        <div className="mx-auto max-w-2xl text-center relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start building your verified portfolio today.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
            Join thousands of students across the globe who are taking control of their higher education records.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/dashboard"
              className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-sm hover:bg-blue-50 transition-colors"
            >
              Create Your Account
            </Link>
            <a href="#" className="text-sm font-semibold leading-6 text-white flex items-center gap-2 group">
              Contact Sales <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-6 border-t border-slate-100">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">EduVerify</span>
          </div>
          <p className="text-sm text-slate-500">&copy; 2026 EduVerify Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900">Privacy</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900">Terms</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
