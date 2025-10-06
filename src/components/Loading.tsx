import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-primary">
      <Loader className="w-8 h-8 animate-spin text-white" />
    </div>
  );
};
export default Loading;
