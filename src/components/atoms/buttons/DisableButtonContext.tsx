// DisableButtonContext.tsx
import { createContext, useState, ReactNode, useContext } from "react";

// Define a context type
interface DisableButtonContextType {
  disablebutton: boolean;
  setDisableButton: (value: boolean) => void;
}

// Create the context with a default value
const DisableButtonContext = createContext<
  DisableButtonContextType | undefined
>(undefined);

// Create a provider component
export const DisableButtonProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [disablebutton, setDisableButton] = useState<boolean>(false);

  return (
    <DisableButtonContext.Provider value={{ disablebutton, setDisableButton }}>
      {children}
    </DisableButtonContext.Provider>
  );
};

// Custom hook to use the DisableButtonContext
export const useDisableButton = () => {
  const context = useContext(DisableButtonContext);
  if (!context) {
    throw new Error(
      "useDisableButton must be used within a DisableButtonProvider"
    );
  }
  return context;
};
