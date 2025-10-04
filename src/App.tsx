import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, Label, PolarAngleAxis, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

// --- Type Definitions for our data ---
type Topic = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  darkColor: string;
};

type ProgressItem = {
  subject: string;
  percentage: number;
  color: string;
};

// --- SVG Icon Components ---
// Using inline SVGs for icons to keep it all in one file.

const MathIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="8" x2="12" y2="16"></line>
  </svg>
);

const AnimalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 0 0-9.8 11.3c.3 2.4 1.8 4.6 3.8 6.1 2 1.5 4.5 2.6 7 2.6s5-1.1 7-2.6c2-1.5 3.5-3.7 3.8-6.1A10 10 0 0 0 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zM9 12l2 2 4-4"></path><path d="M14.5 10.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zM9.5 10.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z"></path><path d="M12 14c-1.657 0-3 1.343-3 3h6c0-1.657-1.343-3-3-3z"></path>
  </svg>
);

const SpaceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l.34 2.305a1 1 0 00.93.73l2.42.14a1 1 0 01.99 1.45l-1.76 2.03a1 1 0 00-.3.94l.43 2.5a1 1 0 01-1.45.99l-2.22-1.11a1 1 0 00-1.03 0l-2.22 1.11a1 1 0 01-1.45-.99l.43-2.5a1 1 0 00-.3-.94L3.7 7.31a1 1 0 01.99-1.45l2.42-.14a1 1 0 00.93-.73L12 2.69z"></path><path d="M4.22 10.22l-1.92 1.92M18.8 12.14l1.92-1.92M12 17.8v4.3M12 2.69v-2.3"></path>
  </svg>
);

const StoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline>
    </svg>
);

const TrophyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-8 w-8 text-amber-400 ${className}`}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
);


// --- Mock Data ---
const featuredTopicsData: Topic[] = [
  { title: "Fun with Math", description: "Count, add, and solve cool puzzles!", icon: <MathIcon />, color: "bg-sky-100 text-sky-600", darkColor: "dark:bg-sky-900/50 dark:text-sky-400" },
  { title: "Animal Kingdom", description: "Discover amazing animals and their homes.", icon: <AnimalIcon />, color: "bg-amber-100 text-amber-600", darkColor: "dark:bg-amber-900/50 dark:text-amber-400" },
  { title: "Space Adventure", description: "Travel to planets, stars, and galaxies.", icon: <SpaceIcon />, color: "bg-indigo-100 text-indigo-600", darkColor: "dark:bg-indigo-900/50 dark:text-indigo-400" },
  { title: "Creative Stories", description: "Build your own worlds and characters.", icon: <StoryIcon />, color: "bg-rose-100 text-rose-600", darkColor: "dark:bg-rose-900/50 dark:text-rose-400" },
];

const progressData: ProgressItem[] = [
    { subject: 'Math Puzzles', percentage: 75, color: 'bg-green-500' },
    { subject: 'Reading Challenge', percentage: 60, color: 'bg-blue-500' },
    { subject: 'Science Facts', percentage: 40, color: 'bg-yellow-500' },
];

// --- Reusable Components ---
interface TopicCardProps { topic: Topic; onClick: () => void; }
const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => (
    <div onClick={onClick} className="cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl dark:hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
        <div className={`w-16 h-16 ${topic.color} ${topic.darkColor} rounded-full flex items-center justify-center mb-4`}>
            {topic.icon}
        </div>
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-1">{topic.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{topic.description}</p>
    </div>
);

interface ProgressBarProps { item: ProgressItem; }
const ProgressBar: React.FC<ProgressBarProps> = ({ item }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.subject}</span>
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{item.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div 
                className={`${item.color} h-4 rounded-full transition-all duration-1000 ease-out`} 
                style={{ width: `${item.percentage}%` }}
            ></div>
        </div>
    </div>
);

// --- Simplified shadcn/ui Component Mocks ---
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg ${className}`}>{children}</div>;
const CardHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children }: { children: React.ReactNode }) => <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{children}</h3>;
const CardDescription = ({ children }: { children: React.ReactNode }) => <p className="text-sm text-gray-500 dark:text-gray-400">{children}</p>;
const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardFooter = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`p-6 pt-0 text-sm ${className}`}>{children}</div>;
const ChartContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
// A simple style injector for chart colors
const ChartStyle = ({ config }: { config: any }) => {
    const colors = Object.keys(config).map(key => `--color-${key}: ${config[key].color};`).join('\n');
    return <style>{`:root { ${colors} }`}</style>;
};

