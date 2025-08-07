import React, { useState, useEffect } from "react";
import ReviewFeed from "@/components/organisms/ReviewFeed";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import reviewService from "@/services/api/reviewService";
import { toast } from "react-toastify";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Simulate current user - in real app this would come from context/store
  const currentUser = {
    id: 1,
    name: "사용자",
    role: "admin" // For demo purposes
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await reviewService.getAll();
      setReviews(data);
    } catch (err) {
      setError("도전 후기를 불러오는 중 오류가 발생했습니다.");
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (content) => {
    try {
      const newReview = {
        userId: currentUser.id,
        username: currentUser.name,
        content,
        isHidden: false
      };
      
      await reviewService.create(newReview);
      toast.success("후기가 성공적으로 게시되었습니다!");
      loadReviews();
    } catch (err) {
      toast.error("후기 게시 중 오류가 발생했습니다.");
      console.error("Error creating review:", err);
    }
  };

  const handleEditReview = async (reviewId, content) => {
    try {
      const review = reviews.find(r => r.Id === reviewId);
      await reviewService.update(reviewId, { ...review, content });
      toast.success("후기가 수정되었습니다.");
      loadReviews();
    } catch (err) {
      toast.error("후기 수정 중 오류가 발생했습니다.");
      console.error("Error editing review:", err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewService.delete(reviewId);
      toast.success("후기가 삭제되었습니다.");
      loadReviews();
    } catch (err) {
      toast.error("후기 삭제 중 오류가 발생했습니다.");
      console.error("Error deleting review:", err);
    }
  };

  const handleHideReview = async (reviewId) => {
    try {
      const review = reviews.find(r => r.Id === reviewId);
      await reviewService.update(reviewId, { ...review, isHidden: !review.isHidden });
      toast.success(review.isHidden ? "후기가 표시되었습니다." : "후기가 숨겨졌습니다.");
      loadReviews();
    } catch (err) {
      toast.error("후기 상태 변경 중 오류가 발생했습니다.");
      console.error("Error hiding review:", err);
    }
  };

  if (loading) return <Loading text="도전 후기를 불러오는 중..." />;
  if (error) return <Error message={error} onRetry={loadReviews} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
              <ApperIcon name="MessageCircle" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
                도전 후기
              </h1>
              <p className="text-gray-600 mt-1">
                학습자들의 생생한 경험담과 성공 스토리를 공유해보세요
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  여러분의 도전 이야기를 들려주세요
                </h2>
                <p className="text-pink-100">
                  학습 과정에서 겪은 경험과 성취를 공유하며 서로 동기부여를 받아보세요
                </p>
              </div>
              <div className="hidden md:block">
                <ApperIcon name="Heart" size={48} className="text-pink-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Review Feed */}
        <div className="max-w-2xl mx-auto">
          <ReviewFeed
            reviews={reviews}
            onCreateReview={handleCreateReview}
            onEditReview={handleEditReview}
            onDeleteReview={handleDeleteReview}
            onHideReview={handleHideReview}
            currentUser={currentUser}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Reviews;