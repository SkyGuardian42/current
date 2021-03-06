import React from 'react';
import { Story, Meta } from '@storybook/react';

import ImageUpload, { ImageUploadProps } from './ImageUpload';

import "../../../public/App.css"

export default {
  title: 'Components/ImageUpload',
  component: ImageUpload,
  argTypes: {
    color: {
      options: ["light", "dark", "red"]
    },
  },
} as Meta;

const Template: Story<ImageUploadProps> = (args) => <ImageUpload {...args} />;

export const Default = Template.bind({});
Default.args = {
  currentImage: null,
  setCurrentImage: (image) => {}
};

