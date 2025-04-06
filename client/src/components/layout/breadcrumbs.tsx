import { Fragment } from "react";
import { Link, useLocation } from "wouter";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const [location] = useLocation();
  
  // Remove leading slash and create path segments
  const pathWithoutLeadingSlash = location.substring(1);
  const segments = pathWithoutLeadingSlash ? pathWithoutLeadingSlash.split('/') : [''];
  
  // Create breadcrumb items with proper formatting and links
  const breadcrumbItems = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const label = segment || 'Home';
    
    return {
      label: label.charAt(0).toUpperCase() + label.slice(1),
      path,
      isLast: index === segments.length - 1
    };
  });

  return (
    <div className={cn("px-4 py-2 bg-background border-b", className)}>
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        {breadcrumbItems.map((item, index) => (
          <Fragment key={item.path}>
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            {item.isLast ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <Link href={item.path} className="hover:text-primary">
                {item.label}
              </Link>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
