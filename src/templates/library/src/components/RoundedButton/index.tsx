import React from "react";
import { ButtonProps, Button, forwardRef } from "@chakra-ui/react";

const RoundedButton = forwardRef<ButtonProps, "button">(
  ({ children, ...rest }: ButtonProps, ref) => {
    return (
      <Button ref={ref} borderRadius="1000px" {...rest}>
        {children}
      </Button>
    );
  }
);

export default RoundedButton;
