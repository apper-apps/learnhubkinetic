import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import videoService from "@/services/api/videoService";
import blogService from "@/services/api/blogService";

const Home = () => {
  const navigate = useNavigate();
  const [featuredContent, setFeaturedContent] = useState({
    membershipVideos: [],
    masterVideos: [],
    blogPosts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFeaturedContent();
  }, []);

  const loadFeaturedContent = async () => {
    try {
      setLoading(true);
      setError("");

      const [membershipVideos, masterVideos, blogPosts] = await Promise.all([
        videoService.getBySection("membership"),
        videoService.getBySection("master"),
        blogService.getAll()
      ]);

      setFeaturedContent({
        membershipVideos: membershipVideos.slice(0, 3),
        masterVideos: masterVideos.slice(0, 3),
        blogPosts: blogPosts.slice(0, 3)
      });
    } catch (err) {
      setError("콘텐츠를 불러오는 중 오류가 발생했습니다.");
      console.error("Error loading featured content:", err);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: "Users",
      title: "멤버십 강의",
      description: "전문가가 직접 가르치는 체계적인 멤버십 강의로 실무 스킬을 향상시키세요.",
      color: "from-blue-500 to-blue-600",
      path: "/membership"
    },
    {
      icon: "Crown",
      title: "마스터 클래스",
      description: "업계 최고 전문가들의 심화 과정으로 전문성을 한 단계 더 높여보세요.",
      color: "from-purple-500 to-purple-600",
      path: "/master"
    },
    {
      icon: "BookOpen",
      title: "인사이트 블로그",
      description: "최신 트렌드와 실무 인사이트를 담은 전문 블로그 콘텐츠를 만나보세요.",
      color: "from-emerald-500 to-emerald-600",
      path: "/insights"
    },
    {
      icon: "MessageCircle",
      title: "도전 후기",
      description: "학습자들의 생생한 경험담과 성공 스토리를 공유하고 동기부여 받으세요.",
      color: "from-pink-500 to-pink-600",
      path: "/reviews"
    }
  ];

  if (loading) return <Loading text="홈페이지를 로드하고 있습니다..." />;
  if (error) return <Error message={error} onRetry={loadFeaturedContent} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 leading-tight">
              온라인 학습의
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                새로운 경험
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              전문가가 직접 가르치는 고품질 동영상 강의와 실무 인사이트를 통해
              <br />
              여러분의 성장을 가속화하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105"
                onClick={() => navigate("/membership")}
              >
                <ApperIcon name="Play" size={20} className="mr-2" />
                강의 둘러보기
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                onClick={() => navigate("/insights")}
              >
                <ApperIcon name="BookOpen" size={20} className="mr-2" />
                인사이트 보기
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              다양한 학습 경험
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              여러분의 학습 목표에 맞는 최적의 콘텐츠를 제공합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center group hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  <div 
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <ApperIcon name={feature.icon} size={32} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(feature.path)}
                    className="group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500"
                  >
                    자세히 보기
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              추천 콘텐츠
            </h2>
            <p className="text-lg text-gray-600">
              인기 강의와 최신 인사이트를 한 눈에 확인해보세요
            </p>
          </motion.div>

          {/* Membership Videos */}
          {featuredContent.membershipVideos.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <ApperIcon name="Users" size={24} className="mr-3 text-blue-600" />
                  멤버십 인기 강의
                </h3>
                <Button
                  variant="outline"
                  onClick={() => navigate("/membership")}
                >
                  전체 보기
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredContent.membershipVideos.map((video) => (
                  <Card key={video.Id} className="overflow-hidden group cursor-pointer">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={video.thumbnailUrl || "/default-video-thumbnail.jpg"}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => e.target.src = "/default-video-thumbnail.jpg"}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ApperIcon name="Play" size={20} className="text-primary-600 ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {video.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-1">
                          {video.allowedRoles?.slice(0, 2).map((role) => (
                            <Badge key={role} variant={role} className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {video.curriculumLinks?.length || 0}개 강의
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Master Videos */}
          {featuredContent.masterVideos.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <ApperIcon name="Crown" size={24} className="mr-3 text-purple-600" />
                  마스터 클래스
                </h3>
                <Button
                  variant="outline"
                  onClick={() => navigate("/master")}
                >
                  전체 보기
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredContent.masterVideos.map((video) => (
                  <Card key={video.Id} className="overflow-hidden group cursor-pointer">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={video.thumbnailUrl || "/default-video-thumbnail.jpg"}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => e.target.src = "/default-video-thumbnail.jpg"}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ApperIcon name="Play" size={20} className="text-purple-600 ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {video.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-1">
                          {video.allowedRoles?.slice(0, 2).map((role) => (
                            <Badge key={role} variant={role} className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {video.curriculumLinks?.length || 0}개 강의
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Blog Posts */}
          {featuredContent.blogPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <ApperIcon name="BookOpen" size={24} className="mr-3 text-emerald-600" />
                  최신 인사이트
                </h3>
                <Button
                  variant="outline"
                  onClick={() => navigate("/insights")}
                >
                  전체 보기
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredContent.blogPosts.map((post) => (
                  <Card key={post.Id} className="overflow-hidden group cursor-pointer">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={post.thumbnailUrl || "/default-blog-thumbnail.jpg"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => e.target.src = "/default-blog-thumbnail.jpg"}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {post.excerpt || "흥미로운 인사이트를 확인해보세요."}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-1">
                          {post.allowedRoles?.slice(0, 2).map((role) => (
                            <Badge key={role} variant={role} className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              지금 시작하세요
            </h2>
            <p className="text-xl mb-8 text-white/90">
              전문 강의와 인사이트로 여러분의 성장을 함께 만들어가세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100"
                onClick={() => navigate("/membership")}
              >
                <ApperIcon name="Play" size={20} className="mr-2" />
                멤버십 시작하기
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                onClick={() => navigate("/reviews")}
              >
                <ApperIcon name="MessageCircle" size={20} className="mr-2" />
                후기 보기
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;