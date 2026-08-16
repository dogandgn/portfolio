import React from 'react';
import MapsDemo from './MapsDemo';
import WidgetDemo from './WidgetDemo';
import AutomationDemo from './AutomationDemo';
import OpenSourceDemo from './OpenSourceDemo';

export default function DemoRenderer({ projectId }) {
  switch (projectId) {
    case 1:
      return <MapsDemo />;
    case 2:
      return <WidgetDemo />;
    case 3:
      return <AutomationDemo />;
    case 4:
      return <OpenSourceDemo />;
    default:
      return null;
  }
}
