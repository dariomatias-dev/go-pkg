import { CuratedCategory } from "@/types/curated-category";

export const CURATED_CATEGORIES: CuratedCategory[] = [
  {
    id: "web",
    name: "Web Frameworks & APIs",
    description:
      "Libraries and toolkits for building HTTP servers, REST APIs, and gRPC services in Go.",
    iconName: "Globe",
  },
  {
    id: "database",
    name: "Databases & ORMs",
    description:
      "SQL/NoSQL drivers, object-relational mappers, and high-performance query builders.",
    iconName: "Database",
  },
  {
    id: "cli",
    name: "Command Line (CLI)",
    description:
      "Frameworks for building powerful CLI tools, argument parsing, and interactive prompts.",
    iconName: "Terminal",
  },
  {
    id: "logging",
    name: "Logging & Telemetry",
    description:
      "Structured logging systems, metrics collection (Prometheus, OpenTelemetry), and tracing.",
    iconName: "Activity",
  },
  {
    id: "utilities",
    name: "Utilities & General",
    description:
      "Configuration handlers, caching, data parsing (JSON, YAML), and general-purpose tools.",
    iconName: "Cpu",
  },
  {
    id: "testing",
    name: "Testing & Mocking",
    description:
      "Assertion toolkits, mocking engines, benchmarks, and robust code coverage tools.",
    iconName: "CheckSquare",
  },
];
