import React from 'react';
import { Bookmark } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { CategoryPill } from './CategoryPill';

export const CategoryBar = () => {
  const { 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    setShowAuthModal, 
    setPendingAction 
  } = useEvents();
  const { isAuthenticated } = useAuth();

  const handleCategoryClick = (categoryId) => {
    if (categoryId === 'interested') {
      if (!isAuthenticated) {
        setShowAuthModal(true);
        setPendingAction('interested');
        return;
      }
    }
    setSelectedCategory(categoryId);
  };

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-[1200px] mx-auto px-4 py-3">
        <div 
          className="flex items-center gap-2 overflow-x-auto no-scrollbar" 
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          <CategoryPill
            label="All"
            isActive={selectedCategory === 'all'}
            onClick={() => handleCategoryClick('all')}
          />
          {categories?.filter(c => c.id !== 'all').map((category) => (
            <CategoryPill
              key={category.id}
              label={category.name}
              isActive={selectedCategory === category.id}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
          <CategoryPill
            label="Saved"
            icon={Bookmark}
            isActive={selectedCategory === 'interested'}
            onClick={() => handleCategoryClick('interested')}
          />
        </div>
      </div>
    </div>
  );
};