// --- Main Layout Components ---
const Header = () => {
    const [activeLink, setActiveLink] = useState('Home');
    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        L
                    </div>
                    <span className="font-bold text-xl text-gray-800 dark:text-gray-200">Learnify</span>
                </div>
                <nav className="hidden md:flex items-center space-x-8">
                    {['Home', 'Topics', 'Quizzes'].map(link => (
                        <a key={link} href="#" onClick={() => setActiveLink(link)} className={`text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors ${activeLink === link ? 'font-bold text-blue-500 dark:text-blue-400' : ''}`}>
                            {link}
                        </a>
                    ))}
                </nav>
                <div className="flex items-center space-x-4">
                    <img src="https://placehold.co/40x40/E2E8F0/4A5568?text=AV" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600" />
                </div>
            </div>
        </header>
    );
};

// --- NEW Radial Chart Component ---
const weeklyGoal = 300; // 300 minutes for the week
const currentProgress = 240; // 240 minutes completed
const finalPercentage = Math.round((currentProgress / weeklyGoal) * 100);

const chartData = [{ name: "progress", value: currentProgress, fill: "url(#goalGradient)" }];

const WeeklyGoalChart = () => {
    const [animatedPercentage, setAnimatedPercentage] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 1500; // Animation duration in ms
        const stepTime = 1000 / 60; // 60 fps
        const steps = duration / stepTime;
        const increment = finalPercentage / steps;

        const animate = () => {
            start += increment;
            if (start < finalPercentage) {
                setAnimatedPercentage(Math.ceil(start));
                requestAnimationFrame(animate);
            } else {
                setAnimatedPercentage(finalPercentage);
            }
        };
        requestAnimationFrame(animate);
    }, []);
    
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <div className="flex items-center gap-2">
                    <CardTitle>Weekly Goal Progress</CardTitle>
                    {finalPercentage > 80 && <TrophyIcon className="animate-trophy-pop" />}
                </div>
                <CardDescription>You're doing great, keep it up!</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer className="mx-auto aspect-square max-h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            data={chartData}
                            startAngle={90}
                            endAngle={-270}
                            innerRadius="80%"
                            outerRadius="100%"
                            barSize={20}
                        >
                            <defs>
                                <linearGradient id="goalGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22c55e" />
                                    <stop offset="100%" stopColor="#86efac" />
                                </linearGradient>
                            </defs>
                            <PolarAngleAxis type="number" domain={[0, weeklyGoal]} tick={false} angleAxisId={0} />
                            <RadialBar 
                                dataKey="value" 
                                angleAxisId={0}
                                background={{ fill: 'rgba(128,128,128,0.1)' }} 
                                cornerRadius={10} 
                                isAnimationActive={true} 
                                animationDuration={1500} 
                                animationEasing="ease-in-out" 
                                className="pulse-animation-green"
                            />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-gray-800 dark:fill-gray-200 text-6xl font-bold">
                                                        {animatedPercentage}%
                                                    </tspan>
                                                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 30} className="fill-gray-500 dark:fill-gray-400 font-medium text-lg">
                                                        Way to Go!
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium text-gray-600 dark:text-gray-400">
                    Trending up by 15% this week <TrendingUpIcon />
                </div>
                <div className="text-gray-500 dark:text-gray-500">
                    You've studied {currentProgress} out of {weeklyGoal} minutes.
                </div>
            </CardFooter>
        </Card>
    );
};

