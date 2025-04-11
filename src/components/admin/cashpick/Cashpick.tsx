"use client";

import SectionContainer from "../../SectionContainer";
import React from "react";

const Cashpick = () => {
  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <div className="grid grid-cols-12 mt-4">
        <div className="container bg-colorDirtyWhite w-[1280] h-[800px]">
          {/* TITLE */}
          <div className="relative flex items-center justify-between w-full max-w-[1280px] px-6 mt-[20px]">
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center justify-center w-[414px] h-[52px] bg-secondary rounded-lg">
                <p className="text-tertiary text-[24px] font-bold">SPOTCHECK</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Cashpick;
