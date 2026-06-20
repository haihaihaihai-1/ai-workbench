import * as P from "@phosphor-icons/react";
const names = ["ListTree", "PanelRightOpen", "PanelRight", "Tree", "TreeStructure", "Square", "Spinner", "SpinnerGap", "DotsThree", "ListBullets", "ListNumbers", "ListPlus", "ListChecks"];
names.forEach(n => console.log(n, "=", !!P[n]));
