import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Checkbox from "@/components/atoms/Checkbox";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const VideoUploadModal = ({ isOpen, onClose, onSubmit, editVideo = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mainVideoUrl: "",
    thumbnailUrl: "",
    curriculumLinks: [""],
    allowedRoles: ["free"]
  });

  const roles = [
    { value: "free", label: "Free" },
    { value: "member", label: "Member" },
    { value: "master", label: "Master" },
    { value: "both", label: "Both" }
  ];

  useEffect(() => {
    if (editVideo) {
      setFormData({
        title: editVideo.title || "",
        description: editVideo.description || "",
        mainVideoUrl: editVideo.mainVideoUrl || "",
        thumbnailUrl: editVideo.thumbnailUrl || "",
        curriculumLinks: editVideo.curriculumLinks?.length ? editVideo.curriculumLinks : [""],
        allowedRoles: editVideo.allowedRoles || ["free"]
      });
    } else {
      setFormData({
        title: "",
        description: "",
        mainVideoUrl: "",
        thumbnailUrl: "",
        curriculumLinks: [""],
        allowedRoles: ["free"]
      });
    }
  }, [editVideo, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCurriculumChange = (index, value) => {
    const newLinks = [...formData.curriculumLinks];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, curriculumLinks: newLinks }));
  };

  const addCurriculumLink = () => {
    setFormData(prev => ({
      ...prev,
      curriculumLinks: [...prev.curriculumLinks, ""]
    }));
  };

  const removeCurriculumLink = (index) => {
    if (formData.curriculumLinks.length > 1) {
      const newLinks = formData.curriculumLinks.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, curriculumLinks: newLinks }));
    }
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
    
    if (!formData.mainVideoUrl.trim()) {
      toast.error("메인 비디오 URL을 입력해주세요.");
      return;
    }

    if (formData.allowedRoles.length === 0) {
      toast.error("최소 하나의 권한을 선택해주세요.");
      return;
    }

    const filteredCurriculumLinks = formData.curriculumLinks
      .filter(link => link.trim())
      .map(link => link.trim());

    const submitData = {
      ...formData,
      curriculumLinks: filteredCurriculumLinks,
      title: formData.title.trim(),
      description: formData.description.trim(),
      mainVideoUrl: formData.mainVideoUrl.trim(),
      thumbnailUrl: formData.thumbnailUrl.trim()
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
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editVideo ? "동영상 수정" : "동영상 업로드"}
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
                placeholder="동영상 제목을 입력하세요"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-3 focus:ring-primary-500/10"
                  placeholder="동영상 설명을 입력하세요"
                />
              </div>

              <Input
                label="메인 비디오 URL"
                value={formData.mainVideoUrl}
                onChange={(e) => handleInputChange("mainVideoUrl", e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                required
              />

              <Input
                label="썸네일 URL (선택사항)"
                value={formData.thumbnailUrl}
                onChange={(e) => handleInputChange("thumbnailUrl", e.target.value)}
                placeholder="썸네일 이미지 URL (비워두면 기본 썸네일 사용)"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  커리큘럼 링크
                </label>
                <div className="space-y-3">
                  {formData.curriculumLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={link}
                        onChange={(e) => handleCurriculumChange(index, e.target.value)}
                        placeholder="커리큘럼 비디오 URL"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeCurriculumLink(index)}
                        disabled={formData.curriculumLinks.length === 1}
                        className="px-3"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={addCurriculumLink}
                    className="w-full"
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    커리큘럼 링크 추가
                  </Button>
                </div>
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
                {editVideo ? "수정하기" : "업로드하기"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VideoUploadModal;