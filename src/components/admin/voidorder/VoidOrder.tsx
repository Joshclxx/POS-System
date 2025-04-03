"use client";

import SectionContainer from "../../SectionContainer";
import React from "react";

const VoidOrder = () => {
  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <div className="grid grid-cols-12 mt-4">
        <div className="container bg-colorDirtyWhite w-[1280] h-[914px]">
          <p className="text-primary flex text-center items-center justify-center font-bold text-[120px]">
            VoidOrder
          </p>
        </div>
      </div>
    </SectionContainer>
  );
};

export default VoidOrder;
