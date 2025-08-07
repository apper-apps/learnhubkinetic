import React, { useState } from "react";
import ReviewPost from "@/components/molecules/ReviewPost";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ReviewFeed = ({ 
  reviews, 
  onCreateReview,
  onEditReview,
  onDeleteReview,
  onHideReview,
  currentUser,
  loading = false 
}) => {
  const [newReview, setNewReview] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newReview.trim()) {
      toast.error("후기를 작성해주세요.");
      return;
    }
    
    if (newReview.length > 500) {
      toast.error("500자 이내로 작성해주세요.");
      return;
    }

    onCreateReview(newReview.trim());
    setNewReview("");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-4 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create new review */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={18} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {currentUser?.name || "익명 사용자"}
              </p>
              <p className="text-sm text-gray-500">도전 후기를 공유해주세요</p>
            </div>
          </div>

          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            maxLength={500}
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-3 focus:ring-primary-500/10 resize-none"
            placeholder="여러분의 도전 이야기를 들려주세요... (최대 500자)"
          />

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {newReview.length}/500자
            </span>
            <Button type="submit" disabled={!newReview.trim()}>
              <ApperIcon name="Send" size={16} className="mr-2" />
              게시하기
            </Button>
          </div>
        </form>
      </Card>

      {/* Reviews feed */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="MessageCircle" size={24} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 후기가 없습니다
            </h3>
            <p className="text-gray-600">
              첫 번째 도전 후기를 공유해보세요.
            </p>
          </Card>
        ) : (
          reviews.map((review) => (
            <ReviewPost
              key={review.Id}
              review={review}
              onEdit={onEditReview}
              onDelete={onDeleteReview}
              onHide={onHideReview}
              isAdmin={currentUser?.role === "admin"}
              currentUserId={currentUser?.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewFeed;