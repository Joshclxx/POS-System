// SectionContainer provides a consistent layout structure with
// customizable background and container styles.
// It helps maintain uniform spacing and alignment across sections,
// making it easier to manage page layout and content organization.

import React from "react";
import classNames from "classnames";

type Props = {
  background: string;
  children: React.ReactNode;
  container?: string;
};

const SectionContainer = ({ background, children, container }: Props) => {
  return (
    <section
      className={classNames(
        "flex flex-col items-center justify-start ",
        background
      )}
      style={{ marginTop: "12px " }}
    >
      <div
        className={classNames(
          "w-full max-w-[1280px] flex flex-col flex-grow",
          container
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
