import ManagementReward from "../components/managementReward";
import { motion } from "framer-motion";

const RewardManagementTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ManagementReward />
    </motion.div>
  );
};

export default RewardManagementTab;
