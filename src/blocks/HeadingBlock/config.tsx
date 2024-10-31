import { ColorPickerField } from '@/fields/colorPicker';
import type { Block } from 'payload';

export const HeadingBlock: Block = {
    slug: 'headingBlock',
    interfaceName: 'HeadingBlock',
    fields: [
        {
            name: 'text',
            label: 'Text',
            type: 'text',
        },
        {
            name: 'fontSize',
            label: 'Font Size',
            type: 'number',
        },
        {
            name: 'textAlign',
            label: 'Text Align',
            type: 'select',
            defaultValue: 'left',
            options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
            ],
        },
        ...ColorPickerField({
            name: 'color',
            required: false
        }, {
            type: 'hex',
            showPreview: true
        }),
        {
            name: 'fontWeight',
            label: 'Font Weight',
            type: 'select',
            defaultValue: '400',
            options: [
                { label: 'Normal | 400', value: '400' },
                { label: 'Medium | 500', value: '500' },
                { label: 'Semibold | 600', value: '600' },
                { label: 'Bold | 700', value: '700' },
            ],
        },
        {
            name: 'fontStyle',
            label: 'Font Style',
            type: 'select',
            defaultValue: 'normal',
            options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Italic', value: 'italic' },
            ],
        },
    ],
};
