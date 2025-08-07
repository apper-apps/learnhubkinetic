import React from "react";
import VideoThumbnail from "@/components/molecules/VideoThumbnail";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const VideoGrid = ({ 
  videos, 
  section,
  onEdit,
  onPin,
  onDelete,
  onUpload,
  showControls = false,
  loading = false 
}) => {
  // Sort videos: pinned first, then by creation date
  const sortedVideos = [...videos].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="flex space-x-2">
              <div className="h-5 bg-gray-200 rounded-full w-12"></div>
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
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
          <Button onClick={onUpload} className="flex items-center space-x-2">
            <ApperIcon name="Plus" size={20} />
            <span>동영상 업로드</span>
          </Button>
        </div>
      )}

      {sortedVideos.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Video" size={24} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            아직 동영상이 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            첫 번째 동영상을 업로드해보세요.
          </p>
          {showControls && (
            <Button onClick={onUpload}>
              <ApperIcon name="Plus" size={20} className="mr-2" />
              동영상 업로드
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVideos.map((video) => (
            <VideoThumbnail
              key={video.Id}
              video={video}
              section={section}
              onEdit={onEdit}
              onPin={onPin}
              onDelete={onDelete}
              showControls={showControls}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoGrid;