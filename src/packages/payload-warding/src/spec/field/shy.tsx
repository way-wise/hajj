import * as React from "react";
import { CheckboxInput as PayloadCheckbox } from "@payloadcms/ui";
import { RelationshipFieldClientComponent } from "payload";

export function shy(props: any): boolean {
  if (!props.permissions) return true;

  const {
    permissions: {
      create: { permission: c },
      read: { permission: r },
      update: { permission: u },
      delete: { permission: d },
    },
  } = props;

  return !(c || r || u || d);
}

export const Relationship: React.FC<any> = props =>
  shy(props) ? <></> : <RelationshipFieldClientComponent {...props} />;

export const Checkbox: React.FC<any> = props =>
  shy(props) ? <></> : <PayloadCheckbox {...props} />;

export default { Relationship, Checkbox, shy };
