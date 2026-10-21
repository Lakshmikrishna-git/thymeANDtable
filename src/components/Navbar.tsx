import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Sparkles, 
  BookOpen, 
  Refrigerator, 
  CalendarDays, 
  ShieldCheck, 
  Code2, 
  UserCheck, 
  RotateCcw, 
  ChevronDown,
  PlusCircle,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { User } from '../types';
import { db } from '../db/storage';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onUserChange: (user: User) => void;
  onOpenWeightsModal: () => void;
  onOpenCreateRecipe: () => void;
  onResetDatabase: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onUserChange,
  onOpenWeightsModal,
  onOpenCreateRecipe,
  onResetDatabase
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const users = db.getUsers();

  const handleSelectUser = (user: User) => {
    db.setCurrentUserId(user.id);
    onUserChange(user);
    setShowUserDropdown(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'influencers', label: 'Influencers', icon: UserCheck, badge: 'Core' },
    { id: 'recipes', label: 'Recipes', icon: BookOpen },
    { id: 'pantry', label: 'My Pantry', icon: Refrigerator },
    { id: 'planner', label: 'Meal Planner', icon: CalendarDays },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, adminOnly: true },
    { id: 'java-hub', label: 'Java OOP Hub', icon: Code2, special: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD1] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3D6B50] to-[#2E523D] flex items-center justify-center text-white shadow-md shadow-[#3D6B50]/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6 text-[#FAF7F2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display text-2xl font-bold tracking-tight text-[#2D2A26]">
                  SmartKitchen
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E07A5F]/15 text-[#C25630] border border-[#E07A5F]/30">
                  Java OOP
                </span>
              </div>
              <p className="text-xs text-[#7A7469] font-medium hidden sm:block">
                Influencer Discovery & Pantry Planning System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              if (item.adminOnly && currentUser.role !== 'ADMIN') {
                return null;
              }
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#3D6B50] text-white shadow-sm shadow-[#3D6B50]/25'
                      : item.special
                      ? 'bg-[#E07A5F]/10 text-[#C25630] hover:bg-[#E07A5F]/20'
                      : 'text-[#5C564C] hover:text-[#2D2A26] hover:bg-[#F2ECE1]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.special ? 'text-[#C25630]' : 'text-[#7A7469]'}`} />
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#3D6B50]/15 text-[#3D6B50] rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.special && !isActive && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#E07A5F] text-white rounded-full">
                      OOP Code
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Quick action: Add Recipe */}
            <button
              onClick={onOpenCreateRecipe}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-[#F4EFE6] text-[#3D6B50] hover:bg-[#E8DFD1] border border-[#DDD3C2] transition-colors"
              title="Create a new recipe"
            >
              <PlusCircle className="w-4 h-4 text-[#3D6B50]" />
              <span>New Recipe</span>
            </button>

            {/* Weights config shortcut */}
            <button
              onClick={onOpenWeightsModal}
              className="p-2 rounded-xl bg-[#F4EFE6] hover:bg-[#E8DFD1] text-[#5C564C] border border-[#DDD3C2] transition-colors"
              title="Configure 3-Signal Recommendation Weights"
            >
              <Sliders className="w-4 h-4 text-[#5C564C]" />
            </button>

            {/* User Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 p-1.5 pr-3 rounded-2xl bg-[#F4EFE6] hover:bg-[#EAE2D3] border border-[#DDD3C2] transition-colors"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-[#2D2A26] flex items-center space-x-1">
                    <span className="truncate max-w-[100px]">{currentUser.name}</span>
                    {currentUser.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3D6B50]" />
                    )}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md ${
                    currentUser.role === 'INFLUENCER' 
                      ? 'bg-[#E07A5F]/20 text-[#C25630]' 
                      : currentUser.role === 'ADMIN' 
                      ? 'bg-[#3D6B50]/20 text-[#3D6B50]' 
                      : 'bg-stone-200 text-stone-700'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#7A7469]" />
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#E8DFD1] shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#F4EFE6]">
                    <p className="text-xs font-semibold text-[#7A7469] uppercase tracking-wider">
                      Switch Role (OOP Simulation)
                    </p>
                    <p className="text-[11px] text-[#A69E8F]">
                      Test role-based access control and user views
                    </p>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleSelectUser(u)}
                        className={`w-full px-4 py-2.5 flex items-center space-x-3 text-left hover:bg-[#FAF7F2] transition-colors ${
                          u.id === currentUser.id ? 'bg-[#3D6B50]/10' : ''
                        }`}
                      >
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-stone-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#2D2A26] truncate">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-[#7A7469] truncate">
                            {u.role === 'INFLUENCER' ? `${u.handle} • ${u.speciality?.split('&')[0]}` : u.email}
                          </p>
                        </div>
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                          u.role === 'INFLUENCER'
                            ? 'bg-[#E07A5F]/20 text-[#C25630]'
                            : u.role === 'ADMIN'
                            ? 'bg-[#3D6B50]/20 text-[#3D6B50]'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {u.role}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-[#F4EFE6] px-3 pt-2">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (confirm('Reset database to clean initial sample state? All sample recipes and pantry items will be restored.')) {
                          onResetDatabase();
                        }
                      }}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-xs font-medium text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Relational Database</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-[#E8DFD1]/60">
          {navItems.map((item) => {
            if (item.adminOnly && currentUser.role !== 'ADMIN') return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#3D6B50] text-white'
                    : item.special
                    ? 'bg-[#E07A5F]/15 text-[#C25630]'
                    : 'text-[#5C564C] bg-[#F4EFE6]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
