"use client";

import { useSession } from "next-auth/react";
import RakBukuPage from "./components/testRak";
import VisitPopup from "./components/testRak";
import { useState } from "react";

const page = () => {
  const { data: session, status } = useSession();
  const [showPopup, setShowPopup] = useState(true);

  // console.log(status);

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <VisitPopup
        userId={session?.user.id as string}
        isOpen={showPopup}
        onComplete={() => setShowPopup(false)}
      />
    </div>
  );
};
export default page;
