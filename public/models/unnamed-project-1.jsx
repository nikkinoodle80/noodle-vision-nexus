"use client";
import React from "react";
import UnnamedProject from './unnamed-project';


export default function Index() {
  return (function MainComponent({ href, text, className }) {
  return (
    <UnnamedProject href={href} text={text} className={className} />
  );
}

function StoryComponent() {
  return (
    <div>
      <MainComponent
        href="/interactive-setup-simulator"
        text="Interactive Setup Simulator:"
        className=""
      />
      <MainComponent
        href="/another-example"
        text="Another Example"
        className="another-class"
      />
    </div>
  );
});
}