import React from "react";
import BlogThumbnail from "@/components/molecules/BlogThumbnail";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const BlogGrid = ({ 
  posts, 
  onEdit,
  onDelete,
  onCreatePost,
  showControls = false,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 aspect-[4/3] rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                <div className="h-5 bg-gray-200 rounded-full w-16"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showControls && (
        <div className="flex justify-end">
          <Button onClick={onCreatePost} className="flex items-center space-x-2">
            <ApperIcon name="PenTool" size={20} />
            <span>새 포스트 작성</span>
          </Button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="FileText" size={24} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            아직 포스트가 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            첫 번째 블로그 포스트를 작성해보세요.
          </p>
          {showControls && (
            <Button onClick={onCreatePost}>
              <ApperIcon name="PenTool" size={20} className="mr-2" />
              새 포스트 작성
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogThumbnail
              key={post.Id}
              post={post}
              onEdit={onEdit}
              onDelete={onDelete}
              showControls={showControls}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogGrid;