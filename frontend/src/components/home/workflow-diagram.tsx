"use client";

import { useEffect, useState } from "react";

export function WorkflowDiagram() {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    fetch("/workflow-diagram.svg?v=9", { cache: "no-store" })
      .then((r) => r.text())
      .then(setSvg);
  }, []);

  if (!svg) return <div className="mt-10 h-[460px] w-full" />;

  return (
    <div
      className="wf-diagram mt-10 w-full [&_svg]:block [&_svg]:h-auto [&_svg]:w-full [&_svg]:min-w-[960px]"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
