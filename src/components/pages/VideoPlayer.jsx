import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import CurriculumSidebar from "@/components/molecules/CurriculumSidebar";
import VideoUploadModal from "@/components/molecules/VideoUploadModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import videoService from "@/services/api/videoService";
import { toast } from "react-toastify";

const VideoPlayer = () => {
  const { section, videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  // Simulate admin user - in real app this would come from context/store
  const isAdmin = true;

  useEffect(() => {
    loadVideo();
  }, [videoId]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await videoService.getById(parseInt(videoId));
      
      if (!data) {
        setError("동영상을 찾을 수 없습니다.");
        return;
      }
      
      setVideo(data);
      setCurrentVideoUrl(data.mainVideoUrl);
      setCurrentVideoTitle(data.title);
    } catch (err) {
      setError("동영상을 불러오는 중 오류가 발생했습니다.");
      console.error("Error loading video:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (url, title) => {
    setCurrentVideoUrl(url);
    setCurrentVideoTitle(title);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSubmit = async (videoData) => {
    try {
      const dataWithSection = {
        ...videoData,
        section: section
      };

      await videoService.update(video.Id, dataWithSection);
      toast.success("동영상이 성공적으로 수정되었습니다!");
      loadVideo();
    } catch (err) {
      toast.error("동영상 수정 중 오류가 발생했습니다.");
      console.error("Error updating video:", err);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const buildCurriculum = () => {
    if (!video) return [];

    const curriculum = [{
      title: "메인 강의",
      videos: [{
        title: video.title,
        url: video.mainVideoUrl
      }]
    }];

    if (video.curriculumLinks && video.curriculumLinks.length > 0) {
      const additionalVideos = video.curriculumLinks
        .filter(link => link.trim())
        .map((link, index) => ({
          title: `커리큘럼 ${index + 1}`,
          url: link
        }));

      if (additionalVideos.length > 0) {
        curriculum.push({
          title: "추가 커리큘럼",
          videos: additionalVideos
        });
      }
    }

    return curriculum;
  };

  const getSectionTitle = () => {
    switch (section) {
      case "membership": return "멤버십";
      case "master": return "마스터";
      default: return "강의";
    }
  };

  const getSectionColor = () => {
    switch (section) {
      case "membership": return "from-blue-500 to-blue-600";
      case "master": return "from-purple-500 to-purple-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getSectionIcon = () => {
    switch (section) {
      case "membership": return "Users";
      case "master": return "Crown";
      default: return "Play";
    }
  };

  if (loading) return <Loading text="동영상을 로드하는 중..." />;
  if (error) return <Error message={error} onRetry={loadVideo} />;
  if (!video) return <Error message="동영상을 찾을 수 없습니다." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
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
            onClick={() => navigate(`/${section}`)}
            className="hover:text-primary-600 transition-colors duration-200"
          >
            {getSectionTitle()}
          </button>
          <ApperIcon name="ChevronRight" size={14} />
          <span className="text-gray-900 font-medium">{video.title}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Video Player */}
              <Card className="overflow-hidden mb-6">
                <div className="video-container">
                  <iframe
                    src={getYouTubeEmbedUrl(currentVideoUrl)}
                    title={currentVideoTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </Card>

              {/* Video Info */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getSectionColor()} rounded-lg flex items-center justify-center`}>
                      <ApperIcon name={getSectionIcon()} size={20} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {currentVideoTitle}
                      </h1>
                      <div className="flex flex-wrap gap-2">
                        {video.allowedRoles?.map((role) => (
                          <Badge key={role} variant={role}>
                            {role}
                          </Badge>
                        ))}
                      </div>
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

                {video.description && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Play" size={16} />
                      <span>{video.curriculumLinks?.length + 1 || 1}개 강의</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Calendar" size={16} />
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ApperIcon name="Share2" size={16} className="mr-2" />
                      공유
                    </Button>
                    <Button variant="outline" size="sm">
                      <ApperIcon name="Bookmark" size={16} className="mr-2" />
                      저장
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Curriculum Sidebar - Desktop */}
          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CurriculumSidebar
                curriculum={buildCurriculum()}
                activeVideoId={currentVideoUrl}
                onVideoSelect={handleVideoSelect}
              />
            </motion.div>
          </div>
        </div>

        {/* Curriculum Sidebar - Mobile */}
        <div className="lg:hidden mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <CurriculumSidebar
              curriculum={buildCurriculum()}
              activeVideoId={currentVideoUrl}
              onVideoSelect={handleVideoSelect}
            />
          </motion.div>
        </div>

        {/* Edit Modal */}
        <VideoUploadModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleSubmit}
          editVideo={video}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;