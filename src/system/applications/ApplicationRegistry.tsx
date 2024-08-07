import { ApplicationSafari } from "@/applications/Safari";
import { createContext, useContext, useMemo, useState } from "react";

export type Application = {
  name: string;
  title: string;
  iconURL: string;
  renderApplication: (props: { instanceId: string }) => React.ReactNode;
};

type ApplicationRegistry = {
  applicationRegistry: Application[];
};

const ApplicationRegistryContext = createContext<ApplicationRegistry>(
  null as any,
);

export function ApplicationRegistryProvider(props: { children: React.ReactNode }) {
  const [applicationRegistry, _setApplicationRegistry] = useState<
    ApplicationRegistry["applicationRegistry"]
  >([
    ApplicationSafari,
  ]);

  const contextValue = useMemo<ApplicationRegistry>(
    () => ({
      applicationRegistry,
    }),
    [applicationRegistry],
  );

  return (
    <ApplicationRegistryContext.Provider value={contextValue}>
      {props.children}
    </ApplicationRegistryContext.Provider>
  );
}

export function useApplicationRegistry() {
  return useContext(ApplicationRegistryContext)
}
