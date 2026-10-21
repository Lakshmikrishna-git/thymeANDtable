import React, { useState } from 'react';
import { 
  Code2, 
  Download, 
  Copy, 
  Check, 
  HelpCircle, 
  Layers, 
  Database, 
  Cpu, 
  FileCode, 
  Sparkles,
  Terminal,
  ExternalLink
} from 'lucide-react';
import JSZip from 'jszip';
import { JAVA_FILES, VIVA_QUESTIONS, JavaSourceFile } from '../data/javaCodeRepository';

export const JavaProjectHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'code' | 'viva' | 'run'>('architecture');
  const [selectedFile, setSelectedFile] = useState<JavaSourceFile>(JAVA_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add each file to its respective relative path in the zip
      for (const file of JAVA_FILES) {
        zip.file(file.path, file.content);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'smart-recipe-pantry-system-java.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate ZIP', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#2D2A26] via-[#1E1C1A] to-[#121110] text-white p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#E07A5F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-72 h-72 bg-[#3D6B50]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-[#E07A5F]/20 text-orange-300 border border-[#E07A5F]/30">
              <Code2 className="w-3.5 h-3.5" />
              <span>College Project Evaluation & Viva Hub</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Java OOP Architecture & Source Code Hub
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Complete Object-Oriented design implementing Inheritance, Polymorphism, Encapsulation, DAO and Strategy design patterns, JDBC PreparedStatement security, and a 3-signal deterministic algorithm.
            </p>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E07A5F] to-[#C25630] hover:from-[#d66f53] hover:to-[#b34b28] text-white font-bold text-xs shadow-lg shadow-[#E07A5F]/30 transition-all shrink-0 hover:scale-105 active:scale-95"
          >
            {isZipping ? (
              <span>Packaging ZIP...</span>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Maven Java Project (.zip)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-[#E8DFD1] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'architecture' ? 'bg-[#3D6B50] text-white shadow-xs' : 'bg-white text-[#5C564C] hover:bg-[#F4EFE6]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. OOP Architecture & Patterns</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'code' ? 'bg-[#3D6B50] text-white shadow-xs' : 'bg-white text-[#5C564C] hover:bg-[#F4EFE6]'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>2. Java Source Code Explorer ({JAVA_FILES.length} Files)</span>
        </button>

        <button
          onClick={() => setActiveTab('viva')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'viva' ? 'bg-[#3D6B50] text-white shadow-xs' : 'bg-white text-[#5C564C] hover:bg-[#F4EFE6]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>3. Viva Voce Q&A Preparation</span>
        </button>

        <button
          onClick={() => setActiveTab('run')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'run' ? 'bg-[#3D6B50] text-white shadow-xs' : 'bg-white text-[#5C564C] hover:bg-[#F4EFE6]'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>4. Run in IDE & Terminal</span>
        </button>
      </div>

      {/* Tab 1: OOP Architecture */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Inheritance Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD1] shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-[#3D6B50]">
                <Layers className="w-5 h-5" />
                <h3 className="font-display text-lg font-bold text-[#2D2A26]">1. Inheritance Hierarchy</h3>
              </div>
              <p className="text-xs text-[#5C564C] leading-relaxed">
                Base abstract class <code className="text-[#C25630] font-mono font-bold">User</code> defines foundational state and abstract role contracts. Subclasses specialize domain roles:
              </p>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] text-xs font-mono text-[#2D2A26] space-y-2">
                <div className="text-stone-500">// Abstract Base</div>
                <div className="font-bold text-[#3D6B50]">public abstract class User &#123; ... &#125;</div>
                <div className="pl-4">├── <strong>RegularUser</strong> extends User (Home cook, student)</div>
                <div className="pl-4">├── <strong>Influencer</strong> extends User (Bio, speciality, verified)</div>
                <div className="pl-4">└── <strong>Admin</strong> extends User (Content moderation, audits)</div>
              </div>
            </div>

            {/* Polymorphism Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD1] shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-[#E07A5F]">
                <Cpu className="w-5 h-5" />
                <h3 className="font-display text-lg font-bold text-[#2D2A26]">2. Polymorphic Method Dispatch</h3>
              </div>
              <p className="text-xs text-[#5C564C] leading-relaxed">
                Methods like <code className="font-mono font-bold">canPublishInfluencerRecipes()</code> and <code className="font-mono font-bold">getRole()</code> execute subclass-specific logic dynamically at runtime without explicit <code className="font-mono">instanceof</code> checks.
              </p>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] text-xs font-mono text-[#2D2A26] space-y-1">
                <div>User current = authService.getCurrentUser();</div>
                <div className="text-[#3D6B50]">if (current.canPublishInfluencerRecipes()) &#123;</div>
                <div className="pl-4 text-stone-500">// Dynamically true for Influencer &amp; Admin</div>
                <div className="pl-4">recipeService.publishWithChefBadge(recipe);</div>
                <div>&#125;</div>
              </div>
            </div>

            {/* Strategy Pattern */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD1] shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-purple-700">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-display text-lg font-bold text-[#2D2A26]">3. Strategy Pattern (Recommendation)</h3>
              </div>
              <p className="text-xs text-[#5C564C] leading-relaxed">
                The deterministic 3-signal scoring formula delegates weighting logic to <code className="font-mono font-bold">RecommendationService</code> with normalized scale factors:
              </p>
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] text-xs font-mono text-[#2D2A26]">
                Score = (0.50 × PantryMatch) + (0.20 × UserRating) + (0.30 × InfluencerScore)
              </div>
            </div>

            {/* DAO & PreparedStatements */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD1] shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-blue-700">
                <Database className="w-5 h-5" />
                <h3 className="font-display text-lg font-bold text-[#2D2A26]">4. DAO Pattern &amp; SQL Injection Safety</h3>
              </div>
              <p className="text-xs text-[#5C564C] leading-relaxed">
                Relational queries run via JDBC <code className="font-mono font-bold">PreparedStatement</code>, treating user inputs strictly as typed parameters rather than concatenated SQL strings.
              </p>
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] text-xs font-mono text-[#2D2A26]">
                PreparedStatement stmt = conn.prepareStatement("SELECT * FROM recipes WHERE author_id = ?");
                stmt.setString(1, authorId);
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Java Source Code Explorer */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* File List */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-[#E8DFD1] p-3 shadow-xs space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A7469] px-3 py-2">
              Java Files
            </p>
            {JAVA_FILES.map((file) => (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                  selectedFile.name === file.name
                    ? 'bg-[#3D6B50] text-white font-bold shadow-xs'
                    : 'text-[#5C564C] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <FileCode className="w-4 h-4 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
                <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded-md ${
                  selectedFile.name === file.name ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  {file.category}
                </span>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="lg:col-span-3 bg-[#1E1C1A] text-stone-200 rounded-3xl border border-stone-800 shadow-xl overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 bg-[#141312] border-b border-stone-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {selectedFile.path}
                </span>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {selectedFile.description}
                </p>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-5 font-mono text-xs overflow-x-auto leading-relaxed text-stone-200 max-h-[580px]">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Viva Voce Q&A Preparation */}
      {activeTab === 'viva' && (
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E8DFD1] shadow-xs">
            <h3 className="font-display text-lg font-bold text-[#2D2A26] mb-1">
              Oral Defense / Viva Voce Questions &amp; Answers
            </h3>
            <p className="text-xs text-[#7A7469]">
              Prepared technical answers addressing software engineering, object-oriented concepts, and relational database constraints.
            </p>
          </div>

          <div className="space-y-3">
            {VIVA_QUESTIONS.map((qa, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-[#E8DFD1] p-5 shadow-xs space-y-2.5"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-[#E07A5F]/20 text-[#C25630] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    Q{idx + 1}
                  </span>
                  <h4 className="font-bold text-sm text-[#2D2A26] leading-snug">
                    {qa.question}
                  </h4>
                </div>

                <div className="pl-9 text-xs text-[#5C564C] leading-relaxed bg-[#FAF7F2] p-4 rounded-2xl border border-[#F4EFE6]">
                  <strong className="text-[#2D2A26] block mb-1">Model Answer:</strong>
                  {qa.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: How to Run in IDE / CLI */}
      {activeTab === 'run' && (
        <div className="bg-white rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="font-display text-xl font-bold text-[#2D2A26]">
              Running the Java Application Locally
            </h3>
            <p className="text-xs text-[#7A7469] mt-1">
              Instructions for IntelliJ IDEA, Eclipse, VS Code, or Maven command line.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] space-y-2">
              <h4 className="font-bold text-xs text-[#2D2A26]">Step 1: Download &amp; Extract</h4>
              <p className="text-xs text-[#5C564C]">
                Click the <strong>Download Maven Java Project (.zip)</strong> button above. Extract the archive into your preferred folder.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] space-y-2">
              <h4 className="font-bold text-xs text-[#2D2A26]">Step 2: Command Line (Maven)</h4>
              <pre className="p-3 bg-stone-900 text-stone-100 rounded-xl font-mono text-xs overflow-x-auto">
{`# 1. Compile all Java sources
mvn clean compile

# 2. Execute Main class
mvn exec:java -Dexec.mainClass="com.kitchen.Main"

# 3. Run JUnit tests
mvn test`}
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] space-y-2">
              <h4 className="font-bold text-xs text-[#2D2A26]">Step 3: IntelliJ IDEA / Eclipse</h4>
              <p className="text-xs text-[#5C564C] leading-relaxed">
                Open IntelliJ IDEA &rarr; File &rarr; Open &rarr; select the extracted folder (containing <code className="font-mono">pom.xml</code>). IntelliJ will automatically detect Maven dependencies (SQLite JDBC, JUnit 5). Navigate to <code className="font-mono">src/main/java/com/kitchen/Main.java</code> and click the green Run arrow!
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
