"use client";
import dynamic from "next/dynamic";

const PhishingGame = dynamic(() => import("./PhishingGame"), { ssr: false });

export default function GamePage() {
  return <PhishingGame />;
}