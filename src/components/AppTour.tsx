"use client";

import React, { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import { tourSteps } from "../lib/TourSteps";

export default function AppTour() {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const isNewUser = localStorage.getItem("newuserRide");
    if (isNewUser === "true") {
      setShowTour(true);
    }
  }, []);

  const handleTourCallback = (data: CallBackProps) => {
    const { status } = data;
    const finished = [STATUS.FINISHED, STATUS.SKIPPED].includes(
      status as "finished" | "skipped"
    );
    if (finished) {
      setShowTour(false);

      // Clear so it doesn’t show again
      localStorage.removeItem("newuserRide");
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      run={showTour}
      continuous
      showSkipButton
      showProgress
      disableScrolling
      callback={handleTourCallback}
      styles={{
        options: {
          primaryColor: "#6366F1",
          zIndex: 10000,
        },
      }}
    />
  );
}
