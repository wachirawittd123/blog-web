import React, { useState } from 'react';
import { MobileOptimizedModal } from '../MobileOptimizedModal';
import { ICategory } from '@/interface';

interface CreatePostModalMobileProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; category: string }) => void;
  categories: ICategory[];
  isLoading?: boolean;
}

export const CreatePostModalMobile: React.FC<CreatePostModalMobileProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleInputChange = (value: string, key: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCategorySelect = (categoryId: string) => {
    handleInputChange(categoryId, 'category');
    setShowCategoryDropdown(false);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      return;
    }
    onSubmit(formData);
    // Reset form after submission
    setFormData({ title: '', content: '', category: '' });
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '', category: '' });
    setShowCategoryDropdown(false);
    onClose();
  };

  const isFormValid = formData.title.trim() && formData.content.trim() && formData.category;

  const getSelectedCategoryName = () => {
    const selectedCategory = categories.find(cat => cat._id === formData.category);
    return selectedCategory?.name || 'Choose a community';
  };

  return (
    <MobileOptimizedModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Create Post"
    >
      <div className="flex flex-col h-full">
        {/* Form Content */}
        <div className="flex-1 p-4 space-y-4">
          {/* Community Selector */}
          <div className="space-y-2">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full flex items-center justify-between px-3 py-3 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <span className={formData.category ? 'text-gray-900' : 'text-gray-500'}>
                {getSelectedCategoryName()}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transform transition-transform ${
                  showCategoryDropdown ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Category Dropdown */}
            {showCategoryDropdown && (
              <div className="border border-gray-300 rounded-md bg-white shadow-lg max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategorySelect(category._id)}
                    className={`w-full px-4 py-3 text-left hover:bg-green-50 focus:outline-none focus:bg-green-50 flex items-center justify-between ${
                      formData.category === category._id ? 'bg-green-100' : ''
                    }`}
                  >
                    <span>{category.name}</span>
                    {formData.category === category._id && (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange(e.target.value, 'title')}
              placeholder="Title"
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Content Textarea */}
          <div className="space-y-2 flex-1">
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange(e.target.value, 'content')}
              placeholder="What's on your mind..."
              className="w-full h-40 md:h-32 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className={`
                flex-1 px-4 py-3 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-medium
                ${isFormValid && !isLoading
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </MobileOptimizedModal>
  );
}; 