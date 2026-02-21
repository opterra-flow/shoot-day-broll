export const WRAP_CHECKLIST = [
  {
    category: "B-Roll Review",
    items: [
      "Trim the clips",
      "AirDrop or download all B-roll files into a Google Drive folder, separated by content type and labeled",
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
    category: "Files",
    items: [
      "Files labeled & organized",
      "Selects marked or flagged",
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
