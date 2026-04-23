import React from 'react';

const CrashTest: React.ComponentType = () => {
  throw new Error("Test error boundary");
};

export default CrashTest;
