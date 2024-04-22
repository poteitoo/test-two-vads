"use client";

import { useMicVAD } from "@ricky0123/vad-react";
import { useEffect, useRef } from "react";

export default function Home() {
  const audioRef1 = useRef<MediaStream | null>(null);
  const audioRef2 = useRef<MediaStream | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(
        (device) => device.kind === "audioinput"
      );
      console.log("audioDevices:", audioDevices);
    };
    getDevices();

    navigator.mediaDevices
      .getUserMedia({ audio: { deviceId: "default" }, video: false })
      .then((stream) => {
        if (audioRef1.current) {
          audioRef1.current = stream;
        }
      })
      .catch((err) => {
        console.error("Error getting media stream:", err);
      });

    navigator.mediaDevices
      .getUserMedia({
        audio: {
          deviceId:
            "76401e544eb425ee94491ce2d7bf4d465856aab893645d95823f8faf78505c1a",
        },
        video: false,
      })
      .then((stream) => {
        if (audioRef2.current) {
          audioRef2.current = stream;
        }
      })
      .catch((err) => {
        console.error("Error getting media stream:", err);
      });
  }, []);

  const vad1 = useMicVAD({
    startOnLoad: true,
    onSpeechEnd: (audio) => {
      console.log("vad1: User stopped talking");
    },
    stream: audioRef1.current ? audioRef1.current : undefined,
  });
  const vad2 = useMicVAD({
    startOnLoad: true,
    onSpeechEnd: (audio) => {
      console.log("vad2: User stopped talking");
    },
    stream: audioRef2.current ? audioRef2.current : undefined,
  });

  return (
    <>
      <div>{vad1.userSpeaking && "vad1 User is speaking"}</div>
      <div>{vad2.userSpeaking && "vad2 User is speaking"}</div>
    </>
  );
}
