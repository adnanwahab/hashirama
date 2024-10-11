import {Runtime, Inspector} from "@observablehq/runtime";
import notebook from "@roboticsuniversity/dynamicland";
import React, {useRef, useEffect} from "react";

function Dynamicland() {
  const ref = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook, Inspector.into(ref.current));
    return () => runtime.dispose();
  }, []);

  return (
    <>
      <div ref={ref} />
      <p>Credit: <a href="https://observablehq.com/@roboticsuniversity/dynamicland">DynamicLand by roboticsuniversity</a></p>
    </>
  );
}

export default Dynamicland;
