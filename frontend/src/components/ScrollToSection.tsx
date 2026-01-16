import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToSection() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // 添加小延迟确保DOM已加载
      setTimeout(() => {
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
    
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}