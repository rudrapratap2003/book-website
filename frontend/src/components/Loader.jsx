import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="w-40 h-40">
        <DotLottieReact
          src="https://lottie.host/b30f2917-f7b1-4f29-a99f-1969335eab5c/WnockaM3UT.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default Loader;
