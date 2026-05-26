export interface Preset {
  emoji: string;
  title: string;
  desc: string;
  names: string[];
}

export const PRESETS: Preset[] = [
  {
    emoji: "🌐",
    title: "Popular Web Stack",
    desc: "Compare the Gin HTTP framework with the Gorm ORM from the Go ecosystem.",
    names: ["gin", "gorm"],
  },
  {
    emoji: "💻",
    title: "Robust CLI",
    desc: "Highlight the libraries behind popular tools like Cobra and Gorm.",
    names: ["cobra", "gorm"],
  },
  {
    emoji: "⚡",
    title: "Telemetry & Logging",
    desc: "Compare Uber's ultra-fast Zap logger with the Gin framework.",
    names: ["zap", "gin"],
  },
];

export const PRESET_PATH_MAP: Record<string, string> = {
  gin: "github.com/gin-gonic/gin",
  gorm: "github.com/gorm/gorm",
  cobra: "github.com/spf13/cobra",
  zap: "go.uber.org/zap",
};
