import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "데이터가 없습니다",
  description = "아직 등록된 항목이 없습니다.",
  icon = "Inbox",
  action,
  actionLabel = "새로 만들기"
}) => {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} size={32} className="text-gray-500" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
        
        {action && (
          <Button 
            onClick={action} 
            className="w-full flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>{actionLabel}</span>
          </Button>
        )}
      </Card>
    </div>
  );
};

export default Empty;