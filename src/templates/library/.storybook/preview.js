import { ChakraProvider } from "@chakra-ui/react";
import theme from "../src/theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "fullscreen",
  docs: {
    source: {
      state: "open",
    },
  },
};

export const decorators = [
  (Story) => (
    <ChakraProvider theme={theme}>
      <Story />
    </ChakraProvider>
  ),
];
