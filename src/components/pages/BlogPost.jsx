import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import BlogPostModal from "@/components/molecules/BlogPostModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import blogService from "@/services/api/blogService";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const BlogPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  // Simulate admin user - in real app this would come from context/store
  const isAdmin = true;

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await blogService.getById(parseInt(postId));
      
      if (!data) {
        setError("포스트를 찾을 수 없습니다.");
        return;
      }
      
      setPost(data);
    } catch (err) {
      setError("포스트를 불러오는 중 오류가 발생했습니다.");
      console.error("Error loading blog post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSubmit = async (postData) => {
    try {
      await blogService.update(post.Id, postData);
      toast.success("포스트가 성공적으로 수정되었습니다!");
      loadPost();
    } catch (err) {
      toast.error("포스트 수정 중 오류가 발생했습니다.");
      console.error("Error updating post:", err);
    }
  };

  if (loading) return <Loading text="포스트를 로드하는 중..." />;
  if (error) return <Error message={error} onRetry={loadPost} />;
  if (!post) return <Error message="포스트를 찾을 수 없습니다." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate("/")}
            className="hover:text-primary-600 transition-colors duration-200"
          >
            홈
          </button>
          <ApperIcon name="ChevronRight" size={14} />
          <button
            onClick={() => navigate("/insights")}
            className="hover:text-primary-600 transition-colors duration-200"
          >
            인사이트
          </button>
          <ApperIcon name="ChevronRight" size={14} />
          <span className="text-gray-900 font-medium line-clamp-1">{post.title}</span>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden">
              {/* Featured Image */}
              {post.thumbnailUrl && (
                <div className="aspect-[21/9] w-full overflow-hidden">
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/default-blog-thumbnail.jpg";
                    }}
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {post.title}
                      </h1>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <ApperIcon name="User" size={14} className="text-white" />
                          </div>
                          <span>관리자</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Calendar" size={16} />
                          <span>{format(new Date(post.createdAt), "yyyy년 MM월 dd일", { locale: ko })}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Clock" size={16} />
                          <span>5분 읽기</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {post.allowedRoles?.map((role) => (
                          <Badge key={role} variant={role}>
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit}
                        className="flex items-center space-x-2"
                      >
                        <ApperIcon name="Edit" size={16} />
                        <span className="hidden sm:inline">수정</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    className="text-gray-800 leading-relaxed"
                  />
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm">
                        <ApperIcon name="ThumbsUp" size={16} className="mr-2" />
                        좋아요
                      </Button>
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Share2" size={16} className="mr-2" />
                        공유
                      </Button>
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Bookmark" size={16} className="mr-2" />
                        저장
                      </Button>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate("/insights")}
                    >
                      <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                      목록으로
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Related Posts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              관련 포스트
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((_, index) => (
                <Card key={index} className="overflow-hidden group cursor-pointer">
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      관련 포스트 제목 {index + 1}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      관련 포스트의 간단한 설명이 들어갑니다.
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Edit Modal */}
        <BlogPostModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleSubmit}
          editPost={post}
        />
      </div>
    </div>
  );
};

export default BlogPost;