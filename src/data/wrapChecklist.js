export const WRAP_CHECKLIST = [
  {
    category: "B-Roll Review",
    items: [
      "Trim all clips to action moments",
      "AirDrop or download all B-roll files into a Google Drive folder, separated by content type and labeled",
    ],
  },
  {
    category: "Files",
    items: [
      "Files labeled & organized",
      "Organize each shoot by content type and date",
    ],
  },
  {
    category: "Gear",
    items: [
      "Memory cards backed up",
      "Batteries charged / packed",
      "All lenses accounted for",
    ],
  },
  {
    category: "Wrap",
    items: [
      "Location cleaned up",
      "Client / crew goodbyes done",
    ],
  },
];

// Total count helper
export const WRAP_TOTAL = WRAP_CHECKLIST.reduce((sum, cat) => sum + cat.items.length, 0);
