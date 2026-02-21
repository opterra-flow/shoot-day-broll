export const WRAP_CHECKLIST = [
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
      "AirDrop or download all B-roll files into a Google Drive folder, separated by content type and labeled",
    ],
  },
  {
    category: "B-Roll Review",
    items: [
      "Wide shots captured for each set",
      "Medium shots captured for each set",
      "Tight / detail shots captured for each set",
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
