import React, { useState } from 'react';
import { Modal } from '../Modal';
import { ICategory, ICreatePost } from '@/interface';
import { SelectPostComponent } from './select-post';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ICreatePost) => void;
  categories: ICategory[];
  isLoading?: boolean;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  isLoading = false
}) => {
  let defaultFormData = {
    title: '',
    content: '',
    category: 'all'
  }
  const [formData, setFormData] = useState(defaultFormData);

  const handleInputChange = (value: string, key: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim() || formData.category?.trim() === 'all') {
      return;
    }
    onSubmit(formData);
    // Reset form after submission
    setFormData(defaultFormData);
  };

  const handleCancel = () => {
    setFormData(defaultFormData);
    onClose();
  };

  const isFormValid = formData.title.trim() && formData.content.trim() && formData.category;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Create Post"
      size="lg"
      className="sm:mx-4 sm:max-w-full md:max-w-2xl"
    >
      <div className="p-6 space-y-4">
        {/* Community Selector */}
        <div className="space-y-2">
          <div className="relative">
            <SelectPostComponent
              value={formData.category}
              onChange={handleInputChange}
              options={categories?.map((e: ICategory, index: number) => index === 0 ? ({...e, name: "Choose a community"}) : e)}
              width="100%"
            />
          </div>
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange(e.target.value, 'title')}
            placeholder="What's on your mind..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Content Textarea */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange(e.target.value, 'content')}
            placeholder="What's on your mind..."
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button
            onClick={handleCancel}
            className={`lg:max-w-[100px] flex-1 px-4 py-2 text-[#49A569] bg-white border border-[#49A569] rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors`}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className={`
              lg:max-w-[100px] flex-1 px-4 py-2  text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors
              ${isFormValid && !isLoading
                ? 'bg-[#49A569] hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </Modal>
  );
}; 