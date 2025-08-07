import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const BlogThumbnail = ({ post, onEdit, onDelete, showControls = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/insights/post/${post.Id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(post);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(post.Id);
  };

  const thumbnailUrl = post.thumbnailUrl || "/default-blog-thumbnail.jpg";

  return (
    <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02]">
      <div onClick={handleClick}>
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "/default-blog-thumbnail.jpg";
            }}
          />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
              {post.title}
            </h3>
            {showControls && (
              <div className="flex items-center space-x-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
          
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {post.excerpt || "블로그 포스트를 확인해보세요."}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {post.allowedRoles?.map((role) => (
                <Badge key={role} variant={role} className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center text-xs text-gray-500">
              <ApperIcon name="Calendar" size={14} className="mr-1" />
              {format(new Date(post.createdAt), "MM월 dd일", { locale: ko })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BlogThumbnail;