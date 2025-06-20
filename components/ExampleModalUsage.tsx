import React, { useState } from 'react';
import { CreatePostModal } from './blog/create-post-modal';
import { CreatePostModalMobile } from './blog/create-post-modal-mobile';
import { Modal } from './Modal';
import { ICategory } from '@/interface';

// Example usage component
export const ExampleModalUsage: React.FC = () => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock categories data
  const mockCategories: ICategory[] = [
    { _id: '1', name: 'History', description: 'Historical topics and discussions', createdAt: new Date(), updatedAt: new Date() },
    { _id: '2', name: 'Food', description: 'Food, recipes, and culinary discussions', createdAt: new Date(), updatedAt: new Date() },
    { _id: '3', name: 'Pets', description: 'Pet care, stories, and advice', createdAt: new Date(), updatedAt: new Date() },
    { _id: '4', name: 'Health', description: 'Health and wellness topics', createdAt: new Date(), updatedAt: new Date() },
    { _id: '5', name: 'Fashion', description: 'Fashion trends and style discussions', createdAt: new Date(), updatedAt: new Date() },
    { _id: '6', name: 'Exercise', description: 'Fitness, workouts, and exercise tips', createdAt: new Date(), updatedAt: new Date() },
    { _id: '7', name: 'Others', description: 'General discussions and other topics', createdAt: new Date(), updatedAt: new Date() },
  ];

  const handleCreatePost = async (data: { title: string; content: string; category: string }) => {
    setIsLoading(true);
    try {
      // Simulate API call
      console.log('Creating post:', data);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Close modal after successful submission
      setIsCreatePostModalOpen(false);
      setIsMobileModalOpen(false);
      
      // You can add toast notification here
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Modal Examples</h1>
      
      <div className="space-y-4">
        {/* Button to open desktop-optimized modal */}
        <button
          onClick={() => setIsCreatePostModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Open Create Post Modal (Desktop Optimized)
        </button>

        {/* Button to open mobile-optimized modal */}
        <button
          onClick={() => setIsMobileModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Open Create Post Modal (Mobile Optimized)
        </button>

        {/* Button to open basic modal */}
        <button
          onClick={() => setIsBasicModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Open Basic Modal
        </button>
      </div>

      {/* Desktop-optimized Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onSubmit={handleCreatePost}
        categories={mockCategories}
        isLoading={isLoading}
      />

      {/* Mobile-optimized Create Post Modal */}
      <CreatePostModalMobile
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        onSubmit={handleCreatePost}
        categories={mockCategories}
        isLoading={isLoading}
      />

      {/* Basic Modal Example */}
      <Modal
        isOpen={isBasicModalOpen}
        onClose={() => setIsBasicModalOpen(false)}
        title="Basic Modal Example"
        size="md"
      >
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            This is a basic modal example. You can put any content here.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsBasicModalOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => setIsBasicModalOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 