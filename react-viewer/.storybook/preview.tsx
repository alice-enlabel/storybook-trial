import type { Preview } from '@storybook/react-vite'
// enLabel tokens + the Generic UI and viewer styles, so stories render like the app.
import '../src/index.css'

import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from 'storybook/viewport';
import { applySstTheme, DEFAULT_SST, SST_THEMES } from '../src/themes/sst';

const preview: Preview = {
  // Toolbar switch (paintbrush icon): which subscriber's SST CSS loads after the app styles.
  globalTypes: {
    sst: {
      description: 'SST theme (subscriber CSS loaded after the viewer styles)',
      toolbar: {
        title: 'SST',
        icon: 'paintbrush',
        items: SST_THEMES.map((t) => ({ value: t.id, title: t.title, right: t.description })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { sst: DEFAULT_SST },

  decorators: [
    (Story, context) => {
      // Applied before the story renders, so there is no flash of the base theme.
      applySstTheme(context.globals.sst ?? DEFAULT_SST)
      return Story()
    },
  ],

  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        ...MINIMAL_VIEWPORTS
      }
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;
