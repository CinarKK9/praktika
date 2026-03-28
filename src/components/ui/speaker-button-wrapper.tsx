"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";

type SpeakerButtonProps = {
  text: string;
  language?: string;
  size?: "sm" | "md" | "lg";
};

const SpeakerButtonClient = dynamic<SpeakerButtonProps>(
  () =>
    import("./speaker-button").then(
      (mod) => mod.SpeakerButton as unknown as ComponentType<SpeakerButtonProps>
    ),
  { ssr: false, loading: () => null }
);

export function SpeakerButtonWrapper(props: SpeakerButtonProps) {
  return <SpeakerButtonClient {...props} />;
}
