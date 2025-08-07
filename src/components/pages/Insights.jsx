import React, { useState, useEffect } from "react";
import BlogGrid from "@/components/organisms/BlogGrid";
import BlogPostModal from "@/components/molecules/BlogPostModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import blogService from "@/services/api/blogService";
import { toast } from "react-toastify";

const Insights = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);
  const [editPost, setEditPost] = useState(null);

  // Simulate admin user - in real app this would come from context/store
  const isAdmin = true;

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await blogService.getAll();
      setPosts(data);
    } catch (err) {
      setError("블로그 포스트를 불러오는 중 오류가 발생했습니다.");
      console.error("Error loading blog posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    setEditPost(null);
    setShowPostModal(true);
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setShowPostModal(true);
  };

  const handleSubmit = async (postData) => {
    try {
      if (editPost) {
        await blogService.update(editPost.Id, postData);
        toast.success("포스트가 성공적으로 수정되었습니다!");
      } else {
        await blogService.create(postData);
        toast.success("포스트가 성공적으로 발행되었습니다!");
      }
      
      loadPosts();
    } catch (err) {
      toast.error(editPost ? "포스트 수정 중 오류가 발생했습니다." : "포스트 발행 중 오류가 발생했습니다.");
      console.error("Error saving post:", err);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await blogService.delete(postId);
        toast.success("포스트가 삭제되었습니다.");
        loadPosts();
      } catch (err) {
        toast.error("포스트 삭제 중 오류가 발생했습니다.");
        console.error("Error deleting post:", err);
      }
    }
  };

  if (loading) return <Loading text="인사이트를 불러오는 중..." />;
  if (error) return <Error message={error} onRetry={loadPosts} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
              <ApperIcon name="BookOpen" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
                인사이트 블로그
              </h1>
              <p className="text-gray-600 mt-1">
                최신 트렌드와 실무 인사이트를 담은 전문 콘텐츠
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  깊이 있는 인사이트를 만나보세요
                </h2>
                <p className="text-emerald-100">
                  업계 전문가들이 직접 작성한 실무 경험과 최신 트렌드 분석을 확인하세요
                </p>
              </div>
              <div className="hidden md:block">
                <ApperIcon name="Lightbulb" size={48} className="text-emerald-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <BlogGrid
          posts={posts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreatePost={handleCreatePost}
          showControls={isAdmin}
          loading={loading}
        />

        {/* Post Modal */}
        <BlogPostModal
          isOpen={showPostModal}
          onClose={() => {
            setShowPostModal(false);
            setEditPost(null);
          }}
          onSubmit={handleSubmit}
          editPost={editPost}
        />
      </div>
    </div>
  );
};

export default Insights;