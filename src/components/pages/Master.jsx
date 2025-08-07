import React, { useState, useEffect } from "react";
import VideoGrid from "@/components/organisms/VideoGrid";
import VideoUploadModal from "@/components/molecules/VideoUploadModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import videoService from "@/services/api/videoService";
import { toast } from "react-toastify";

const Master = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editVideo, setEditVideo] = useState(null);

  // Simulate admin user - in real app this would come from context/store
  const isAdmin = true;

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await videoService.getBySection("master");
      setVideos(data);
    } catch (err) {
      setError("마스터 클래스 동영상을 불러오는 중 오류가 발생했습니다.");
      console.error("Error loading master videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    setEditVideo(null);
    setShowUploadModal(true);
  };

  const handleEdit = (video) => {
    setEditVideo(video);
    setShowUploadModal(true);
  };

  const handleSubmit = async (videoData) => {
    try {
      const dataWithSection = {
        ...videoData,
        section: "master"
      };

      if (editVideo) {
        await videoService.update(editVideo.Id, dataWithSection);
        toast.success("동영상이 성공적으로 수정되었습니다!");
      } else {
        await videoService.create(dataWithSection);
        toast.success("동영상이 성공적으로 업로드되었습니다!");
      }
      
      loadVideos();
    } catch (err) {
      toast.error(editVideo ? "동영상 수정 중 오류가 발생했습니다." : "동영상 업로드 중 오류가 발생했습니다.");
      console.error("Error saving video:", err);
    }
  };

  const handlePin = async (videoId) => {
    try {
      const video = videos.find(v => v.Id === videoId);
      await videoService.update(videoId, { ...video, isPinned: !video.isPinned });
      toast.success(video.isPinned ? "고정이 해제되었습니다." : "상단에 고정되었습니다.");
      loadVideos();
    } catch (err) {
      toast.error("고정 상태 변경 중 오류가 발생했습니다.");
      console.error("Error pinning video:", err);
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await videoService.delete(videoId);
        toast.success("동영상이 삭제되었습니다.");
        loadVideos();
      } catch (err) {
        toast.error("동영상 삭제 중 오류가 발생했습니다.");
        console.error("Error deleting video:", err);
      }
    }
  };

  if (loading) return <Loading text="마스터 클래스를 불러오는 중..." />;
  if (error) return <Error message={error} onRetry={loadVideos} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <ApperIcon name="Crown" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
                마스터 클래스
              </h1>
              <p className="text-gray-600 mt-1">
                업계 최고 전문가들의 심화 과정과 고급 스킬
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  마스터 레벨의 전문성을 습득하세요
                </h2>
                <p className="text-purple-100">
                  업계 리더들의 노하우와 깊이 있는 인사이트로 전문가로 성장하세요
                </p>
              </div>
              <div className="hidden md:block">
                <ApperIcon name="Award" size={48} className="text-purple-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <VideoGrid
          videos={videos}
          section="master"
          onEdit={handleEdit}
          onPin={handlePin}
          onDelete={handleDelete}
          onUpload={handleUpload}
          showControls={isAdmin}
          loading={loading}
        />

        {/* Upload Modal */}
        <VideoUploadModal
          isOpen={showUploadModal}
          onClose={() => {
            setShowUploadModal(false);
            setEditVideo(null);
          }}
          onSubmit={handleSubmit}
          editVideo={editVideo}
        />
      </div>
    </div>
  );
};

export default Master;