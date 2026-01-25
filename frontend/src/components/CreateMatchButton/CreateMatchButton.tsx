import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const CreateMatchButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-17 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <button
        onClick={() => navigate('/match')}
        className="group pointer-events-auto bg-primary hover:bg-primary-hover active:bg-primary-light 
                    text-white rounded-full px-6 py-3 shadow-[0_8px_24px_rgba(153,0,0,0.3)] 
                    hover:shadow-[0_12px_32px_rgba(153,0,0,0.4)]
                    transition-all duration-300 ease-out transform hover:-translate-y-1 active:scale-95
                    flex items-center gap-2 border-4 border-white/50 backdrop-blur-sm"
      >
        <Plus size={24} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
        <span className="font-bold text-sm tracking-wide uppercase">Create Match</span>
      </button>
    </div>
  );
};

export default CreateMatchButton;
