import AdminDrawer from "@/components/admin/AdminDrawer";
import Spotcheck from "@/components/admin/spotcheck/Spotcheck";
import React from "react";

const page = () => {
  return (
    <div>
      <Spotcheck />
      <AdminDrawer />
    </div>
  );
};

export default page;
