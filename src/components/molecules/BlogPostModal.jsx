import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Checkbox from "@/components/atoms/Checkbox";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const BlogPostModal = ({ isOpen, onClose, onSubmit, editPost = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnailUrl: "",
    allowedRoles: ["free"]
  });

  const roles = [
    { value: "free", label: "Free" },
    { value: "member", label: "Member" },
    { value: "master", label: "Master" },
    { value: "both", label: "Both" }
  ];

  // Rich text editor toolbar
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  useEffect(() => {
    if (editPost) {
      setFormData({
        title: editPost.title || "",
        content: editPost.content || "",
        thumbnailUrl: editPost.thumbnailUrl || "",
        allowedRoles: editPost.allowedRoles || ["free"]
      });
    } else {
      setFormData({
        title: "",
        content: "",
        thumbnailUrl: "",
        allowedRoles: ["free"]
      });
    }
  }, [editPost, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (role, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        allowedRoles: [...prev.allowedRoles, role]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        allowedRoles: prev.allowedRoles.filter(r => r !== role)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    if (formData.allowedRoles.length === 0) {
      toast.error("최소 하나의 권한을 선택해주세요.");
      return;
    }

    const submitData = {
      ...formData,
      title: formData.title.trim(),
      content: formData.content.trim(),
      thumbnailUrl: formData.thumbnailUrl.trim(),
      excerpt: formData.content.trim().substring(0, 150)
    };

    onSubmit(submitData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editPost ? "포스트 수정" : "새 포스트 작성"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              <Input
                label="제목"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="포스트 제목을 입력하세요"
                required
              />

              <Input
                label="썸네일 URL (선택사항)"
                value={formData.thumbnailUrl}
                onChange={(e) => handleInputChange("thumbnailUrl", e.target.value)}
                placeholder="썸네일 이미지 URL (비워두면 기본 썸네일 사용)"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용
                </label>
                
                {/* Rich Text Editor Toolbar */}
                <div className="border border-gray-300 rounded-t-lg p-2 bg-gray-50 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => formatText("bold")}
                    className="px-2 py-1"
                  >
                    <ApperIcon name="Bold" size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => formatText("italic")}
                    className="px-2 py-1"
                  >
                    <ApperIcon name="Italic" size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => formatText("underline")}
                    className="px-2 py-1"
                  >
                    <ApperIcon name="Underline" size={14} />
                  </Button>
                  <div className="w-px bg-gray-300"></div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => formatText("formatBlock", "h1")}
                    className="px-2 py-1 text-xs"
                  >
                    H1
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => formatText("formatBlock", "h2")}
                    className="px-2 py-1 text-xs"
                  >
                    H2
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => formatText("formatBlock", "h3")}
                    className="px-2 py-1 text-xs"
                  >
                    H3
                  </Button>
                  <div className="w-px bg-gray-300"></div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => formatText("insertUnorderedList")}
                    className="px-2 py-1"
                  >
                    <ApperIcon name="List" size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => formatText("insertOrderedList")}
                    className="px-2 py-1"
                  >
                    <ApperIcon name="ListOrdered" size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => formatText("formatBlock", "blockquote")}
                    className="px-2 py-1"
                  >
                    <ApperIcon name="Quote" size={14} />
                  </Button>
                </div>

                <div
                  contentEditable
                  className="rich-editor border-l border-r border-b border-gray-300 rounded-b-lg min-h-[300px] max-h-[400px] overflow-y-auto"
                  style={{ outline: "none" }}
                  onBlur={(e) => handleInputChange("content", e.target.innerHTML)}
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  접근 권한
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <Checkbox
                      key={role.value}
                      label={role.label}
                      checked={formData.allowedRoles.includes(role.value)}
                      onChange={(e) => handleRoleChange(role.value, e.target.checked)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-8">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                취소
              </Button>
              <Button type="submit">
                {editPost ? "수정하기" : "발행하기"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BlogPostModal;