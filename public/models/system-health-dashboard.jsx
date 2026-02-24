"use client";
import React from "react";



export default function Index() {
  return (function MainComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 mt-8">
        <h1 className="text-3xl font-medium text-blue-700 mb-4 text-center">
          Welcome to the Home AV & Modular Simulator!
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Explore these powerful features to get the most out of your setup
          using the{" "}
          <UnnamedProject1
            href="/interactive-setup-simulator"
            text="Interactive Setup Simulator"
            className="text-blue-600"
          />
          :
        </p>
        <ul className="mb-8 space-y-4">
          <li className="bg-blue-100 rounded p-4 border-l-4 border-blue-500">
            <span className="font-medium text-blue-800">
              <UnnamedProject1
                href="/interactive-setup-simulator"
                text="Interactive Setup Simulator:"
                className="underline hover:text-blue-600"
              />
            </span>{" "}
            Build and test your home audio/video or modular synth connections.
            Drag and drop devices, cables, and adapters to see what works!
          </li>
          <li className="bg-green-100 rounded p-4 border-l-4 border-green-500">
            <span className="font-medium text-green-800">
              <UnnamedProject1
                href="/adapter-chain-finder"
                text="Adapter Chain Finder:"
                className="underline hover:text-green-700"
              />
            </span>{" "}
            Instantly discover the right adapters to connect any two devices. No
            more guessing or searching forums.
          </li>
          <li className="bg-yellow-100 rounded p-4 border-l-4 border-yellow-500">
            <span className="font-medium text-yellow-800">
              <UnnamedProject1
                href="/shopping-list"
                text="Shopping List Generator:"
                className="underline hover:text-yellow-700"
              />
            </span>{" "}
            Get a complete list of cables and adapters you need for your setup,
            ready to buy.
          </li>
          <li className="bg-purple-100 rounded p-4 border-l-4 border-purple-500">
            <span className="font-medium text-purple-800">
              <UnnamedProject1
                href="/troubleshooting"
                text="Troubleshooting & Compatibility:"
                className="underline hover:text-purple-700"
              />
            </span>{" "}
            Instantly check for common issues and get tips to solve them fast.
          </li>
        </ul>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Try our tools to enhance your experience:
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a
            href="/interactive-setup-simulator"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded transition text-center"
          >
            Try the Simulator
          </a>
          <a
            href="/adapter-chain-finder"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded transition text-center"
          >
            Find Adapters
          </a>
          <a
            href="/shopping-list"
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded transition text-center"
          >
            Get Shopping List
          </a>
        </div>
      </div>
    </div>
  );
}

function UnnamedProject1({ href, text, className }) {
  return (
    <a href={href} className={`font-medium ${className}`}>
      {text}
    </a>
  );
}

function StoryComponent() {
  return (
    <div>
      <MainComponent />
    </div>
  );
});
}