import { useEffect } from "react";

const useTitle = (pageTitle) => {
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);
};

export default useTitle;
