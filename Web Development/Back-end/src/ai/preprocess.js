export const encodeGender = (gender) => {
  return gender === "Male" ? 1 : 0;
};

export const encodeSleepQuality = (quality) => {
  const mapping = {
    Poor: 0,
    Fair: 1,
    Good: 2,
    Excellent: 3,
  };

  return mapping[quality] ?? 0;
};

export const encodeOccupation = (occupation) => {
  const mapping = {
    Student: 0,
    Office: 1,
    Service: 2,
    Healthcare: 3,
    Education: 4,
    Business: 5,
    Other: 6,
  };

  return mapping[occupation] ?? 6;
};

export const encodeStressLevel = (level) => {
  const mapping = {
    Low: 0,
    Medium: 1,
    High: 2,
  };

  return mapping[level] ?? 0;
};
