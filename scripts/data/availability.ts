// Default availability settings

const availabilityData = {
  isAvailable: true,
  status: "Available" as const,
  message: undefined, // Uses default "Available {Month} {Year}"
  calendlyUrl: "https://calendly.com/sahar-h-barak/30min",
};

module.exports = { availability: availabilityData };
