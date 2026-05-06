import React from 'react';
import { Metadata } from 'next';
import AsciiCameraApp from '@/components/digital/AsciiCameraApp';
import MacOSWindow from '@/components/digital/MacOSWindow';

export const metadata: Metadata = {
  title: 'ASCII Camera | Digital Tools',
  description: 'Camera app that masks detected objects with ASCII characters in real-time.',
};

export default function AsciiCameraPage() {
  return (
    <div className="min-h-[100dvh] bg-zinc-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black p-0 sm:p-6 lg:p-12 flex items-center justify-center">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none hidden sm:block"></div>

      <div className="w-full h-[100dvh] sm:h-auto max-w-5xl relative z-10 flex flex-col">
        <MacOSWindow className="shadow-none sm:shadow-2xl sm:shadow-green-900/20 ring-0 sm:ring-1 sm:ring-white/10 flex-1 sm:h-[80vh] sm:min-h-[600px] border-x-0 border-y sm:border-y-0 sm:border !rounded-none sm:!rounded-xl">
          <AsciiCameraApp />
        </MacOSWindow>
      </div>
    </div>
  );
}
