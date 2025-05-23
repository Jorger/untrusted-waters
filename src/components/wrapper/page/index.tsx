import "./styles.css";
import React, { ReactNode } from "react";

interface PageWrapperProps {
  children: JSX.Element | JSX.Element[] | ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => (
  <div className="page-wrapper">{children}</div>
);

export default React.memo(PageWrapper);
