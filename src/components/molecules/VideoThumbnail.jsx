import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const VideoThumbnail = ({ 
  video, 
  section,
  onEdit,
  onPin,
  onDelete,
  showControls = false
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${section}/video/${video.Id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(video);
  };

  const handlePin = (e) => {
    e.stopPropagation();
    onPin(video.Id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(video.Id);
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(video.mainVideoUrl);
const thumbnailUrl = video.thumbnailUrl || 
    (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "./default-video-thumbnail.jpg");
  return (
    <Card className={cn(
      "group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02]",
      video.isPinned && "ring-2 ring-accent-500 ring-offset-2"
    )}>
      <div className="relative" onClick={handleClick}>
        <div className="aspect-video w-full overflow-hidden">
<img
            src={thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "./default-video-thumbnail.jpg";
            }}
          />
          <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
              <ApperIcon name="Play" size={24} className="text-primary-600 ml-0.5" />
            </div>
          </div>
        </div>
        
        {video.isPinned && (
          <div className="absolute top-3 left-3">
            <Badge variant="admin" className="shadow-lg">
              <ApperIcon name="Pin" size={12} className="mr-1" />
              고정됨
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {video.title}
          </h3>
          {showControls && (
            <div className="flex items-center space-x-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePin}
                className="p-1 h-8 w-8"
              >
                <ApperIcon name="Pin" size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="p-1 h-8 w-8"
              >
                <ApperIcon name="Edit" size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {video.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {video.allowedRoles?.map((role) => (
              <Badge key={role} variant={role} className="text-xs">
                {role}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <ApperIcon name="Play" size={14} className="mr-1" />
            {video.curriculumLinks?.length || 0}개 강의
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoThumbnail;