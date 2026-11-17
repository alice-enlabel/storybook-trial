import type { Preview } from '@storybook/react-vite'
// enLabel tokens + the Generic UI and viewer styles, so stories render like the app.
import '../src/index.css'

import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from 'storybook/viewport';
import { applySkin, DEFAULT_SKIN, SKINS } from '../src/sst/skins';

const preview: Preview = {
  // Toolbar switch (paintbrush icon): the SST skin (token overrides) every story wears.
  // SST layout is not a global: it is the recipe a template story renders.
  globalTypes: {
    skin: {
      description: 'SST skin: colour, font and radius token overrides',
      toolbar: {
        title: 'Skin',
        icon: 'paintbrush',
        items: SKINS.map((s) => ({ value: s.id, title: s.title, right: s.description })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { skin: DEFAULT_SKIN },

  decorators: [
    (Story, context) => {
      // Applied before the story renders, so there is no flash of the base skin.
      applySkin(context.globals.skin ?? DEFAULT_SKIN)
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
