import * as P from "@phosphor-icons/react";
console.log("Total:", Object.keys(P).length);
const names = ["SquaresFour", "Checklist", "Ticket", "UserCircleGear", "Wrench", "GraduationCap", "ClockCounterClockwise", "WarningOctagon", "UserGear", "HardHat", "Stack", "Layout", "House", "Gear", "Chalkboard", "Exam", "Student", "ListChecks"];
names.forEach(n => console.log(n, "=", !!P[n]));
