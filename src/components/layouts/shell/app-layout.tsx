import BottomNav from "./bottom-nav";
import TopNav from "./top-nav";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <TopNav />
      {children}
      <BottomNav />
    </div>
  );
};
export default AppLayout;
