import { ButtonProps } from "@chakra-ui/button";
import { VStack } from "@chakra-ui/layout";
import React from "react";
import RoundedButton from ".";

export default {
  title: "RoundedButton",
  component: RoundedButton,
};

export const Primary = ({ variant }: ButtonProps) => (
  <VStack spacing={7}>
    <RoundedButton colorScheme="blue" color="primary">
      Button
    </RoundedButton>
    <RoundedButton colorScheme="blue" variant="outline">
      Button
    </RoundedButton>
    <RoundedButton colorScheme="blue" color="primary" isLoading>
      Button
    </RoundedButton>
  </VStack>
);
