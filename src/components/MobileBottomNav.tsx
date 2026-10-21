import React from 'react';
import { Home, Flame, Plus, Tv2, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenCreate: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenCreate,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f0f0f] border-t border-[#272727] h-12 px-2 flex items-center justify-around pb-safe">
      {/* Home */}
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center flex-1 h-full ${
          currentView === 'home' ? 'text-white' : 'text-neutral-400'
        }`}
      >
        <Home className={`w-5 h-5 ${currentView === 'home' ? 'fill-current' : ''}`} />
        <span className="text-[10px] mt-0.5 font-medium">Home</span>
      </button>

      {/* Shorts */}
      <button
        onClick={() => onNavigate('shorts')}
        className={`flex flex-col items-center justify-center flex-1 h-full ${
          currentView === 'shorts' ? 'text-white' : 'text-neutral-400'
        }`}
      >
        <Flame className={`w-5 h-5 ${currentView === 'shorts' ? 'text-red-500 fill-red-500' : ''}`} />
        <span className="text-[10px] mt-0.5 font-medium">Shorts</span>
      </button>

      {/* Center (+) Create button */}
      <button
        onClick={onOpenCreate}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-600 bg-[#222222] text-white active:scale-95 transition-transform"
        title="Create or Inquire"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Subscriptions */}
      <button
        onClick={() => onNavigate('subscriptions')}
        className={`flex flex-col items-center justify-center flex-1 h-full ${
          currentView === 'subscriptions' ? 'text-white' : 'text-neutral-400'
        }`}
      >
        <Tv2 className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 font-medium">Subscriptions</span>
      </button>

      {/* You */}
      <button
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center justify-center flex-1 h-full ${
          currentView === 'profile' ? 'text-white' : 'text-neutral-400'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 font-medium">You</span>
      </button>
    </nav>
  );
};
