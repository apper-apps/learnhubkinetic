import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CurriculumSidebar = ({ curriculum, activeVideoId, onVideoSelect, className }) => {
  const [expandedSections, setExpandedSections] = useState(new Set([0]));

  const toggleSection = (index) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const handleVideoClick = (videoUrl, title) => {
    onVideoSelect(videoUrl, title);
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="BookOpen" size={20} className="mr-2 text-primary-600" />
          커리큘럼
        </h3>

        <div className="space-y-2">
          {curriculum.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(sectionIndex)}
                className="w-full px-4 py-3 text-left bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-all duration-200 flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">
                  {section.title}
                </span>
                <ApperIcon
                  name="ChevronDown"
                  size={16}
                  className={cn(
                    "text-gray-500 transition-transform duration-200",
                    expandedSections.has(sectionIndex) ? "rotate-180" : ""
                  )}
                />
              </button>

              {expandedSections.has(sectionIndex) && (
                <div className="divide-y divide-gray-100">
                  {section.videos.map((video, videoIndex) => {
                    const videoId = getYouTubeVideoId(video.url);
                    const thumbnailUrl = videoId 
                      ? `https://img.youtube.com/vi/${videoId}/default.jpg`
                      : "/default-video-thumbnail.jpg";
                    
                    const isActive = activeVideoId === video.url;

                    return (
                      <button
                        key={videoIndex}
                        onClick={() => handleVideoClick(video.url, video.title)}
                        className={cn(
                          "w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-200 flex items-center space-x-3",
                          isActive && "bg-gradient-to-r from-primary-50 to-secondary-50 border-l-4 border-primary-500"
                        )}
                      >
                        <img
                          src={thumbnailUrl}
                          alt={video.title}
                          className="w-16 h-12 rounded object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.src = "/default-video-thumbnail.jpg";
                          }}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-medium truncate",
                            isActive ? "text-primary-700" : "text-gray-900"
                          )}>
                            {video.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            강의 {videoIndex + 1}
                          </p>
                        </div>

                        {isActive && (
                          <ApperIcon
                            name="Play"
                            size={16}
                            className="text-primary-600 flex-shrink-0"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CurriculumSidebar;