import React, { useEffect, useState } from 'react';
import { Modal } from '../Modal';
import { CreateCommentModalProps, ICategory, ICreatePost, IModalAddBlog } from '@/interface';
import { SelectPostComponent } from './select-post';


export const CreateCommentModal: React.FC<CreateCommentModalProps> = ({
  modal,
  onClose,
  onSubmit,
}) => {
  const [comment, setComment] = useState<string>("");

  const handleSubmit = async() => {
    if (!comment.trim()) {
      return;
    }
    await onSubmit(comment);
    setComment("")
  };

  const handleCancel = () => {
    setComment("");
    onClose();
  };

  const isFormValid = comment?.trim();

  return (
    <Modal
      isOpen={modal}
      onClose={handleCancel}
      title={"Add Comments"}
      size="lg"
      className="sm:mx-4 sm:max-w-full md:max-w-2xl"
    >
      <div className="p-6 space-y-4">

        {/* Content Textarea */}
        <div className="space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
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
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`
              lg:max-w-[100px] flex-1 px-4 py-2  text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors
              ${isFormValid 
                ? 'bg-[#49A569] hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
              }
            `}
          >
            Post
          </button>
        </div>
      </div>
    </Modal>
  );
}; 