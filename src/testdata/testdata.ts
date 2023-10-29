// testdata.ts
import { WBSData, ChartRow, SeparatorRow, EventRow } from '../types/DataTypes';

export const testData: WBSData[] = [
  {
    rowType: "Separator",
    comment: "Start of ProjectA",
    displayName: "Start of ProjectA"
  } as SeparatorRow,
  {
    rowType: "Chart",
    majorCategory: "ProjectA",
    middleCategory: "Phase1",
    subCategory: "Design",
    task: "UIDesign",
    charge: "vendor",
    plannedStartDate: "2023/09/04",
    plannedEndDate: "2023/09/07",
    estimatedDaysRequired: 7,
    actualStartDate: "2023/09/03",
    actualEndDate: "2023/09/06",
    comment: "Comment on UIDesign",
    displayName: "UIDesign"
  } as ChartRow,
  {
    rowType: "Chart",
    majorCategory: "ProjectA",
    middleCategory: "Phase1",
    subCategory: "Design",
    task: "UIDesign",
    charge: "vendor",
    plannedStartDate: "2023/09/04",
    plannedEndDate: "2023/09/07",
    estimatedDaysRequired: 7,
    actualStartDate: "2023/09/03",
    actualEndDate: "2023/09/06",
    comment: "Comment on UIDesign",
    displayName: "UIDesign"
  } as ChartRow,
  {
    rowType: "Chart",
    majorCategory: "ProjectA",
    middleCategory: "Phase1",
    subCategory: "Design",
    task: "UIDesign",
    charge: "vendor",
    plannedStartDate: "2023/09/04",
    plannedEndDate: "2023/09/07",
    estimatedDaysRequired: 7,
    actualStartDate: "2023/09/03",
    actualEndDate: "2023/09/06",
    comment: "Comment on UIDesign",
    displayName: "UIDesign"
  } as ChartRow,
  {
    rowType: "Chart",
    majorCategory: "ProjectA",
    middleCategory: "Phase1",
    subCategory: "Design",
    task: "UIDesign",
    charge: "vendor",
    plannedStartDate: "2023/09/04",
    plannedEndDate: "2023/09/07",
    estimatedDaysRequired: 7,
    actualStartDate: "2023/09/03",
    actualEndDate: "2023/09/06",
    comment: "Comment on UIDesign",
    displayName: "UIDesign"
  } as ChartRow,
  {
    rowType: "Chart",
    majorCategory: "ProjectA",
    middleCategory: "Phase1",
    subCategory: "Design",
    task: "UIDesign",
    charge: "vendor",
    plannedStartDate: "2023/09/04",
    plannedEndDate: "2023/09/07",
    estimatedDaysRequired: 7,
    actualStartDate: "2023/09/03",
    actualEndDate: "2023/09/06",
    comment: "Comment on UIDesign",
    displayName: "UIDesign"
  } as ChartRow,
  {
    rowType: "Separator",
    comment: "Start of ProjectA",
    displayName: "Start of ProjectA"
  } as SeparatorRow,
  {
    rowType: "Chart",
    majorCategory: "ProjectA",
    middleCategory: "Phase1",
    subCategory: "Design2",
    task: "UXDesign",
    charge: "user",
    plannedStartDate: "2023/09/04",
    plannedEndDate: "2023/09/08",
    estimatedDaysRequired: 7,
    actualStartDate: "",
    actualEndDate: "",
    comment: "Comment on UXDesign",
    displayName: "UXDesign"
  } as ChartRow,
  {
    rowType: "Event",
    displayName: "Meetings",
    eventData: [
      {
        displayName: "RegularMeeting1",
        plannedStartDate: "2023/09/11",
        plannedEndDate: "2023/09/11",
        estimatedDaysRequired: 1,
        actualStartDate: "",
        actualEndDate: "",
        comment: "Comment on RegularMeeting1"
      },
      {
        displayName: "RegularMeeting2",
        plannedStartDate: "2023/09/15",
        plannedEndDate: "2023/09/15",
        estimatedDaysRequired: 1,
        actualStartDate: "",
        actualEndDate: "",
        comment: "Comment on RegularMeeting2"
      }
    ]
  } as EventRow
];