import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { toast } from "react-toastify";

const ReviewPost = ({ 
  review, 
  onEdit, 
  onDelete, 
  onHide, 
  isAdmin = false,
  currentUserId 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(review.content);

  const handleEdit = () => {
    if (isEditing) {
      if (editContent.trim().length === 0) {
        toast.error("내용을 입력해주세요.");
        return;
      }
      if (editContent.length > 500) {
        toast.error("500자 이내로 작성해주세요.");
        return;
      }
      onEdit(review.Id, editContent.trim());
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditContent(review.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onDelete(review.Id);
    }
  };

  const handleHide = () => {
    const action = review.isHidden ? "표시" : "숨김";
    if (window.confirm(`이 후기를 ${action} 처리하시겠습니까?`)) {
      onHide(review.Id);
    }
  };

  const isOwner = currentUserId === review.userId;
  const canEdit = isOwner || isAdmin;

  if (review.isHidden && !isAdmin) {
    return null;
  }

  return (
    <Card className={`${review.isHidden ? "opacity-60 border-gray-300" : ""}`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={18} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{review.username || "익명 사용자"}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(review.createdAt), "MM월 dd일 HH:mm", { locale: ko })}
              </p>
            </div>
          </div>
          
          {canEdit && (
            <div className="flex items-center space-x-2">
              {isOwner && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="p-1 h-8 w-8"
                  >
                    <ApperIcon name={isEditing ? "Check" : "Edit"} size={14} />
                  </Button>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="p-1 h-8 w-8"
                    >
                      <ApperIcon name="X" size={14} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </>
              )}
              
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHide}
                  className="p-1 h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <ApperIcon name={review.isHidden ? "Eye" : "EyeOff"} size={14} />
                </Button>
              )}
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              maxLength={500}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-3 focus:ring-primary-500/10 resize-none"
              placeholder="도전 후기를 작성해주세요... (최대 500자)"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {editContent.length}/500자
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {review.content}
            </p>
            
            {review.isHidden && isAdmin && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
                  <ApperIcon name="EyeOff" size={12} className="mr-1" />
                  숨겨진 게시물
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReviewPost;