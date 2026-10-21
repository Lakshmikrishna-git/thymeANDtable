import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  AlertOctagon,
  RotateCcw
} from 'lucide-react';
import { User, Recipe, Review, UserRole } from '../types';
import { db } from '../db/storage';

interface AdminPanelProps {
  currentUser: User;
  onRefreshData: () => void;
  onResetDatabase: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  onRefreshData,
  onResetDatabase
}) => {
  const users = db.getUsers();
  const recipes = db.getRecipes();
  const reviews = db.getReviews();

  const [activeTab, setActiveTab] = useState<'users' | 'recipes' | 'reviews'>('users');

  if (currentUser.role !== 'ADMIN') {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-red-200">
        <AlertOctagon className="w-12 h-12 text-red-600 mx-auto mb-3" />
        <h3 className="font-display text-xl font-bold text-red-900">Access Restricted</h3>
        <p className="text-xs text-[#7A7469] mt-1 max-w-sm mx-auto">
          Role-Based Access Control (RBAC): Only accounts with the ADMIN role can access moderation tools.
        </p>
      </div>
    );
  }

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    db.updateUserRole(userId, newRole);
    onRefreshData();
  };

  const handleToggleVerify = (userId: string, current: boolean) => {
    db.updateUserRole(userId, 'INFLUENCER', !current);
    onRefreshData();
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Delete this user? All their pantry items and meal plans will be removed.')) {
      db.deleteUser(userId);
      onRefreshData();
    }
  };

  const handleDeleteRecipe = (recipeId: string) => {
    if (confirm('Delete this recipe? All associated reviews will also be deleted.')) {
      db.deleteRecipe(recipeId);
      onRefreshData();
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Delete this review?')) {
      db.deleteReview(reviewId);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#3D6B50] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2A26]">
            System Administration & Moderation
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7469] mt-1">
            Enforce safety policies, verify culinary influencers, moderate community recipes, and audit reviews.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset entire relational database to original seed state?')) {
              onResetDatabase();
            }
          }}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-white border border-[#E8DFD1] text-xs font-bold text-red-600 hover:bg-red-50 transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Database</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-[#E8DFD1] shadow-xs">
          <p className="text-xs font-medium text-[#7A7469]">Registered Accounts</p>
          <p className="text-2xl font-display font-bold text-[#2D2A26] mt-1">{users.length}</p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-[#E8DFD1] shadow-xs">
          <p className="text-xs font-medium text-[#7A7469]">Active Influencers</p>
          <p className="text-2xl font-display font-bold text-[#E07A5F] mt-1">
            {users.filter(u => u.role === 'INFLUENCER').length}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-[#E8DFD1] shadow-xs">
          <p className="text-xs font-medium text-[#7A7469]">Recipes in Catalog</p>
          <p className="text-2xl font-display font-bold text-[#3D6B50] mt-1">{recipes.length}</p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-[#E8DFD1] shadow-xs">
          <p className="text-xs font-medium text-[#7A7469]">Ratings & Reviews</p>
          <p className="text-2xl font-display font-bold text-amber-700 mt-1">{reviews.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#E8DFD1] pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
            activeTab === 'users' ? 'bg-[#3D6B50] text-white' : 'bg-white text-[#5C564C] hover:bg-[#F4EFE6]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Influencers ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recipes')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
            activeTab === 'recipes' ? 'bg-[#3D6B50] text-white' : 'bg-white text-[#5C564C] hover:bg-[#F4EFE6]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Recipe Moderation ({recipes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
            activeTab === 'reviews' ? 'bg-[#3D6B50] text-white' : 'bg-white text-[#5C564C] hover:bg-[#F4EFE6]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Review Audit ({reviews.length})</span>
        </button>
      </div>

      {/* Tab 1: Users & Influencers Table */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-[#E8DFD1] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#F4EFE6] flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-[#2D2A26]">User Account Management</h3>
            <span className="text-xs text-[#7A7469]">Grant Influencer status or promote Admins</span>
          </div>
          <div className="divide-y divide-[#F4EFE6]">
            {users.map((u) => (
              <div key={u.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    className="w-10 h-10 rounded-2xl object-cover border border-stone-200"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-[#2D2A26]">{u.name}</span>
                      {u.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-[#3D6B50]" />
                      )}
                    </div>
                    <p className="text-xs text-[#7A7469]">
                      {u.email} {u.handle && `• ${u.handle}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                    className="py-1.5 px-3 rounded-xl bg-[#FAF7F2] border border-[#DDD3C2] text-xs font-bold text-[#2D2A26]"
                  >
                    <option value="USER">USER</option>
                    <option value="INFLUENCER">INFLUENCER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>

                  {u.role === 'INFLUENCER' && (
                    <button
                      onClick={() => handleToggleVerify(u.id, !!u.isVerified)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        u.isVerified
                          ? 'bg-[#3D6B50]/15 text-[#3D6B50]'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {u.isVerified ? 'Verified Chef' : 'Verify'}
                    </button>
                  )}

                  {u.id !== currentUser.id && (
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                      title="Delete account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Recipes Moderation */}
      {activeTab === 'recipes' && (
        <div className="bg-white rounded-3xl border border-[#E8DFD1] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#F4EFE6]">
            <h3 className="font-display text-base font-bold text-[#2D2A26]">Published Recipes Directory</h3>
          </div>
          <div className="divide-y divide-[#F4EFE6]">
            {recipes.map((r) => (
              <div key={r.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={r.imageUrl}
                    alt={r.title}
                    className="w-12 h-12 rounded-2xl object-cover border border-stone-200"
                  />
                  <div>
                    <span className="font-bold text-sm text-[#2D2A26] block">{r.title}</span>
                    <span className="text-xs text-[#7A7469]">
                      By {r.authorName} ({r.authorRole}) • {r.ingredients.length} ingredients • {r.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Live
                  </span>
                  <button
                    onClick={() => handleDeleteRecipe(r.id)}
                    className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                    title="Remove recipe"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Reviews Audit */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl border border-[#E8DFD1] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#F4EFE6]">
            <h3 className="font-display text-base font-bold text-[#2D2A26]">Community Reviews & Ratings Log</h3>
          </div>
          <div className="divide-y divide-[#F4EFE6]">
            {reviews.map((rev) => {
              const rec = recipes.find(r => r.id === rev.recipeId);

              return (
                <div key={rev.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-[#2D2A26]">{rev.userName}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#FAF7F2] text-[#7A7469]">
                        {rev.userRole}
                      </span>
                      <span className="text-xs font-bold text-amber-700">{rev.rating}★</span>
                      <span className="text-xs text-[#7A7469]">on "{rec?.title || 'Recipe'}"</span>
                    </div>
                    <p className="text-xs text-[#5C564C]">{rev.comment}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-2 text-stone-400 hover:text-red-600 transition-colors self-end sm:self-auto"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
