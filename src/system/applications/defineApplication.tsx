import { Application } from "./ApplicationRegistry";

export function defineApplication(application: {
  name: string;
  title: string;
  iconURL: string;
  component: (...props: any[]) => React.ReactNode;
}): Application {
  return {
    name: application.name,
    title: application.title,
    iconURL: application.iconURL,
    renderApplication: (props: { instanceId: string }) => (
      <application.component {...props} key={props.instanceId} />
    ),
  };
}