// --- NEW Gemini-Powered Modal ---
interface TopicModalProps {
    topic: Topic | null;
    onClose: () => void;
    generatedContent: string;
    isLoading: boolean;
    onGenerate: (topic: Topic) => void;
}

const TopicModal: React.FC<TopicModalProps> = ({ topic, onClose, generatedContent, isLoading, onGenerate }) => {
    if (!topic) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full m-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 ${topic.color} ${topic.darkColor} rounded-full flex items-center justify-center`}>
                        {topic.icon}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{topic.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{topic.description}</p>
                    </div>
                </div>

                <div className="my-6 text-center">
                    <button 
                        onClick={() => onGenerate(topic)} 
                        disabled={isLoading}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        ✨ {isLoading ? 'Thinking...' : 'Get a Fun Fact!'}
                    </button>
                </div>
                
                {generatedContent && (
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300">{generatedContent}</p>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main App Component ---
export default function App(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync with system preference on initial load and listen for changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };

    // Set initial theme
    document.documentElement.classList.toggle('dark', mediaQuery.matches);
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Gemini API call function
  const handleGenerateContent = async (topic: Topic) => {
    setIsLoading(true);
    setGeneratedContent('');

    const systemPrompt = "You are a friendly and enthusiastic educator for children aged 6-10. Your goal is to provide a single, amazing, and easy-to-understand fun fact.";
    const userQuery = `Tell me a fun fact about ${topic.title}.`;
    const apiKey = ""; // API key is handled by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
            setGeneratedContent(text);
        } else {
            setGeneratedContent("I couldn't think of a fact right now. Maybe try again!");
        }
    } catch (error) {
        console.error("Gemini API call failed:", error);
        setGeneratedContent("Oops! Something went wrong. Please check your connection and try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const openTopicModal = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsModalOpen(true);
    setGeneratedContent(''); // Clear previous fact
  };

  const closeTopicModal = () => {
    setIsModalOpen(false);
    setSelectedTopic(null);
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-slate-900 font-sans transition-colors duration-300">
        <style>{`
            @keyframes trophy-pop {
                0% { transform: scale(0) rotate(-30deg); opacity: 0; }
                60% { transform: scale(1.1) rotate(10deg); opacity: 1; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
            .animate-trophy-pop {
                animation: trophy-pop 0.6s ease-out forwards;
            }
            @keyframes pulse-glow-green {
                0%, 100% { filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.4)); }
                50% { filter: drop-shadow(0 0 12px rgba(34, 197, 94, 0.8)); }
            }
            .pulse-animation-green {
                animation: pulse-glow-green 2.5s infinite ease-in-out;
            }
        `}</style>
      <Header />
      <main className="container mx-auto px-6 py-8">
        
        {/* Welcome Section */}
        <section className="mb-12">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">Welcome Back, Alex!</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Ready for a new adventure in learning?</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Topics and Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Topics Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Featured Topics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {featuredTopicsData.map(topic => <TopicCard key={topic.title} topic={topic} onClick={() => openTopicModal(topic)} />)}
              </div>
            </section>
            
            {/* Analytics Section */}
            <section>
                <WeeklyGoalChart />
            </section>
          </div>

          {/* Right Column: Progress */}
          <div className="lg:col-span-1">
            <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg h-full">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Your Progress</h2>
              <div className="space-y-6">
                {progressData.map(item => <ProgressBar key={item.subject} item={item} />)}
              </div>
            </section>
          </div>
        </div>
      </main>

      {isModalOpen && (
          <TopicModal 
              topic={selectedTopic}
              onClose={closeTopicModal}
              generatedContent={generatedContent}
              isLoading={isLoading}
              onGenerate={handleGenerateContent}
          />
      )}
    </div>
  );
}

