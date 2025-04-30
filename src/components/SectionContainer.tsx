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
        "flex flex-col items-center justify-start",
        background
      )}
      style={{ marginTop: "12px" }}
    >
      <div className={classNames("w-full flex flex-col flex-grow", container)}>
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
