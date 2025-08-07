import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import userService from "@/services/api/userService";
import videoService from "@/services/api/videoService";
import blogService from "@/services/api/blogService";
import reviewService from "@/services/api/reviewService";
import { toast } from "react-toastify";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    totalPosts: 0,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [usersData, videos, posts, reviews] = await Promise.all([
        userService.getAll(),
        videoService.getAll(),
        blogService.getAll(),
        reviewService.getAll()
      ]);

      setUsers(usersData);
      setStats({
        totalUsers: usersData.length,
        totalVideos: videos.length,
        totalPosts: posts.length,
        totalReviews: reviews.length
      });
    } catch (err) {
      setError("관리자 데이터를 불러오는 중 오류가 발생했습니다.");
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const user = users.find(u => u.Id === userId);
      await userService.update(userId, { ...user, role: newRole });
      toast.success("사용자 권한이 변경되었습니다.");
      loadAdminData();
    } catch (err) {
      toast.error("권한 변경 중 오류가 발생했습니다.");
      console.error("Error updating user role:", err);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleSaveUser = async (userData) => {
    try {
      await userService.update(editingUser.Id, userData);
      toast.success("사용자 정보가 업데이트되었습니다.");
      setEditingUser(null);
      loadAdminData();
    } catch (err) {
      toast.error("사용자 정보 업데이트 중 오류가 발생했습니다.");
      console.error("Error updating user:", err);
    }
  };

  const tabs = [
    { id: "dashboard", label: "대시보드", icon: "BarChart3" },
    { id: "users", label: "회원 관리", icon: "Users" },
    { id: "content", label: "콘텐츠 관리", icon: "FileText" },
    { id: "settings", label: "설정", icon: "Settings" }
  ];

  const roles = [
    { value: "free", label: "Free", color: "green" },
    { value: "member", label: "Member", color: "blue" },
    { value: "master", label: "Master", color: "purple" },
    { value: "both", label: "Both", color: "indigo" },
    { value: "admin", label: "Admin", color: "red" }
  ];

  if (loading) return <Loading text="관리자 페이지를 로드하는 중..." />;
  if (error) return <Error message={error} onRetry={loadAdminData} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center mr-4">
              <ApperIcon name="Shield" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
                관리자 모드
              </h1>
              <p className="text-gray-600 mt-1">
                플랫폼 전체를 관리하고 모니터링하세요
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  관리자 전용 대시보드
                </h2>
                <p className="text-slate-200">
                  사용자, 콘텐츠, 시스템 설정을 통합 관리할 수 있습니다
                </p>
              </div>
              <div className="hidden md:block">
                <ApperIcon name="Crown" size={48} className="text-slate-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <ApperIcon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">총 사용자</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Users" size={24} className="text-blue-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">총 동영상</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalVideos}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Play" size={24} className="text-purple-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">총 포스트</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="FileText" size={24} className="text-emerald-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">총 후기</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="MessageCircle" size={24} className="text-pink-600" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ApperIcon name="Activity" size={20} className="mr-2" />
                  최근 활동
                </h3>
                <div className="space-y-4">
                  {[
                    { action: "새 사용자 등록", user: "김철수", time: "5분 전", type: "user" },
                    { action: "새 동영상 업로드", user: "관리자", time: "1시간 전", type: "video" },
                    { action: "새 포스트 발행", user: "관리자", time: "2시간 전", type: "post" },
                    { action: "후기 작성", user: "이영희", time: "3시간 전", type: "review" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === "user" ? "bg-blue-100" :
                        activity.type === "video" ? "bg-purple-100" :
                        activity.type === "post" ? "bg-emerald-100" : "bg-pink-100"
                      }`}>
                        <ApperIcon 
                          name={
                            activity.type === "user" ? "User" :
                            activity.type === "video" ? "Play" :
                            activity.type === "post" ? "FileText" : "MessageCircle"
                          } 
                          size={16} 
                          className={
                            activity.type === "user" ? "text-blue-600" :
                            activity.type === "video" ? "text-purple-600" :
                            activity.type === "post" ? "text-emerald-600" : "text-pink-600"
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span>님이 {activity.action}했습니다
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "users" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <ApperIcon name="Users" size={20} className="mr-2" />
                회원 관리
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">사용자</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">이메일</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">현재 권한</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">가입일</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.Id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                              <ApperIcon name="User" size={16} className="text-white" />
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{user.email}</td>
                        <td className="py-4 px-4">
                          <Badge variant={user.role}>{user.role}</Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.Id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1 focus:border-primary-500 focus:outline-none"
                            >
                              {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="p-1"
                            >
                              <ApperIcon name="Edit" size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === "content" && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ApperIcon name="FileText" size={20} className="mr-2" />
                  콘텐츠 관리
                </h3>
                <p className="text-gray-600 mb-4">
                  플랫폼의 모든 콘텐츠를 관리하고 모니터링할 수 있습니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <ApperIcon name="Video" size={24} className="mb-2" />
                    <span>동영상 관리</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <ApperIcon name="BookOpen" size={24} className="mb-2" />
                    <span>블로그 관리</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <ApperIcon name="MessageCircle" size={24} className="mb-2" />
                    <span>후기 관리</span>
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <ApperIcon name="Settings" size={20} className="mr-2" />
                시스템 설정
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    플랫폼 이름
                  </label>
                  <Input defaultValue="LearnHub Pro" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    관리자 이메일
                  </label>
                  <Input type="email" defaultValue="admin@learnhub.pro" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시스템 알림
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">새로운 사용자 등록 알림</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">콘텐츠 업로드 알림</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">시스템 오류 알림</span>
                    </label>
                  </div>
                </div>
                <Button>설정 저장</Button>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;