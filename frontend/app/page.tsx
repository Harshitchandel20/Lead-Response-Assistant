import ChatBox from './components/ChatBox';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-12 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-5%] left-[-10%] w-[400px] h-[400px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="z-10 w-full flex flex-col items-center">
        <ChatBox />
        
        <div className="mt-8 flex flex-col items-center text-center space-y-2">
          <p className="text-slate-500 text-xs font-medium tracking-wide">
            Powered by <span className="text-indigo-600 font-bold">Cerebras</span> & <span className="text-slate-800 font-bold">Next.js</span>
          </p>
        </div>
      </div>
    </main>
  );
}
