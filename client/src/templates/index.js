import TraditionalTemplate from "./TraditionalTemplate";
import ModernTemplate from "./ModernTemplate";

export const TEMPLATES = {
  1: TraditionalTemplate,
  2: ModernTemplate,
};

export const TEMPLATE_META = {
  1: {
    id: 1,
    name: "Traditional",
    desc: "Gold & red, classical Indian style",
    colors: ["#8b1a1a", "#c8873a", "#fffdf9"],
  },
  2: {
    id: 2,
    name: "Modern",
    desc: "Navy sidebar, clean minimal design",
    colors: ["#041f2e", "#7cc8e0", "#ffffff"],
  },
};

export { TraditionalTemplate, ModernTemplate };
