import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "오류가 발생했습니다.", 
  onRetry, 
  fullscreen = false 
}) => {
  const containerClass = fullscreen 
    ? "fixed inset-0 bg-white z-50 flex items-center justify-center p-4"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <Card className="p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          문제가 발생했습니다
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>
        
        {onRetry && (
          <Button 
            onClick={onRetry} 
            className="w-full flex items-center justify-center space-x-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            <span>다시 시도</span>
          </Button>
        )}
      </Card>
    </div>
  );
};

export default Error;