import type { Block } from 'payload';

export const SpacerBlock: Block = {
    slug: 'spacer',
    interfaceName: 'SpacerBlock',
    fields: [
        {
            name: 'space',
            label: 'Text (Give in px value)',
            type: 'number',
        },
    ],
};


